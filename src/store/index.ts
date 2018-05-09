import { ActionType, GenerationAddSong, LinkSetSpotifyId } from './actions';
import * as authorizationStore from './authorizationStore';
import * as generationStore from './generationStore';
import { actionReducer, composeReducers, defaultReducer } from './reducers';
import * as seedStore from './seedStore';
import * as settingsStore from './settingsStore';
import * as trackStore from './trackStore';

export interface ApplicationState {
    tracks: trackStore.TrackState;
    
    seeds: seedStore.SeedState;

    generated: generationStore.GenerationState;
    generationProgress: number;

    settings: settingsStore.Settings;
    token: authorizationStore.AuthorizationToken;
}

export const reducer = {
    tracks: trackStore.reducer,

    seeds: seedStore.reducer,
    generated: generationStore.reducer,
    generationProgress: composeReducers(
        defaultReducer(0),
        actionReducer(ActionType.GENERATION_ADD_SONG, (state, action: GenerationAddSong) => action.progress)
    ),

    linkProgress: composeReducers(
        defaultReducer(0),
        actionReducer(ActionType.LINK_SET_SPOTIFY_ID, (state, action: LinkSetSpotifyId) => action.progress)
    ),

    settings: settingsStore.reducer,
    token: authorizationStore.reducer,
};