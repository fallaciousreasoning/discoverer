const express = require('express');
const lastfm = require('./lastfm');
const Finder = require('./finder');

const bodyParser = require('body-parser')

const app = express();

const createResponse = (response, code) => {
    code = code || 200;
    return {
        response: response,
        code: 200,
    };
}

const errorResponse = (code, error) => {
    return {
        error: error,
        code: code
    }
}

app.use(express.static('static'));
app.use(bodyParser.json());
 
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
    const options = req.body;
    options.progressCallback = (done, todo) => {
        console.log(`Progress is: ${Math.round((done/todo)*10000) / 100}`);
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
            res.json(createResponse(tracks, 200));
        });
    // TODO build playlist
    // TODO send progress updates
});

app.post('/link/:service', (req, res) => {
    // TODO determine service
    // TODO link with service
    // TODO return for saving
});
 
app.listen(3000);