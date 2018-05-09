import { Settings } from './settingsStore';
import { AuthorizationToken } from './authorizationStore';
import { Track } from './trackStore';

export enum ActionType {
    SEED_ADD_SONG = "SEED_REMOVE_SONG",
    SEED_REMOVE_SONG = "SEED_ADD_SONG",

    UPDATE_SETTINGS = "UPDATE_SETTINGS",

    GENERATION_START = "GENERATION_START",
    GENERATION_ADD_SONG = "GENERATION_ADD_SONG",
    GENERATION_REMOVE_SONG = "GENERATION_REMOVE_SONG",
    GENERATION_ADD_SIMILAR = "GENERATION_ADD_SIMILAR",

    CANCEL_SAGAS_HMR = "CANCEL_SAGAS_HMR",

    SET_TOKEN = "SET_TOKEN",

    LINK_TO_SPOTIFY = "LINK_TO_SPOTIFY",
    SET_SPOTIFY_ID = "SET_SPOTIFY_ID"
}

export interface SeedAddSong { type: ActionType.SEED_ADD_SONG, song: Track }
export interface SeedRemoveSong { type: ActionType.SEED_REMOVE_SONG, song: Track }
export interface UpdateSettings { type: ActionType.UPDATE_SETTINGS, update: Partial<Settings> }

export interface GenerationStart { type: ActionType.GENERATION_START }
export interface GenerationAddSong { type: ActionType.GENERATION_ADD_SONG, complete: boolean, progress: number, song: Track }
export interface GenerationAddSimilar { type: ActionType.GENERATION_ADD_SIMILAR, to: Track, similar: Track[] }
export interface GenerationRemoveSong { type: ActionType.GENERATION_REMOVE_SONG, song: Track }

export interface LinkToSpotify { type: ActionType.LINK_TO_SPOTIFY }
export interface SetSpotifyId {type: ActionType.SET_SPOTIFY_ID, song: Track, spotifyId: string }

export interface CancelSagasHMR { type: ActionType.CANCEL_SAGAS_HMR }

export interface SetToken { type: ActionType.SET_TOKEN, token: AuthorizationToken }

export const actionCreators = {
    addSeedSong: (song: Track) => <SeedAddSong>({ type: ActionType.SEED_ADD_SONG, song }),
    removeSeedSong: (song: Track) => <SeedRemoveSong>({ type: ActionType.SEED_REMOVE_SONG, song }),

    updateSettings: (update: Partial<Settings>) => <UpdateSettings>({ type: ActionType.UPDATE_SETTINGS, update }),

    generationStart: () => <GenerationStart>({ type: ActionType.GENERATION_START }),
    generationProgress: (progress: number, song: Track) => <GenerationAddSong>({ type: ActionType.GENERATION_ADD_SONG, complete: progress !== 1, progress, song }),
    generationRemoveSong: (song: Track) => <GenerationRemoveSong>({ type: ActionType.GENERATION_REMOVE_SONG, song }),
    generationAddSimilar: (to: Track, similar: Track[]) => <GenerationAddSimilar>({ type: ActionType.GENERATION_ADD_SIMILAR, to, similar }),

    cancelSagasHMR: () => <CancelSagasHMR>({ type: ActionType.CANCEL_SAGAS_HMR }),

    setToken: (token: AuthorizationToken) => <SetToken>({ type: ActionType.SET_TOKEN, token }),

    linkToSpotify: () => <LinkToSpotify>({ type: ActionType.LINK_TO_SPOTIFY }),
    setSpotifyId: (song: Track, spotifyId: string) => <SetSpotifyId>({ type: ActionType.SET_SPOTIFY_ID, song, spotifyId })
};