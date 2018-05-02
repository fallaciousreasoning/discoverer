import { Action, combineReducers } from 'redux';
import { LastFmTrack } from '../api/lastfm';
import { composeReducers, actionReducer, defaultReducer } from './reducers';
import { ActionType, AddSong, RemoveSong } from './actions';

import * as seedStore from './seedStore'

export interface ApplicationState {
    seedTracks: seedStore.SeedState;
}

const defaultState: ApplicationState = {
    seedTracks: []
};

export const reducer = {
    seedTracks: seedStore.reducer
};