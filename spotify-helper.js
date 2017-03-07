const Spotify = require("spotify-web-api-node");
const config = require("config.json")("./spotify-config.json");

const spotify = new Spotify({
  clientId : config.clientId,
  clientSecret : config.clientSecret,
  redirectUri : config.callbackUrl
});

function getTrack(playlist, i, tracks, progressCallback) {
    progressCallback(i, playlist.length, tracks);
    
    if (i >= playlist.length) return;
    let track = playlist[i];

    return spotify.searchTracks(track.name + " " + track.artist.name)
        .then(result => {
            if (result.body.tracks.items.length === 0) return;

            tracks.push(result.body.tracks.items[0]);
        }, error => console.log(error))
        .then(() => {
            return getTrack(playlist, i + 1, tracks);
        });
}

module.exports = {
    getTrackIds: (playlist, progressCallback) => {
        progressCallback = progressCallback || (() => {});

        var ids = [],
            i = 0;

        return getTrack(playlist, 0, ids, progressCallback)
            .then(() => {
                return ids;
            });
    }
}