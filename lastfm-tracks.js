request = require("request");
querystring = require("querystring");

module.exports = class TrackClient {
    constructor(apiKey, userAgent) {
        this.apiKey = apiKey;
        this.userAgent = userAgent;
    }

    trackGetSimilar(track) {
        let queryParams = {
            track: track.name || track.track,
            api_key: this.apiKey,
            artist: track.artist.name,
            method: 'track.getsimilar',
            format: "json"
        }

        let url = "http://ws.audioscrobbler.com/2.0/?" + querystring.stringify(queryParams);
        return new Promise((accept, reject) => {
            request
                .get({
                    url: url, 
                    headers: {
                        "User-Agent": this.userAgent
                    }
                },
                (err, response, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    var result = JSON.parse(body);
                    if (result.error) reject(result);
                    else accept(result);
                });
        });
    }

    trackGetInfo(track) {
        let queryParams = {
            track: track.name || track.track,
            api_key: this.apiKey,
            artist: track.artist.name,
            method: 'track.getInfo',
            format: "json"
        }

        let url = "http://ws.audioscrobbler.com/2.0/?" + querystring.stringify(queryParams);
        return new Promise((accept, reject) => {
            request
                .get({
                    url: url, 
                    headers: {
                        "User-Agent": this.userAgent
                    }
                },
                (err, response, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    var result = JSON.parse(body);
                    if (result.error) reject(result);
                    else accept(result.track);
                });
        });
    }
}