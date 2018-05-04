import { LastFmTrack } from "src/services/lastfm";
import { composeReducers, defaultReducer, actionReducer } from "./reducers";
import { ActionType, GenerationProgress, GenerationRemoveSong } from "./actions";

export interface GenerationState {
    generating: boolean;
    progress: number;

    generated: LastFmTrack[];
}

const defaultState: GenerationState = {
    generating: false,
    progress: 0,
    generated: []
}

export const reducer = composeReducers(
    defaultReducer(defaultState),
    actionReducer(ActionType.GENERATION_RESET, () => defaultState),
    actionReducer(ActionType.GENERATION_PROGRESS, (state: GenerationState, action: GenerationProgress) => ({
        ...state,
        generated: action.generated,
        progress: action.progress,
        generating: action.generating
    })),
    actionReducer(ActionType.GENERATION_REMOVE_SONG, (state: GenerationState, action: GenerationRemoveSong) => {
        const generated = [...state.generated];
        const index = generated.indexOf(action.song);

        generated.splice(index, 1);

        return {
            ...state,
            generated
        }
    })
);