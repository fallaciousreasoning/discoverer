import { composeReducers, defaultReducer, actionReducer } from "./reducers";
import { ActionType, SeedAddSong, SeedRemoveSong } from "./actions";
import { LastFmArtist, LastFmTrack, getArtistName } from "../services/lastfm";

export interface Track {
    spotifyId?: string;
    lastfmId: string;

    artist: string;
    name: string;
    imageUrl: string;

    similarTracks: string[];
}

export type TrackState = { [id: string]: Track };

const toTrack = (lastFmTrack: LastFmTrack): Track => ({
    artist: getArtistName(lastFmTrack),
    name: lastFmTrack.name,
    lastfmId: lastFmTrack.mbid,
    imageUrl: undefined,
    similarTracks: []
});

export const reducer = composeReducers(
    defaultReducer([]),
    actionReducer([ActionType.SEED_ADD_SONG, ActionType.GENERATION_ADD_SONG], (state: TrackState, action: SeedAddSong | GenerationAddSong) => ({
        ...state,
        [action.song.mbid]: toTrack(action.song)
    }))
)
