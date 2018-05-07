import { LastFmTrack } from 'src/services/lastfm';
import { Settings } from './settingsStore';
import { AuthorizationToken } from './authorizationStore';
import { Action } from 'redux';
import { DiscoverTrack } from './generationStore';
import { DisplayOutside } from 'csstype';

export enum ActionType {
    ADD_SEED_SONG = "ADD_SEED_SONG",
    REMOVE_SEED_SONG = "REMOVE_SEED_SONG",

    UPDATE_SETTINGS = "UPDATE_SETTINGS",

    GENERATION_RESET = "GENERATION_RESET",
    GENERATION_START = "GENERATION_START",
    GENERATION_PROGRESS = "GENERATION_PROGRESS",
    GENERATION_REMOVE_SONG = "GENERATION_REMOVE_SONG",

    CANCEL_SAGAS_HMR = "CANCEL_SAGAS_HMR",

    SET_TOKEN = "SET_TOKEN",

    LINK_TO_SPOTIFY = "LINK_TO_SPOTIFY",
    SET_SPOTIFY_ID = "SET_SPOTIFY_ID"
}

export interface AddSeedSong { type: ActionType.ADD_SEED_SONG, song: LastFmTrack }
export interface RemoveSeedSong { type: ActionType.REMOVE_SEED_SONG, song: LastFmTrack }
export interface UpdateSettings { type: ActionType.UPDATE_SETTINGS, update: Partial<Settings> }

export interface GenerationReset { type: ActionType.GENERATION_RESET }
export interface GenerationStart { type: ActionType.GENERATION_START }
export interface GenerationProgress { type: ActionType.GENERATION_PROGRESS, generating: boolean, progress: number, generated: LastFmTrack[] }
export interface GenerationRemoveSong { type: ActionType.GENERATION_REMOVE_SONG, song: LastFmTrack }
export interface LinkToSpotify { type: ActionType.LINK_TO_SPOTIFY }
export interface SetSpotifyId {type: ActionType.SET_SPOTIFY_ID, song: LastFmTrack, spotifyId: string }

export interface CancelSagasHMR { type: ActionType.CANCEL_SAGAS_HMR }

export interface SetToken { type: ActionType.SET_TOKEN, token: AuthorizationToken }

export const actionCreators = {
    addSeedSong: (song: LastFmTrack) => <AddSeedSong>({ type: ActionType.ADD_SEED_SONG, song }),
    removeSeedSong: (song: LastFmTrack) => <RemoveSeedSong>({ type: ActionType.REMOVE_SEED_SONG, song }),

    updateSettings: (update: Partial<Settings>) => <UpdateSettings>({ type: ActionType.UPDATE_SETTINGS, update }),

    generationReset: () => <GenerationReset>({ type: ActionType.GENERATION_RESET }),
    generationStart: () => <GenerationStart>({ type: ActionType.GENERATION_START }),
    generationProgress: (progress: number, generated: LastFmTrack[]) => <GenerationProgress>({ type: ActionType.GENERATION_PROGRESS, generating: progress !== 1, progress, generated }),
    generationRemoveSong: (song: LastFmTrack) => <GenerationRemoveSong>({ type: ActionType.GENERATION_REMOVE_SONG, song }),

    cancelSagasHMR: () => <CancelSagasHMR>({ type: ActionType.CANCEL_SAGAS_HMR }),

    setToken: (token: AuthorizationToken) => <SetToken>({ type: ActionType.SET_TOKEN, token }),

    linkToSpotify: () => <LinkToSpotify>({ type: ActionType.LINK_TO_SPOTIFY }),
    setSpotifyId: (song: DiscoverTrack, spotifyId: string) => <SetSpotifyId>({ type: ActionType.SET_SPOTIFY_ID, song, spotifyId })
};