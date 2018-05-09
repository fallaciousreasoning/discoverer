import { all, put, select, takeEvery } from "redux-saga/effects";
import * as Spotify from 'spotify-web-api-js';
import { ApplicationState } from "src/store";
import { ActionType, LinkToSpotify, actionCreators } from "src/store/actions";
import { Track } from "src/store/trackStore";
import { AuthorizationToken } from "../store/authorizationStore";
import { getGeneratedTracks } from "../store/generationStore";

function* link(action: LinkToSpotify) {
    const generated: Track[] = yield select(getGeneratedTracks);
    const token: AuthorizationToken = yield select((state: ApplicationState) => state.token);

    const client = new Spotify();
    client.setAccessToken(token.access_token);
    
    const trackUris: string[] = [];
    for (const song of generated) {
        const response = yield client.searchTracks(`${song.name} ${song.artist}`);

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