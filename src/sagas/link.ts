import { all, put, select, takeEvery } from "redux-saga/effects";
import * as Spotify from 'spotify-web-api-js';
import { Track } from "src/model";
import { getPlaylistName } from "src/store";
import { actionCreators, ActionType, LinkStart } from "src/store/actions";
import { AuthorizationToken, getToken } from "src/store/authorizationStore";
import { getGeneratedTracks } from "src/store/generationStore";

function* link(action: LinkStart) {
    const generated: Track[] = yield select(getGeneratedTracks);
    const token: AuthorizationToken = yield select(getToken);
    const playlistName: string = yield select(getPlaylistName);

    const client = new Spotify();
    client.setAccessToken(token.access_token);

    const trackUris: string[] = [];
    for (let i = 0; i < generated.length; ++i) {
        const song = generated[i];

        // If we already have the id, update our progress and continue
        if (song.spotifyId) {
            yield put(actionCreators.linkSetSpotifyId((i + 1) / generated.length, song, song.spotifyId));
            continue;
        }
        
        const response = yield client.searchTracks(`${song.name} ${song.artist}`);

        if (!response.tracks || !response.tracks.items || !response.tracks.items.length) {
            continue;
        }

        const spotifyTrack = response.tracks.items[0];
        trackUris.push(spotifyTrack.uri);
        yield put(actionCreators.linkSetSpotifyId((i + 1) / generated.length, song, spotifyTrack.uri));
    }

    const currentUser = yield client.getMe();
    const playlist = yield client.createPlaylist(currentUser.id, {
        name: playlistName
    });

    const step = 100;
    for (let i = 0; i < trackUris.length; i += step) {
        // Spotify only lets you add 100 track ids at a time
        const result = yield client.addTracksToPlaylist(currentUser.id, playlist.id, trackUris.slice(i, Math.min(i + step, trackUris.length)));
    }
}

export default function* () {
    yield all([
        takeEvery(ActionType.LINK_START, link),
    ])
}