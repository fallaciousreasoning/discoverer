import * as querystring from 'querystring';
import { AuthorizationToken } from '../store/authorizationStore';

const config = require('config');
const spotifyAuthorizeUrl = "https://accounts.spotify.com/authorize";

export default class Authorizer {
    window: Window;

    token: AuthorizationToken;
    onAuthorized: (token: AuthorizationToken) => void;

    setToken = (token: AuthorizationToken) => this.token = token;
    setCallback = (onAuthorized: (token: AuthorizationToken) => void) => this.onAuthorized = onAuthorized;

    isAuthorized = () => !!this.token;

    listener = (ev: MessageEvent) => {
        if (!ev.data.access_token) return;
        this.onAuthorized(ev.data);
        window.removeEventListener('message', this.listener);
    }

    authorize = () => {
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
        window.addEventListener('message', this.listener);
    }
}