import { composeReducers, defaultReducer, actionReducer } from "./reducers";
import { ActionType, UpdateSettings } from "./actions";

export interface Settings {
    burnSeedTracks: boolean;
    burnSeedArtists: boolean;

    includeSeedTracks: boolean;

    burnUsedTracks: boolean;
    burnUsedArtists: boolean;

    limit: number;
}

const defaultSettings: Settings = {
    burnSeedTracks: false,
    burnSeedArtists: false,

    includeSeedTracks: true,

    burnUsedTracks: true,
    burnUsedArtists: false,

    limit: 25
};

export const reducer = composeReducers(
    defaultReducer(defaultSettings),
    actionReducer(ActionType.UPDATE_SETTINGS, (state: Settings, action: UpdateSettings) => ({ ...state, ...action.update }))
);