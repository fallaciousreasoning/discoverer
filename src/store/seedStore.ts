import { createSelector } from "reselect";
import { ApplicationState } from ".";
import { getTrack } from '../services/dataContext';
import { ActionType, SeedAddSong, SeedRemoveSong } from "./actions";
import { actionReducer, composeReducers, defaultReducer } from "./reducers";

export type SeedState = string[];

export const reducer = composeReducers(
    defaultReducer([]),
    actionReducer(ActionType.SEED_ADD_SONG, (state: SeedState, action: SeedAddSong) => [...state, action.song.id]),
    actionReducer(ActionType.SEED_REMOVE_SONG, (state: SeedState, action: SeedRemoveSong) => state.reduce((prev, next) => next === action.song.id ? prev : [...prev, next], []))
)

const getSeedTrackIds = (state: ApplicationState) => state.seeds;
export const getSeedTracks = createSelector([getSeedTrackIds], (seedTrackIds) => seedTrackIds.map(getTrack).filter(t => t));