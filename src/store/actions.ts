import { LastFmTrack } from 'src/api/lastfm';
import { Settings } from './settingsStore';

export enum ActionType {
    ADD_SONG = "ADD_SONG",
    REMOVE_SONG = "REMOVE_SONG",
    UPDATE_SETTINGS = "UPDATE_SETTINGS"
}

export interface AddSong { type: ActionType.ADD_SONG, song: LastFmTrack }
export interface RemoveSong { type: ActionType.REMOVE_SONG, song: LastFmTrack }
export interface UpdateSettings { type: ActionType.UPDATE_SETTINGS, update: Partial<Settings> }

export const actionCreators = {
    addSong: (song: LastFmTrack) => <AddSong>({ type: ActionType.ADD_SONG, song }),
    removeSong: (song: LastFmTrack) => <RemoveSong>({ type: ActionType.REMOVE_SONG, song }),
    updateSettings: (update: Partial<Settings>) => <UpdateSettings>({ type: ActionType.UPDATE_SETTINGS, update })
}