import { Action, combineReducers } from 'redux';
import { LastFmTrack } from 'src/services/lastfm';
import { composeReducers, actionReducer, defaultReducer } from './reducers';
import { ActionType, AddSeedSong, RemoveSeedSong } from './actions';

import * as seedStore from './seedStore'
import * as settingsStore from './settingsStore';
import * as generationStore from './generationStore';

export interface ApplicationState {
    seedTracks: seedStore.SeedState;
    settings: settingsStore.Settings;
    generation: generationStore.GenerationState;
}

export const reducer = {
    seedTracks: seedStore.reducer,
    settings: settingsStore.reducer,
    generation: generationStore.reducer
};