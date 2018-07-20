import { all, takeEvery } from "redux-saga/effects";
import { ActionType, GenerationAddSimilar, GenerationAddSong, SeedAddSong } from "src/store/actions";
import { getTrack, setTrack } from "../services/dataContext";

function* addTrack(action: SeedAddSong | GenerationAddSong) {
    yield setTrack(action.song);
}

function* addTracks(action: GenerationAddSimilar) {
    const track = getTrack(action.to.id);
    yield setTrack(track);

    for (const track of action.similar) {
        yield setTrack(track); 
    }
}

export default function* () {
    yield all([
        takeEvery(ActionType.GENERATION_ADD_SONG, addTrack),
        takeEvery(ActionType.SEED_ADD_SONG, addTrack),
        takeEvery(ActionType.GENERATION_ADD_SIMILAR, addTracks),
    ])
}