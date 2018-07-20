import { Track } from 'src/model';
import { AuthorizationToken } from './authorizationStore';
import { Settings } from './settingsStore';

export enum ActionType {
    SEED_ADD_SONG = "SEED_REMOVE_SONG",
    SEED_REMOVE_SONG = "SEED_ADD_SONG",

    UPDATE_SETTINGS = "UPDATE_SETTINGS",

    GENERATION_START = "GENERATION_START",
    GENERATION_ADD_SONG = "GENERATION_ADD_SONG",
    GENERATION_REMOVE_SONG = "GENERATION_REMOVE_SONG",

    LINK_START = "LINK_START",
    LINK_PROGRESS = "LINK_PROGRESS",

    PLAYLIST_SET_NAME = "PLAYLIST_SET_NAME",

    CANCEL_SAGAS_HMR = "CANCEL_SAGAS_HMR",

    SET_TOKEN = "SET_TOKEN",
}

export interface SeedAddSong { type: ActionType.SEED_ADD_SONG, song: Track }
export interface SeedRemoveSong { type: ActionType.SEED_REMOVE_SONG, song: Track }
export interface UpdateSettings { type: ActionType.UPDATE_SETTINGS, update: Partial<Settings> }

export interface GenerationStart { type: ActionType.GENERATION_START }
export interface GenerationAddSong { type: ActionType.GENERATION_ADD_SONG, progress: number, song: Track }
export interface GenerationRemoveSong { type: ActionType.GENERATION_REMOVE_SONG, song: Track }

export interface LinkStart { type: ActionType.LINK_START }
export interface LinkProgress {type: ActionType.LINK_PROGRESS, progress: number }

export interface PlaylistSetName { type: ActionType.PLAYLIST_SET_NAME, name: string }

export interface CancelSagasHMR { type: ActionType.CANCEL_SAGAS_HMR }

export interface SetToken { type: ActionType.SET_TOKEN, token: AuthorizationToken }

export const actionCreators = {
    addSeedSong: (song: Track) => <SeedAddSong>({ type: ActionType.SEED_ADD_SONG, song }),
    removeSeedSong: (song: Track) => <SeedRemoveSong>({ type: ActionType.SEED_REMOVE_SONG, song }),

    updateSettings: (update: Partial<Settings>) => <UpdateSettings>({ type: ActionType.UPDATE_SETTINGS, update }),

    generationStart: () => <GenerationStart>({ type: ActionType.GENERATION_START }),
    generationProgress: (progress: number, song: Track) => <GenerationAddSong>({ type: ActionType.GENERATION_ADD_SONG, progress, song }),
    generationRemoveSong: (song: Track) => <GenerationRemoveSong>({ type: ActionType.GENERATION_REMOVE_SONG, song }),

    linkStart: () => <LinkStart>({ type: ActionType.LINK_START }),
    linkProgress: (progress: number) => <LinkProgress>({ type: ActionType.LINK_PROGRESS, progress }),

    playlistSetName: (name: string) => <PlaylistSetName>({ type: ActionType.PLAYLIST_SET_NAME, name }),

    cancelSagasHMR: () => <CancelSagasHMR>({ type: ActionType.CANCEL_SAGAS_HMR }),

    setToken: (token: AuthorizationToken) => <SetToken>({ type: ActionType.SET_TOKEN, token })
};