request = require("request");
querystring = require("querystring");

module.exports = class UserClient {
    constructor(apiKey, userAgent) {
        this.apiKey = apiKey;
        this.userAgent = userAgent;
    }

    getRecentTracks(opts) {
        if (!opts.user) throw Error("User was undefined!");
        opts.api_key = this.apiKey;
        opts.format = "json";
        opts.method = "user.getrecenttracks"
        var url = "http://ws.audioscrobbler.com/2.0/?" + querystring.stringify(opts);

        return new Promise((accept, reject) => {
            request
                .get({
                    url:url, 
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
}