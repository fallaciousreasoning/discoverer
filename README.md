# discoverer

A music discovery and playlist generation tool powered by last.fm and Spotify.

You can play with a live version [here](https://music-generator.herokuapp.com/)

## Installation

1. Clone

        git clone https://github.com/fallaciousreasoning/discoverer.git
2. Change to the repository directory 
        
        cd discoverer
3. Install npm packages

        npm install
4. Get a Last.FM api key from [Last.FM](https://www.last.fm/api/account/create)
5. Get a Spoify api key from the [Spotify Developer Console](https://developer.spotify.com/my-applications/#!/applications). You should add a callback url to `http://<YOUR_HOST>/authorize` (if you're running locally this will be `http://localhost:<PORT>/authorize`) 
5. Create a file `config.json` in the root directory with the contents

    {
        "lastfmApiKey": "<LASTFMAPIKEY>",
        "lastfmApiSecret": "<LASTFMAPISECRET>",
        "spotifyClientId": "<SPOTIFYCLIENTID>",
        "spotifyClientSecret": "<SPOTIFYCLIENTSECRET>",
        "spotifyRedirectUrl": "<CALLBACKURL>"
    }
8. Run `weback-dev-server` and open the url