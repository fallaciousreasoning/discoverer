import * as authorizationStore from './authorizationStore';
import * as generationStore from './generationStore';
import * as seedStore from './seedStore';
import * as settingsStore from './settingsStore';
import * as trackStore from './trackStore';


export interface ApplicationState {
    settings: settingsStore.Settings;
    
    seeds: seedStore.SeedState;
    generation: generationStore.GenerationState;
    token: authorizationStore.AuthorizationToken;

    tracks: trackStore.TrackState;
}

export const reducer = {
    seeds: seedStore.reducer,
    settings: settingsStore.reducer,
    generation: generationStore.reducer,
    token: authorizationStore.reducer,

    tracks: trackStore.reducer
};