import { LastFmTrack, LastFmArtist, trackGetSimilar, getArtistName } from './lastfm';
import { Settings } from 'src/store/settingsStore';

type Progress = (percent: number, results: LastFmTrack[]) => void;

const getTrackId = (track: LastFmTrack) => `${track.name}_${getArtistName(track)}`;

interface DiscoverTrack extends LastFmTrack {
    depth: number;
    id: string;
}

export class Discoverer {
    seeds: DiscoverTrack[];

    options: Settings;
    progress: Progress;

    result: LastFmTrack[];

    burntTracks = new Set<string>();
    burntArtists = new Set<string>();
    seen = new Set<string>();

    iterations = 0;
    frontier: DiscoverTrack[] = [];

    constructor(seeds: LastFmTrack[], options: Settings, progress?: Progress) {
        if (!seeds || !seeds.length) throw Error("No seeds specified!");

        this.seeds = seeds.map(s => ({ ...s, depth: 0, id: getTrackId(s) }));
        this.options = options;
        this.progress = progress;
    }

    notifyProgress = () => this.progress && this.progress(this.result.length / this.options.limit, this.result);

    add = (track: DiscoverTrack) => {
        if (this.isBurnt(track)) {
            return;
        }

        // Burn this track/artist, if our options allow it.
        this.tryBurn(track);

        this.result.push(track);
        this.notifyProgress();
    }

    tryBurn = (track: DiscoverTrack) => {
        if (this.options.burnUsedTracks) {
            this.burnTrack(track);
        }

        if (this.options.burnUsedArtists) {
            this.burnArtist(track);
        }
    }

    burnTrack = (track: DiscoverTrack) => this.burntTracks.add(track.id);
    burnArtist = (track: DiscoverTrack) => this.burntArtists.add(getArtistName(track));

    isBurnt = (track: DiscoverTrack) => this.burntTracks.has(track.id) || this.burntArtists.has(getArtistName(track));

    generate = () => {
        if (this.options.includeSeedTracks) {
            this.seeds.forEach(seed => this.add(seed));
        }

        if (this.options.burnSeedArtists) {
            this.seeds.forEach(this.burnArtist);
        }

        if (this.options.burnSeedTracks) {
            this.seeds.forEach(this.burnTrack);
        }

        // Add all the seed tracks to the frontier.
        this.seeds.forEach(track => {
            this.frontier.push(track);
            this.seen.add(track.id)
        });

        return this.addSimilar(this.options.maxIterations);
    }

    addSimilar = (iterations: number) => {
        // This is a highly scientific random first search (tm)....
        const index = Math.floor(Math.random() * this.frontier.length);
        const track = this.frontier[index];

        // Remove the track from the frontier
        this.frontier.splice(index, 1);

        if (track.depth >= this.options.minDepth) {
            this.add(track);
        }

        const recursor = () => {
            // If we haven't done more iterations than we want and we don't have
            // enough tracks, get more.
            if (iterations > 0
                && this.result.length < this.options.limit
                && this.frontier.length !== 0) {
                return this.addSimilar(iterations - 1);
            }
        }

        if (track.depth >= this.options.maxDepth) {
            return recursor();
        }

        return trackGetSimilar(track)
            .then(similar => {
                if (!similar) return;

                for (let i = 0; i < similar.length; ++i) {
                    const similarTrack = {
                        ...similar[i],
                        depth: track.depth + 1,
                        id: getTrackId(similar[i])
                    };

                    // Make sure we haven't seen this track.
                    if (this.seen[getTrackId(similarTrack)] || track.depth + 1 > this.options.maxDepth) {
                        continue;
                    }

                    this.seen.add(similarTrack.id);
                    this.frontier.push(similarTrack);
                }
            })
            .then(recursor);
    }
}