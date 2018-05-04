import { composeReducers, defaultReducer, actionReducer } from "src/store/reducers";
import { ActionType, RemoveSeedSong, AddSeedSong } from "src/store/actions";
import { LastFmTrack } from "src/services/lastfm";

export type SeedState = LastFmTrack[];

export const reducer = composeReducers(
    defaultReducer([]),
    actionReducer(ActionType.ADD_SEED_SONG, (state: LastFmTrack[], action: AddSeedSong) => [...state, action.song]),
    actionReducer(ActionType.REMOVE_SEED_SONG, (state: LastFmTrack[], action: RemoveSeedSong) => state.reduce((prev, next) => next === action.song ? prev : [...prev, next], []))
)