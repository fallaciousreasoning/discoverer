const LastFM = require("last-fm");
const UserClient = require("./lastfm-user.js");
const TrackClient = require("./lastfm-tracks.js");
const config = require("config.json")("config.json");

const lastfm = new LastFM(config.apiKey, 'discoverer');
const userClient = new UserClient(config.apiKey);
const trackClient = new TrackClient(config.apiKey);

exports.trackSearch = (term) => {
    return new Promise((fufill, reject) => {
        lastfm.trackSearch({track:term}, (err, data) => {
            if (err) reject(err);
            else fufill(data);
        });
    });
}

exports.trackGetInfo = (track) => trackClient.trackGetInfo(track);

exports.trackGetSimilar = (track) => trackClient.trackGetSimilar(track);

exports.getRecentTracks = userClient.getRecentTracks;

exports.userAllTracks = (userName, progressCallback, page, tracks) => {
    page = page || 1;
    tracks = tracks || [];
    progressCallback = progressCallback || function(){};

    if (page === 0) progressCallback(0, 1, []);

    return userClient.getRecentTracks({user: userName, page: page, limit: 200})
        .then(result => {
            tracks.push(...result.recenttracks.track);
            var attr = result.recenttracks["@attr"];
            progressCallback(attr.page * attr.perPage, attr.total, tracks);

            if (attr.page == attr.totalPages) {
                return tracks;
            }

            return exports.userAllTracks(userName, progressCallback, page + 1, tracks);
        });
}