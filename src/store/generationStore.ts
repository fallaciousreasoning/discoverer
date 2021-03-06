import { createSelector } from "reselect";
import { ApplicationState } from ".";
import { getTrack } from "../services/dataContext";
import { ActionType, GenerationAddSong, GenerationRemoveSong } from "./actions";
import { actionReducer, composeReducers, defaultReducer } from "./reducers";

export type GenerationState = string[];

export const reducer = composeReducers(
    defaultReducer([]),
    actionReducer(ActionType.GENERATION_START, () => []),
    actionReducer(ActionType.GENERATION_ADD_SONG, (state: GenerationState, action: GenerationAddSong) => action.song ? [...state, action.song.id] : state),
    actionReducer(ActionType.GENERATION_REMOVE_SONG, (state: GenerationState, action: GenerationRemoveSong) => {
        const generated = [...state];
        const index = generated.indexOf(action.song.id);

        generated.splice(index, 1);

        return generated;
    })
);

const getGeneratedTrackIds = (state: ApplicationState) => state.generated;
export const getGeneratedTracks = createSelector([getGeneratedTrackIds], (generatedTrackIds) => generatedTrackIds.map(getTrack).filter(t => t));
export const getGenerationProgress = (state: ApplicationState) => state.generationProgress;