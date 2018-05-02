import { composeReducers, defaultReducer, actionReducer } from "src/store/reducers";
import { ActionType, RemoveSong, AddSong } from "src/store/actions";
import { LastFmTrack } from "src/api/lastfm";

export type SeedState = LastFmTrack[];

export const reducer = composeReducers(
    defaultReducer([]),
    actionReducer(ActionType.ADD_SONG, (state: LastFmTrack[], action: AddSong) => [...state, action.song]),
    actionReducer(ActionType.REMOVE_SONG, (state: LastFmTrack[], action: RemoveSong) => state.reduce((prev, next) => next === action.song ? prev : [...prev, next], []))
)