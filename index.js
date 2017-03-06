const LastFM = require("last-fm");
const config = require("config.json")("config.json");

console.log(config.apiKey);
const lastfm = new LastFM(config.apiKey, 'discoverer');