import * as hash from 'object-hash';
import { createSelector } from "reselect";
import { ApplicationState } from ".";
import { ActionType, UpdateSettings } from "./actions";
import { actionReducer, composeReducers, defaultReducer } from "./reducers";
import { getSeedTracks } from "./seedStore";


export interface Settings {
    burnSeedTracks: boolean;
    burnSeedArtists: boolean;

    includeSeedTracks: boolean;

    burnUsedTracks: boolean;
    burnUsedArtists: boolean;

    limit: number;

    minDepth: number;
    maxDepth: number;
    maxIterations: number;
}

const defaultSettings: Settings = {
    burnSeedTracks: false,
    burnSeedArtists: false,

    includeSeedTracks: true,

    burnUsedTracks: true,
    burnUsedArtists: false,

    limit: 5,

    minDepth: 0,
    maxDepth: 1,
    maxIterations: 1000,
};

export const reducer = composeReducers(
    defaultReducer(defaultSettings),
    actionReducer(ActionType.UPDATE_SETTINGS, (state: Settings, action: UpdateSettings) => ({ ...state, ...action.update }))
);

export const getSettings = (state: ApplicationState) => state.settings;
export const settingsHash = createSelector([getSeedTracks, getSettings], (seeds, settings) => hash({ ...seeds, ...settings }));