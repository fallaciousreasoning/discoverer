import { LastFmTrack } from 'src/api/lastfm';

export enum ActionType {
    ADD_SONG = "ADD_SONG",
    REMOVE_SONG = "REMOVE_SONG",
}

export interface AddSong { type: ActionType.ADD_SONG, song: LastFmTrack }
export interface RemoveSong { type: ActionType.REMOVE_SONG, song: LastFmTrack }

export const actionCreators = {
    addSong: (song: LastFmTrack) => <AddSong>({ type: ActionType.ADD_SONG, song }),
    removeSong: (song: LastFmTrack) => <RemoveSong>({ type: ActionType.REMOVE_SONG, song }),
}