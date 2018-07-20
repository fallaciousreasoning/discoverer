import { ActionType, GenerationAddSong, LinkProgress, PlaylistSetName } from './actions';
import * as authorizationStore from './authorizationStore';
import * as generationStore from './generationStore';
import { actionReducer, composeReducers, defaultReducer } from './reducers';
import * as seedStore from './seedStore';
import * as settingsStore from './settingsStore';

export interface ApplicationState {
    seeds: seedStore.SeedState;

    generated: generationStore.GenerationState;
    generationProgress: number;

    linkProgress: number;

    playlistName: string;

    settings: settingsStore.Settings;
    token: authorizationStore.AuthorizationToken;
}

export const reducer = {
    seeds: seedStore.reducer,
    
    generated: generationStore.reducer,
    generationProgress: composeReducers(
        defaultReducer(0),
        actionReducer(ActionType.GENERATION_ADD_SONG, (state, action: GenerationAddSong) => action.progress)
    ),

    linkProgress: composeReducers(
        defaultReducer(0),
        actionReducer(ActionType.LINK_PROGRESS, (state, action: LinkProgress) => action.progress)
    ),

    playlistName: composeReducers(
        defaultReducer('Discover Playlist'),
        actionReducer(ActionType.PLAYLIST_SET_NAME, (state, action: PlaylistSetName) => action.name)
    ),

    settings: settingsStore.reducer,
    token: authorizationStore.reducer,
};

export const getSeedProgress = (state: ApplicationState) => state.seeds.length < 1 ? 0 : 1;
export const getLinkProgress = (state: ApplicationState) => state.linkProgress;
export const getPlaylistName = (state: ApplicationState) => state.playlistName;