import { all, takeEvery, select } from "redux-saga/effects";
import { GenerationStart, ActionType, GenerationReset } from "src/store/actions";
import { Discoverer } from "src/services/discoverer";
import { ApplicationState } from "src/store";
import { LastFmTrack } from "../services/lastfm";
import { Settings } from "../store/settingsStore";

let discoverer: Discoverer;

function* generationStart(action: GenerationStart) {
    const seeds: LastFmTrack[] = yield select((state: ApplicationState) => state.seedTracks);
    const settings: Settings = yield select((state: ApplicationState) => state.settings);

    discoverer = new Discoverer(seeds, settings, progress => console.log(progress));
    discoverer.generate();
}

function generationReset(action: GenerationReset) {
    // TODO cancel the running discoverer
}

export default function* () {
    yield all([
        takeEvery(ActionType.GENERATION_START, generationStart),
        takeEvery(ActionType.GENERATION_RESET, generationReset)
    ])
}