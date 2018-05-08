import { all, takeEvery, select, put } from "redux-saga/effects";
import { ActionType, LinkToSpotify, actionCreators } from "src/store/actions";

import * as Spotify from 'spotify-web-api-js';

import { ApplicationState } from "src/store";

import { store } from 'src/index';
import { DiscoverTrack } from "src/store/generationStore";
import Linker from "../services/linker";
import { AuthorizationToken } from "../store/authorizationStore";
import { getArtistName } from "../services/lastfm";

function* link(action: LinkToSpotify) {
    const generated: DiscoverTrack[] = yield select((state: ApplicationState) => state.generation.generated);
    const token: AuthorizationToken = yield select((state: ApplicationState) => state.token);

    const client = new Spotify();
    client.setAccessToken(token.access_token);
    
    const trackUris: string[] = [];
    for (const song of generated) {
        const response = yield client.searchTracks(`${song.name} ${getArtistName(song)}`);

        if (!response.tracks || !response.tracks.items || !response.tracks.items.length) {
            continue;
        }

        const spotifyTrack = response.tracks.items[0];
        trackUris.push(spotifyTrack.uri);
        yield put(actionCreators.setSpotifyId(song, spotifyTrack.uri));
    }

    const currentUser = yield client.getMe();
    const playlist = yield client.createPlaylist(currentUser.id, {
        name: "__test__"
    });

    const step = 100;
    for (let i = 0; i < trackUris.length; i += step) {
        // Spotify only lets you add 100 track ids at a time
        const result = yield client.addTracksToPlaylist(currentUser.id, playlist.id, trackUris.slice(i, Math.min(i + step, trackUris.length)));
    }
}

export default function* () {
    yield all([
        takeEvery(ActionType.LINK_TO_SPOTIFY, link),
    ])
}