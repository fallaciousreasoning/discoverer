import { ActionType, SeedAddSong, SeedRemoveSong } from "src/store/actions";
import { actionReducer, composeReducers, defaultReducer } from "src/store/reducers";

export type SeedState = string[];

export const reducer = composeReducers(
    defaultReducer([]),
    actionReducer(ActionType.SEED_ADD_SONG, (state: SeedState, action: SeedAddSong) => [...state, action.song.id]),
    actionReducer(ActionType.SEED_REMOVE_SONG, (state: SeedState, action: SeedRemoveSong) => state.reduce((prev, next) => next === action.song.id ? prev : [...prev, next], []))
)