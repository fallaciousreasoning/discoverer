import { Action, combineReducers } from 'redux';
import { LastFmTrack } from '../api/lastfm';
import { composeReducers, actionReducer, defaultReducer } from './reducers';
import { ActionType, AddSong, RemoveSong } from './actions';

export interface ApplicationState {
    songs: LastFmTrack[];
}

const defaultState: ApplicationState = {
    songs: []
};

export const reducer = composeReducers(
    defaultReducer(defaultState),
    actionReducer(ActionType.ADD_SONG, (state: ApplicationState, action: AddSong) => ({
        ...state,
        songs: [...state.songs, action.song]
    })),
    actionReducer(ActionType.REMOVE_SONG, (state: ApplicationState, action: RemoveSong) => ({
        ...state,
        songs: state.songs.reduce((prev, next) => next === action.song ? prev : [...prev, next], [])
    }))
)