import { composeReducers, defaultReducer, actionReducer } from "src/store/reducers";
import { ActionType, SeedRemoveSong, SeedAddSong } from "src/store/actions";
import { LastFmTrack } from "src/services/lastfm";

export type SeedState = LastFmTrack[];

export const reducer = composeReducers(
    defaultReducer([]),
    actionReducer(ActionType.SEED_ADD_SONG, (state: LastFmTrack[], action: SeedAddSong) => [...state, action.song]),
    actionReducer(ActionType.SEED_REMOVE_SONG, (state: LastFmTrack[], action: SeedRemoveSong) => state.reduce((prev, next) => next === action.song ? prev : [...prev, next], []))
)