import { all, takeEvery, select } from "redux-saga/effects";
import { ActionType, LinkToSpotify, actionCreators } from "src/store/actions";

import { Discoverer } from "src/services/discoverer";
import { ApplicationState } from "src/store";

import { store } from 'src/index';
import { DiscoverTrack } from "src/store/generationStore";
import Linker from "../services/linker";
import { AuthorizationToken } from "../store/authorizationStore";

let discoverer: Discoverer;

function* link(action: LinkToSpotify) {
    const generated: DiscoverTrack[] = yield select((state: ApplicationState) => state.generation.generated);
    const token: AuthorizationToken = yield select((state: ApplicationState) => state.token);
    const linker = new Linker(token, () => {});
    linker.link(generated);
}

export default function* () {
    yield all([
        takeEvery(ActionType.LINK_TO_SPOTIFY, link),
    ])
}