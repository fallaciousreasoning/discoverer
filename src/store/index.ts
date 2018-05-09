import * as authorizationStore from './authorizationStore';
import * as generationStore from './generationStore';
import * as seedStore from './seedStore';
import * as settingsStore from './settingsStore';
import * as trackStore from './trackStore';


export interface ApplicationState {
    tracks: trackStore.TrackState;
    
    seeds: seedStore.SeedState;
    generation: generationStore.GenerationState;

    settings: settingsStore.Settings;
    token: authorizationStore.AuthorizationToken;
}

export const reducer = {
    tracks: trackStore.reducer,

    seeds: seedStore.reducer,
    generation: generationStore.reducer,

    settings: settingsStore.reducer,
    token: authorizationStore.reducer,
};