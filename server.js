const express = require('express');

const lastfm = require('./lastfm');
const Finder = require('./finder');
const SpotifyLinker = require('./spotify-helper');

const Guid = require('guid');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const spotifyLoginService = require('./services/spotify-login-service');

const serviceNameCookie = 'service';
const tokenCookieName = 'token';

const app = express();
const expressWs = require('express-ws')(app);

const sockets = {};

let defaultTracks = [
    {
        name:"Your Bones",
        artist:"Of Monsters and Men",
        cover:"https://lastfm-img2.akamaized…4afe4f22bf3a792cff36e87c.png",
    },
    {
        name:"Colours to Life",
        artist:"Temples",
        cover:"https://lastfm-img2.akamaized…a7e44b01cb3cda9e87680a82.png",
    }
];

const loginServices = [
    spotifyLoginService
];

const createResponse = (response, code) => {
    code = code || 200;
    return {
        response: response,
        code: 200,
    };
};

const errorResponse = (code, error) => {
    return {
        error: error,
        code: code
    };
};

const loggedInMessage = (token) => {
    return {
        route: 'token',
        data: token
    };
};

const generateProgressMessage = (progress) => {
    return {
        route: 'generate-progress',
        data: progress
    };
};

const linkProgressMessage = (progress) => {
    return {
        route: 'link-progress',
        data: progress
    };
};

const sendMessage = (session, message) => {
    if (!sockets[session]) {
        return;
    }

    sockets[session].send(JSON.stringify(message));
};

const getService = (name) => {
    return loginServices.filter(service => service.name() === name)[0];
};

app.use(express.static('static'));
app.use(bodyParser.json());
app.use(cookieParser());
 
app.get('/search/:query', function(req, res) {
    if (req.params.query.trim() === "") {
        res.json(createResponse([]));
        return;
    }

    lastfm.trackSearch(req.params.query)
        .then(result => {
            let tracks = result.results.map(t => {
                return {
                    name: t.name,
                    artist: t.artist,
                    cover: t.images[0]
            }});
            res.json(createResponse(tracks));
        }, error => {
            res.statusCode = 500;
            res.json(errorResponse(500, "Failed to search :/"));
        });
});

app.post('/generate', (req, res) => {
    const token = req.query.token;
    
    if (!token) {
        res.statusCode = 400;
        res.json(errorResponse(400, 'Token not set (you can get one by requesting /token)'));
        return;
    }

    const options = req.body;
    options.progressCallback = (done, todo) => {
        sendMessage(token, generateProgressMessage(Math.round((done/todo)*10000) / 100));
    }

    if (!options.seeds) {
        res.statusCode = 400;
        res.json(errorResponse(400, "No seed tracks specified!"));
    }

    options.seeds = options.seeds.map(seed => {
        seed.track = seed.name;
        seed.artist = {
            name: seed.artist
        };
        return seed;
    });

    // Make sure our limit is sensible.
    options.limit = options.limit || 10;
    if (options.limit > 250) options.limit = 250;

    // If our min depth is excessive, give up on it.
    if (options.minDepth > 10) options.minDepth = 10;

    const finder = new Finder(lastfm, options);
    finder
        .generate()
        .then(() => {
            const tracks = finder.result.map(track => {
                return {
                    name: track.name || track.track,
                    artist: track.artist.name,
                    cover: track.cover || (track.image.length > 0 ? track.image[0]['#text'] : "")
                }
            });

            defaultTracks = tracks;
            res.json(createResponse(tracks, 200));
        });
});

app.post('/link', (req, res) => {
    if (!req.query.token) {
        res.statusCode = 400;
        res.json(errorResponse(400, "Token not set (you can request on at /token)!"));
    }

    const info = req.body;

    if (!info.tracks) {
        res.statusCode = 400;
        res.json(errorResponse(400, "Tracks is compulsory!"));
    }

    if (!info.token) {
        res.statusCode = 400;
        res.json(errorResponse(400, "Spotify token not specified!"));
    }

    if (!info.playlistName) {
        res.statusCode = 400;
        res.json(errorResponse(400, "Playlist title not specified!"));
    }

    const token = req.query.token;    
    const spotify = new SpotifyLinker(info.token);
    let total = info.tracks.length + 2 + Math.ceil(info.tracks.length / 100);

    spotify
        .getTrackIds(info.tracks, (done) => sendMessage(token, linkProgressMessage(Math.round(done/total * 10000)/100)))
        .then(tracks => {
            return spotify.createPlaylist(info.playlistName, tracks, 25, (done) => sendMessage(token, linkProgressMessage(Math.round((info.tracks.length + done)/total * 10000)/100)));
        })
        .then((playlist) => res.json(createResponse(playlist, 200)));
});

app.get('/token', (req, res) => {
    if (req.query.token) {
        res.json(createResponse(req.query.token, 302))
        return;
    }

    const token = Guid.raw();
    res.json(createResponse(token));
});

app.get('/login/:service', (req, res) => {
    const service = getService(req.params.service);

    if (!service) {
        res.json(errorResponse(400, `Unknown service '${req.params.service}'`));
        return;
    }

    res.cookie(serviceNameCookie, req.params.service);
    
    service.login(req, res);
});

app.get('/callback', (req, res) => {
    const serviceName = req.cookies ? req.cookies[serviceNameCookie] : null;
    const service = getService(serviceName);

    if (!service) {
        res.json(errorResponse(400, `Unknown service '${req.params.service}'`));
        return;
    }

    service.callback(req, res, (token, access_token) => sendMessage(token, loggedInMessage(access_token)));
});

app.ws('/socket', (ws, req) => {
    if (!req.query.token) {
        ws.close();
        return;
    }

    const token = req.query.token;
    sockets[token] = ws;

    ws.on('message', msg => {
    });

    ws.on('close', msg => {
        delete sockets[token];
    });
});
 
app.listen(process.env.PORT || 80);