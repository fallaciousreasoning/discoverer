let lastfm = require("./lastfm.js");
let spotify = require("./spotify-helper.js");

let Finder = require("./finder.js");

let jsonfile = require("jsonfile");

function downloadAllTracks() {
    function progress(done, total, tracks) {
        var p = done / total;
        console.log("Progress: " + Math.round(p*1000) / 10 + "%");

        jsonfile.writeFileSync("tmp-tracks.json", tracks);
    }

    lastfm.userAllTracks("dntbrsnbl", progress)
    .then((result) => {
        jsonfile.writeFileSync("tracks.json", result);
    });
}

function findTracks() {
    let finder = new Finder(lastfm, {
        seeds: [
            {
                name: "We Will Fall Together",
                album: {
                    name: "Somewhere In The Between"
                },
                artist: {
                    name: "Streetlight Manifesto"
                }
            }
        ],
        maxDepth: 2,
        burnUsedArtists: true,
        limit: 30
    });

    finder.generate().then(() => {
        jsonfile.writeFileSync("playlist.json", finder.result);
    });
}

function matchTracks() {
    let playlist = jsonfile.readFileSync("playlist.json");
    let spotifyTracks = spotify.getTrackIds(playlist)
        .then(result => {
            jsonfile.writeFileSync("spotify-playlist.json", result);
        });
}

matchTracks();