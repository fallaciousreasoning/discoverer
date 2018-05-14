import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { ApplicationState } from ".";
import { ActionType, GenerationAddSimilar, GenerationAddSong, LinkSetSpotifyId, SeedAddSong } from "./actions";
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

export const reducer = persistReducer({ key: 'tracks', storage: storage }, composeReducers(
    defaultReducer([]),
    actionReducer([ActionType.SEED_ADD_SONG, ActionType.GENERATION_ADD_SONG], (state: TrackState, action: SeedAddSong | GenerationAddSong) => action.song
        ? {
            ...state,
            [action.song.id]: { ...action.song, ...state[action.song.id] }
        }
        : state),
    actionReducer(ActionType.LINK_SET_SPOTIFY_ID, (state: TrackState, action: LinkSetSpotifyId) => ({
        ...state,
        [action.song.id]: { ...state[action.song.id], spotifyId: action.spotifyId }
    })),
    actionReducer(ActionType.GENERATION_ADD_SIMILAR, (state: TrackState, action: GenerationAddSimilar) => {
        const newState = {
            ...state,
            [action.to.id]: {
                ...state[action.to.id],
                similarTracks: action.similar.map(s => s.id)
            }
        };

        for (const s of action.similar) {
            if (newState[s.id]) continue;

            newState[s.id] = s;
        }

        return newState;
    })
));

export const getTracks = (state: ApplicationState) => state.tracks;
