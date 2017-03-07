let lastfm = require("./lastfm.js");
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
        ]
    });

    finder.generate().then(() => {
        console.log(finder.result);
    });
}

findTracks();