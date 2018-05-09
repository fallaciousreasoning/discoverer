import { createSelector } from "reselect";
import { ActionType, SeedAddSong, SeedRemoveSong } from "src/store/actions";
import { actionReducer, composeReducers, defaultReducer } from "src/store/reducers";
import { ApplicationState } from ".";
import { getTracks } from "./trackStore";

export type SeedState = string[];

export const reducer = composeReducers(
    defaultReducer([]),
    actionReducer(ActionType.SEED_ADD_SONG, (state: SeedState, action: SeedAddSong) => [...state, action.song.id]),
    actionReducer(ActionType.SEED_REMOVE_SONG, (state: SeedState, action: SeedRemoveSong) => state.reduce((prev, next) => next === action.song.id ? prev : [...prev, next], []))
)

const getSeedTrackIds = (state: ApplicationState) => state.seedTracks;
export const getSeedTracks = createSelector([getSeedTrackIds, getTracks], (seedTrackIds, tracks) => seedTrackIds.map(id => tracks[id]));