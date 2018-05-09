import { createSelector } from "reselect";
import { ApplicationState } from ".";
import { ActionType, GenerationAddSong, GenerationRemoveSong } from "./actions";
import { actionReducer, composeReducers, defaultReducer } from "./reducers";
import { getTracks } from "./trackStore";

export interface GenerationState {
    progress: number;

    generated: string[];
}

const defaultState: GenerationState = {
    progress: 0,
    generated: []
}

export const reducer = composeReducers(
    defaultReducer(defaultState),
    actionReducer(ActionType.GENERATION_ADD_SONG, (state: GenerationState, action: GenerationAddSong) => ({
        generated: [...state.generated, action.song.id],
        progress: action.progress
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

const getGeneratedTrackIds = (state: ApplicationState) => state.generation.generated;
export const getGeneratedTracks = createSelector([getGeneratedTrackIds, getTracks], (generatedTrackIds, tracks) => generatedTrackIds.map(id => tracks[id]));
export const getProgress = (state: ApplicationState) => state.generation.progress;