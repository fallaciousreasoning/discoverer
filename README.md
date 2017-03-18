# discoverer

A music discovery and playlist generation tool powered by last.fm and Spotify.

## Installation

1. Clone

        git clone https://github.com/fallaciousreasoning/discoverer.git
2. CD into the repository `cd discoverer`
3. Install npm packages

        npm install
4. Get a Last.FM api key from [Last.FM](https://www.last.fm/api/account/create)
5. Create a file `config.json` in the root directory with the contents

        {
            "apiKey":"<YOUR_API_KEY>"
        }

6. Get a Spotify api key from the [Spotify Developer Console]. You should add a callback url to `http://<YOUR_HOST>/callback` (if you're running locally this will be `http://localhost:3000/callback`) (https://developer.spotify.com/my-applications/#!/applications)
7. Create a file `spotify-config.json` in the root directory with the contents:

        {
            "clientId":"<YOUR_SPOTIFY_CLIENT_ID",
            "clientSecret":"<YOUR_SPOTIFY_CLIENT_SECRET>",
            "callbackUrl":"http://<YOUR_SERVER>/callback"
        }
8. Compile the JavaScript bundle with `node_modules\.bin\webpack.cmd`. If you're going to be changing the client code you might find the `--watch` argument useful, as it will automatically compile every time you make a change.
9. Start the server with `node server.js`
10. Navigiate to `http://<YOUR_SERVER>/` (this will be `http://localhost:3000/` if you're running on your local machine). Hopefully you'll be greeted with a page similar to the following

![alt text](/readme_files/landing.PNG "Landing Page")