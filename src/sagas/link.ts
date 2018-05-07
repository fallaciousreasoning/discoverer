import { all, takeEvery, select } from "redux-saga/effects";
import { ActionType, LinkToSpotify, actionCreators } from "src/store/actions";

import { Discoverer } from "src/services/discoverer";
import { ApplicationState } from "src/store";

import { store } from 'src/index';
import { DiscoverTrack } from "src/store/generationStore";

let discoverer: Discoverer;

function* link(action: LinkToSpotify) {
    const seeds: DiscoverTrack[] = yield select((state: ApplicationState) => state.generation.generated);
    
}

export default function* () {
    yield all([
        takeEvery(ActionType.LINK_TO_SPOTIFY, link),
    ])
}