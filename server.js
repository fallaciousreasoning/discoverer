const express = require('express');
const lastfm = require('./lastfm');

const server = express();

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

server.use(express.static('static'));
 
server.get('/search/:query', function(req, res) {
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

server.post('/create', (req, res) => {
    // TODO build playlist
    // TODO send progress updates
});

server.post('/link/:service', (req, res) => {
    // TODO determine service
    // TODO link with service
    // TODO return for saving
});
 
server.listen(3000);