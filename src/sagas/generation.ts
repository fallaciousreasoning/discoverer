import { all, fork, put, select, takeEvery } from "redux-saga/effects";
import { Track } from "src/model";
import { trackGetSimilar } from "src/services/lastfm";
import { actionCreators, ActionType, GenerationStart } from "src/store/actions";
import { getSeedTracks } from "src/store/seedStore";
import { getSettings, Settings } from "src/store/settingsStore";
import { getTrack } from "../services/dataContext";

interface DiscoverTrack extends Track {
    depth: number;
}

const tracks: DiscoverTrack[] = [];

function* generationStart(action: GenerationStart) {
    const rawSeeds: Track[] = yield select(getSeedTracks);
    const seeds: DiscoverTrack[] = rawSeeds.map(s => ({...s, depth: 0 }));

    const settings: Settings = yield select(getSettings);
    let cancel = false;

    // On every router change event, cancel generation.
    yield fork(function *() {
        yield takeEvery('@@router/LOCATION_CHANGE', function() {
            cancel = true;
        });
    })

    if (!seeds || !seeds.length) {
        return;
    }

    const frontier: DiscoverTrack[] = [];
    const burntTracks = new Set<string>();
    const burntArtists = new Set<string>();
    const seen = new Set<string>();

    let result: DiscoverTrack[] = [];
    let iteration = 0;

    const burnTrack = (track: DiscoverTrack) => burntTracks.add(track.id);
    const burnArtist = (track: DiscoverTrack) => burntArtists.add(track.artist);

    const tryBurn = (track: DiscoverTrack) => {
        if (settings.burnUsedTracks) {
            burnTrack(track);
        }

        if (settings.burnUsedArtists) {
            burnArtist(track);
        }
    }

    const isBurnt = (track: DiscoverTrack) => burntTracks.has(track.id) || burntArtists.has(track.artist);

    const add = (track: DiscoverTrack) => {
        if (isBurnt(track)) {
            return;
        }

        // Burn this track/artist, if our options allow it.
        tryBurn(track);

        result.push(track);

        return put(actionCreators.generationProgress(result.length / settings.limit, track))
    }

    if (settings.includeSeedTracks) {
        for (const seed of seeds)
            yield add(seed);
    }

    if (settings.burnSeedArtists) {
        seeds.forEach(burnArtist);
    }

    if (settings.burnSeedTracks) {
        seeds.forEach(burnTrack);
    }

    seeds.forEach(seed => {
        frontier.push(seed);
        seen.add(seed.id);
    })

    while (iteration < settings.maxIterations
        && result.length < settings.limit
        && frontier.length !== 0) {

        iteration += 1;

        // This is a highly scientific random first search (tm)....
        const index = Math.floor(Math.random() * frontier.length);
        const track = frontier[index];

        // Remove the track from the frontier
        frontier.splice(index, 1);

        if (track.depth < settings.minDepth || track.depth > settings.maxDepth) {
            continue;
        } 

        if (cancel) {
            // If the route has changed, cancel generation.
            return;
        }
        
        yield add(track);

        let similar = track.similarTracks.map(getTrack).filter(t => t);

        if (!similar.length) {
            similar = yield trackGetSimilar(track);
            yield put(actionCreators.generationAddSimilar(track, similar));
        }
        if (!similar || !similar.length) continue;

        similar.forEach(s => {
            const similarTrack = {
                ...s,
                depth: track.depth + 1
            };

            if (seen[similarTrack.id] || similarTrack.depth > settings.maxDepth) {
                return;
            }

            seen.add(similarTrack.id);
            frontier.push(similarTrack);
        });
    }

    // Make sure we say we're done.
    yield put(actionCreators.generationProgress(1, undefined))
}

export default function* () {
    yield all([
        takeEvery(ActionType.GENERATION_START, generationStart)
    ])
}