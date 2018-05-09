import { LastFmTrack, getArtistName } from "../services/lastfm";
import { ActionType, GenerationAddSong, SeedAddSong, SetSpotifyId } from "./actions";
import { actionReducer, composeReducers, defaultReducer } from "./reducers";

export interface Track {
    spotifyId?: string;
    id: string;

    artist: string;
    name: string;
    imageUrl: string;

    similarTracks: string[];
}

export type TrackState = { [id: string]: Track };

export const toTrack = (lastFmTrack: LastFmTrack): Track => ({
    artist: getArtistName(lastFmTrack),
    name: lastFmTrack.name,
    id: lastFmTrack.mbid,
    imageUrl: undefined,
    similarTracks: []
});

export const reducer = composeReducers(
    defaultReducer([]),
    actionReducer([ActionType.SEED_ADD_SONG, ActionType.GENERATION_ADD_SONG], (state: TrackState, action: SeedAddSong | GenerationAddSong) => ({
        ...state,
        [action.song.id]: action.song
    })),
    actionReducer(ActionType.SET_SPOTIFY_ID, (state: TrackState, action: SetSpotifyId) => ({
        ...state,
        [action.song.id]: action.spotifyId
    }))
)
