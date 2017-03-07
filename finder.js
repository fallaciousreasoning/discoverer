function initOptions(options) {
    let defaultOptions = {
        userTracks: [],
        burnUserTracks: false,
        burnSeedArtists: false,
        burnSeedTracks: false,
        includeSeedTracks: true,
        burnUsedTracks: true,
        burnUsedArtists: false,
        limit: 5,
        minDepth: 0,
        maxDepth: 1,
        maxIterations: 1000,
    }

    for (var prop in defaultOptions) {
        options[prop] = options[prop] || defaultOptions[prop];
    }

    if (options.minDepth < 0) options.minDepth = 0;
    if (options.maxDepth < options.minDepth) options.maxDepth = options.minDepth;
    if (options.maxDepth == 0) options.maxDepth = 1;
}

module.exports = class Finder {
    constructor(lastfm, options) {
        if (!lastfm) throw Error("LastFM api must be provided!");
        if (!options.seeds) throw Error("No seeds specified!");
        
        this.lastfm = lastfm;
        initOptions(options);
        this.options = options;
    }

    add(track) {
        if (this.isBurnt(track)) {
            return;
        }

        if (this.options.burnUsedArtists) {
            this.burn(track.artist);
        } else if (this.options.burnUsedTracks) {
            this.burn(track);
        }

        this.result.push(track);
    }

    burn(item) {
        // If album is set, it's a track because we don't support albums :/
        if (item.artist) {
            this.burntTracks[item.name] = true;
        } 
        // Otherwise it must be an artist.
        else {
            this.burntArtitsts[item.name] = true;
        }
    }

    isBurnt(track) {
        return this.burntTracks[track.name]
            || this.burntArtitsts[track.artist.name];
    }

    generate() { 
        this.iterations = 0;
        this.result = [];
        this.frontier = [];
        this.burntTracks = {};
        this.burntArtitsts = {};
        this.seen = {};

        if (this.options.includeSeedTracks) {
            this.options.seeds.forEach(seed => this.add(seed));
        }

        if (this.options.burnUserTracks) {
            this.options.userTracks.forEach(burn);
        }

        if (this.options.burnSeedArtists) {
            this.options.seeds.forEach(track => this.burn(track.artist));
        }  else if (this.options.burnSeedTracks) {
            this.options.seeds.forEach(track => this.burn(track));
        }

        // Add all the seed tracks to the frontier.
        this.options.seeds.forEach(track => {
            track.depth = 0;
            this.frontier.push(track);
            this.seen[track.name] = true;
        });

        return this.addSimilar(this.options.maxIterations);
    }

    addSimilar(iterations) {
        let finder = this;
        // This is a highly scientific random first search (tm)....
        let index = Math.floor(Math.random()*this.frontier.length);
        let track = this.frontier[index];
        this.frontier.splice(index, 1);

        if (track.depth >= finder.options.minDepth) {
            finder.add(track);
        }
               
        function recursor() {        
            // If we haven't done more iterations than we want and we don't have
            // enough tracks, get more.
            if (iterations > 0
                && finder.result.length < finder.options.limit
                && finder.frontier.length !== 0) {
                return finder.addSimilar(iterations - 1);
            }
        }

        if (track.depth >= finder.options.maxDepth) {
            return recursor();
        }

        return finder.lastfm.trackGetSimilar(track)
            .then(result => {
                if (!result) return;
                
                let similar = result.similartracks.track;
                for (var i = 0; i < similar.length; ++i) {
                    var s = similar[i];

                    // Make sure we haven't seen this track.
                    if (finder.seen[s.name] || track.depth + 1 > finder.options.maxDepth) {
                        continue;
                    }

                    s.depth = track.depth + 1;
                    finder.seen[s.name] = true;
                    finder.frontier.push(s);
                }
            })
            .then(recursor);  
    }
}