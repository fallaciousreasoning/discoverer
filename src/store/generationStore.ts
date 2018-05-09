import { ActionType, GenerationAddSong, GenerationRemoveSong } from "./actions";
import { actionReducer, composeReducers, defaultReducer } from "./reducers";

export interface GenerationState {
    complete: boolean;
    progress: number;

    generated: string[];
}

const defaultState: GenerationState = {
    complete: false,
    progress: 0,
    generated: []
}

export const reducer = composeReducers(
    defaultReducer(defaultState),
    actionReducer(ActionType.GENERATION_ADD_SONG, (state: GenerationState, action: GenerationAddSong) => ({
        generated: [state.generated, action.song.id],
        progress: action.progress,
        complete: action.complete
    })),
    actionReducer(ActionType.GENERATION_REMOVE_SONG, (state: GenerationState, action: GenerationRemoveSong) => {
        const generated = [...state.generated];
        const index = generated.indexOf(action.song.id);

        generated.splice(index, 1);

        return {
            ...state,
            generated
        }
    })
);