const Spotify = require("spotify-web-api-node");
const config = require("config.json")("./spotify-config.json");

function getTrack(spotifyApi, playlist, i, tracks, progressCallback) {
    progressCallback(i, playlist.length, tracks);

    if (i >= playlist.length) return;
    let track = playlist[i];

    return spotifyApi.searchTracks(track.name + " " + track.artist.name)
        .then(result => {
            if (result.body.tracks.items.length === 0) return;

            tracks.push(result.body.tracks.items[0].uri);
        }, error => console.log(error))
        .then(() => {
            return getTrack(spotifyApi, playlist, i + 1, tracks, progressCallback);
        });
}

module.exports = class SpotifyHelper {
    constructor(token) {
        this.spotifyApi = new Spotify({
            clientId : config.clientId,
            clientSecret : config.clientSecret,
            redirectUri : config.callbackUrl
        }); 

        this.spotifyApi.setAccessToken(token);
        this.authenticate = this.authenticate.bind(this);
        this.getTrackIds = this.getTrackIds.bind(this);
    }

    authenticate(token) {
        return token 
            ? this.spotifyApi.setAccessToken(token)
            : this.spotifyApi.clientCredentialsGrant()
                .then((data) => {
                    // Save the access token so that it's used in future calls
                    spotify.setAccessToken(data.body['access_token']);
                }, err => console.log("Bad things... " + err));
    }

    getTrackIds(playlist, progressCallback) {
        progressCallback = progressCallback || (() => {});

        var ids = [],
            i = 0;

        return getTrack(this.spotifyApi, playlist, 0, ids, progressCallback)
            .then(() => {
                return ids;
            });
    }
}