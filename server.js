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
        throw new Error(`Invalid session {session}!`);
    }

    sockets[session].send(JSON.stringify(message));
};

app.use(express.static('static'));
app.use(bodyParser.json());
app.use(cookieParser());
 
app.get('/search/:query', function(req, res) {
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
            res.json(errorResponse(500, "Failed to search :/"));
        });
});

app.post('/generate', (req, res) => {
    const token = req.cookies ? req.cookies[tokenCookieName] : null;
    
    if (!token) {
        res.json(errorResponse(400, 'Token cookie not set (you can get one by requesting /token)'));
        return;
    }

    if (defaultTracks) {
        res.json(createResponse(defaultTracks, 200));
        return;
    }

    const options = req.body;
    options.progressCallback = (done, todo) => {
        sendMessage(token, generateProgressMessage(Math.round((done/todo)*10000) / 100));
    }

    if (!options.seeds) {
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
    if (!req.cookies || !req.cookies[tokenCookieName]) {
        res.statusCode = 400;
        res.json(errorResponse(400, "Token cookie not set!"));
    }

    const info = req.body;
    console.log(info);

    if (!info.tracks) {
        res.statusCode = 400;
        res.json(errorResponse(400, "Tracks is compulsory!"));
    }

    if (!info.token) {
        res.statusCode = 400;
        res.json(errorResponse(400, "Spotify token not specified!"));
    }

    const token = req.cookies[tokenCookieName];    
    const spotify = new SpotifyLinker();

    spotify.getTrackIds(info.tracks, (done, total) => sendMessage(token, Math.round(done/total * 10000)/100))
        .then(tracks => {
            res.json(createResponse(tracks, 200));
        });
});

app.get('/token', (req, res) => {
    if (req.cookies && req.cookies[tokenCookieName]) {
        res.json(createResponse(req.cookies[tokenCookieName]))
        return;
    }
    const token = Guid.raw();   
    res.cookie(tokenCookieName, token)
    res.json(createResponse(token, 200));
});


const getService = (name) => {
    return loginServices.filter(service => service.name() === name)[0];
}

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
    const token = req.cookies ? req.cookies[tokenCookieName] : null;

    if (!token) {
        req.statusCode = 400;
        req.json(400, 'No token specified!');
    }

    const serviceName = req.cookies ? req.cookies[serviceNameCookie] : null;
    const service = getService(serviceName);

    if (!service) {
        res.json(errorResponse(400, `Unknown service '${req.params.service}'`));
        return;
    }

    service.callback(req, res, access_token => sendMessage(token, loggedInMessage(access_token)));
});

app.ws('/socket', (ws, req) => {
    if (!req.cookies || !req.cookies[tokenCookieName]) {
        ws.close();
        return;
    }

    const sessionName = req.cookies[tokenCookieName];
    sockets[sessionName] = ws;

    ws.on('message', msg => {
        console.log(msg);
    });

    ws.on('close', msg => {
        delete sockets[sessionName];
    });
});
 
app.listen(3000);