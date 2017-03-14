const Guid = require('guid');
const request = require("request");
const spotifyStateKey = 'spotify_auth_state';
const config = require('config.json')('spotify-config.json');

module.exports = {
    name: () => "spotify",

    login: (req, res) => {
        let state = Guid.raw();
        res.cookie(spotifyStateKey, state);

        // your application requests authorization
        let scope = 'playlist-modify-public';
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
            response_type: 'code',
            client_id: config.clientId,
            scope: scope,
            redirect_uri: config.callbackUrl,
            state: state
        }));
    },

    callback: (req, res) => {
        let code = req.query.code || null;
        let state = req.query.state || null;
        let storedState = req.cookies ? req.cookies[spotifyStateKey] : null;

        if (state === null || state !== storedState) {
            res.json({error: 'state mismatch (how did you even...?)', code: 400});
            return;
        }

        res.clearCookie(spotifyStateKey);
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: config.callbackUrl,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(config.clientId + ':' + config.clientSecret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, (error, response, body) => {
            if (error || response.statusCode != 200) {
                res.json({error: "invalid token!", code: 400});
                return;
            }

            let access_token = body.access_token,
                refresh_token = body.refresh_token;

            // let options = {
            //     url: 'https://api.spotify.com/v1/me',
            //     headers: { 'Authorization': 'Bearer ' + access_token },
            //     json: true
            // };

            // request.get(options, (error, response, body) => {
            //     console.log(body);
            // });
            
            res.json({response: {access_token: access_token, refresh_token: refresh_token}, code: 200});
        });
    },

    refresh: (req, res) => {

    }
}