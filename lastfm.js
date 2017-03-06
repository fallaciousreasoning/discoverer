const LastFM = require("last-fm");
const config = require("config.json")("config.json");

const lastfm = new LastFM(config.apiKey, 'discoverer');

exports.trackSearch = (term) => {
    return new Promise((fufill, reject) => {
        lastfm.trackSearch({track:term}, (err, data) => {
            if (err) reject(err);
            else fufill(data);
        });
    });
}

exports.trackGetInfo = (track) => {
    if (track.name && !track.track) track.track = track.name;

    return new Promise((fufill, reject) => {
        lastfm.trackGetInfo(track, (err, data) => {
            if (err) reject(err);
            else fufill(data);
        });
    });
}

exports.trackGetSimilar = (track) => {
    if (track.name && !track.track) track.track = track.name;
    
    return new Promise((fufill, reject) => {
        lastfm.trackGetSimilar(track, (err, data) => {
            if (err) reject(err);
            else fufill(data);
        });
    });
}