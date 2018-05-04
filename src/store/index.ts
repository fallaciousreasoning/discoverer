import { Action, combineReducers } from 'redux';
import { LastFmTrack } from 'src/services/lastfm';
import { composeReducers, actionReducer, defaultReducer } from './reducers';
import { ActionType, AddSong, RemoveSong } from './actions';

import * as seedStore from './seedStore'
import * as settingsStore from './settingsStore';

export interface ApplicationState {
    seedTracks: seedStore.SeedState;
    settings: settingsStore.Settings;
}

export const reducer = {
    seedTracks: seedStore.reducer,
    settings: settingsStore.reducer
};