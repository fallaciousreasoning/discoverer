import * as Spotify from 'spotify-web-api-js';
import * as querystring from 'querystring';

const config = require('config');

const spotifyAuthorizeUrl = "https://accounts.spotify.com/authorize";

export interface AuthorizationToken {
    authorizationToken: string;
    expiresIn: number;
    tokenType: string;
}

export default class Authorizer {
    window: Window;

    token: AuthorizationToken;
    onAuthorized: (token: AuthorizationToken) => void;

    setToken = (token: AuthorizationToken) => this.token = token;
    setCallback = (onAuthorized: (token: AuthorizationToken) => void) => this.onAuthorized = onAuthorized;

    isAuthorized = () => !!this.token;

    authorize = () => {
        if (this.isAuthorized()) {
            this.onAuthorized(this.token);
            return;
        }

        const queryParams = {
            client_id: config.spotifyClientId,
            response_type: 'token',
            redirect_uri: config.spotifyRedirectUrl,
            show_dialog: false,
            scope: "playlist-modify-public"
        };

        const queryString = querystring.stringify(queryParams);
        const url = `${spotifyAuthorizeUrl}?${queryString}`;

        this.window = window.open(url);
        this.window["authorizedCallback"] = this.onAuthorized;
    }
}