import querystring from 'querystring';
import axios from 'axios';

const config = require('config.json');
const baseUrl = 'http://ws.audioscrobbler.com/2.0/';

interface LastFmAction {
    method: "track.search" | "track.getInfo" | "track.getSimilar" | "user.getrecenttracks";
    format?: 'json';
}

interface LastFmTrack {
    name: string;
    artist: string | LastFmArtist;
    url: string;
    streamable: boolean;
    listeners: string;
    image: string;
}

interface LastFmArtist {
    name: string;
}

interface LastFmImage {
    ['#text']: string;
    size: string;
}

const executeRequest = <T extends LastFmAction>(options: T) => {
    const params = querystring.stringify({
        api_key: config.lastfmApiKey,
        api_secret: config.lastfmApiSecret,
        ...options as any,
        format: options.format || 'json'
    });

    return axios.get(`${baseUrl}?${params}`).then(response => response.data);
}

export const trackSearch = (track: string) => {
    return executeRequest({
        method: "track.search",
        track
    }).then(data => data.result.trackmatches.track as LastFmTrack[]);
}

export const getRecentTracks = (user: string) => {
    return executeRequest({
        method: "user.getrecenttracks",
        user
    }).then(data => data.recenttracks.track as LastFmTrack[])
}

export const trackGetSimilar = (track: LastFmTrack) => {
    return executeRequest({
        method: 'track.getSimilar',
        track: track.name,
        artist: track.artist || track.artist
    }).then(data => data.similartracks.track as LastFmTrack[]);
}

export const trackGetInfo = (track: LastFmTrack) => {
    return executeRequest({
        method: 'track.getInfo',
        track: track.name,
        artist: track.artist
    }).then(data => data.track as LastFmTrack[]);
}