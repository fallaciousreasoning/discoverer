import { AuthorizationToken } from './authorizationStore';
import { Settings } from './settingsStore';
import { Track } from './trackStore';

export enum ActionType {
    SEED_ADD_SONG = "SEED_REMOVE_SONG",
    SEED_REMOVE_SONG = "SEED_ADD_SONG",

    UPDATE_SETTINGS = "UPDATE_SETTINGS",

    GENERATION_START = "GENERATION_START",
    GENERATION_ADD_SONG = "GENERATION_ADD_SONG",
    GENERATION_REMOVE_SONG = "GENERATION_REMOVE_SONG",
    GENERATION_ADD_SIMILAR = "GENERATION_ADD_SIMILAR",

    LINK_START = "LINK_START",
    LINK_SET_SPOTIFY_ID = "LINK_SET_SPOTIFY_ID",

    CANCEL_SAGAS_HMR = "CANCEL_SAGAS_HMR",

    SET_TOKEN = "SET_TOKEN",
}

export interface SeedAddSong { type: ActionType.SEED_ADD_SONG, song: Track }
export interface SeedRemoveSong { type: ActionType.SEED_REMOVE_SONG, song: Track }
export interface UpdateSettings { type: ActionType.UPDATE_SETTINGS, update: Partial<Settings> }

export interface GenerationStart { type: ActionType.GENERATION_START }
export interface GenerationAddSong { type: ActionType.GENERATION_ADD_SONG, progress: number, song: Track }
export interface GenerationAddSimilar { type: ActionType.GENERATION_ADD_SIMILAR, to: Track, similar: Track[] }
export interface GenerationRemoveSong { type: ActionType.GENERATION_REMOVE_SONG, song: Track }

export interface LinkStart { type: ActionType.LINK_START }
export interface LinkSetSpotifyId {type: ActionType.LINK_SET_SPOTIFY_ID, progress: number, song: Track, spotifyId: string }

export interface CancelSagasHMR { type: ActionType.CANCEL_SAGAS_HMR }

export interface SetToken { type: ActionType.SET_TOKEN, token: AuthorizationToken }

export const actionCreators = {
    addSeedSong: (song: Track) => <SeedAddSong>({ type: ActionType.SEED_ADD_SONG, song }),
    removeSeedSong: (song: Track) => <SeedRemoveSong>({ type: ActionType.SEED_REMOVE_SONG, song }),

    updateSettings: (update: Partial<Settings>) => <UpdateSettings>({ type: ActionType.UPDATE_SETTINGS, update }),

    generationStart: () => <GenerationStart>({ type: ActionType.GENERATION_START }),
    generationProgress: (progress: number, song: Track) => <GenerationAddSong>({ type: ActionType.GENERATION_ADD_SONG, progress, song }),
    generationRemoveSong: (song: Track) => <GenerationRemoveSong>({ type: ActionType.GENERATION_REMOVE_SONG, song }),
    generationAddSimilar: (to: Track, similar: Track[]) => <GenerationAddSimilar>({ type: ActionType.GENERATION_ADD_SIMILAR, to, similar }),

    linkStart: () => <LinkStart>({ type: ActionType.LINK_START }),
    linkSetSpotifyId: (progress: number, song: Track, spotifyId: string) => <LinkSetSpotifyId>({ type: ActionType.LINK_SET_SPOTIFY_ID, progress, song, spotifyId }),

    cancelSagasHMR: () => <CancelSagasHMR>({ type: ActionType.CANCEL_SAGAS_HMR }),

    setToken: (token: AuthorizationToken) => <SetToken>({ type: ActionType.SET_TOKEN, token })
};