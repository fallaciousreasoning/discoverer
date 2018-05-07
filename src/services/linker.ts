import * as Spotify from 'spotify-web-api-js';
import * as querystring from 'querystring';
import { AuthorizationToken } from 'src/store/authorizationStore';
import { DiscoverTrack } from 'src/store/generationStore';
import { getArtistName } from './lastfm';

const config = require('config');

const spotifyAuthorizeUrl = "https://accounts.spotify.com/authorize";
export const AuthorizedCallbackName = "authorizedCallback";

export default class Linker {
    token: AuthorizationToken;
    callback: (song: DiscoverTrack, spotifyId: string) => void;

    constructor(token: AuthorizationToken, linked: (song: DiscoverTrack, spotifyId: string) => void) {
        this.token = token;
        this.callback = linked;
    }

    link = (songs: DiscoverTrack[]) => {
        const client = new Spotify()
        client.setAccessToken(this.token.access_token);

        if (!songs.length) {
            return;
        }

        const song = songs[0];
        client.searchTracks(`${song.name} ${getArtistName(song)}`)
            .then(result => {
                if (result && result.tracks && result.tracks.items && result.tracks.items.length) {
                    const track = result.tracks.items[0];
                    this.callback(song, track.id);
                }

                this.link(songs.slice(1))
            });
    }
}