let lastfm = require("./lastfm.js");

lastfm.trackSearch("white room cream")
.then(data => lastfm.trackGetSimilar(data.results[0]))
.then(console.log);