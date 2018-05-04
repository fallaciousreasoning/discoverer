import * as querystring from 'querystring';
import axios from 'axios';

const config = require('config.json');
const baseUrl = 'http://ws.audioscrobbler.com/2.0/';

interface LastFmAction {
    method: "track.search" | "track.getInfo" | "track.getSimilar" | "user.getrecenttracks";
    format?: 'json';
}

export interface LastFmTrack {
    name: string;
    artist: string | LastFmArtist;
    url: string;
    streamable: boolean;
    listeners: string;
    image: LastFmImage[];
}

export interface LastFmArtist {
    name: string;
}

interface LastFmImage {
    ['#text']: string;
    size: string;
}

export const getArtistName = (track: LastFmTrack) => typeof track.artist === "string" ? track.artist : track.artist.name;

const executeRequest = <T extends LastFmAction>(options: T) => {
    const params = querystring.stringify({
        api_key: config.lastfmApiKey,
        api_secret: config.lastfmApiSecret,
        ...options as any,
        format: options.format || 'json'
    });

    return axios.get(`${baseUrl}?${params}`, {
        headers: {
            "Accept": "*/*",
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8"
        },
        withCredentials: false,
    } as any).then(response => response.data);
}

export const trackSearch = (track: string) => {
    return executeRequest({
        method: "track.search",
        track
    }).then(data => data.results.trackmatches.track as LastFmTrack[]);
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