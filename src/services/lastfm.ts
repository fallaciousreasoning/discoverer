import axios from 'axios';
import * as querystring from 'querystring';
import { Track } from 'src/store/trackStore';

const config = require('config.json');
const baseUrl = 'http://ws.audioscrobbler.com/2.0/';

interface LastFmAction {
    method: "track.search" | "track.getInfo" | "track.getSimilar" | "user.getrecenttracks";
    format?: 'json';
}

interface LastFmTrack {
    name: string;
    mbid: string;
    artist: string | { name: string };
    url: string;
    streamable: boolean;
    listeners: string;
    image: LastFmImage[];
}

interface LastFmImage {
    ['#text']: string;
    size: string;
}

// If we have more than one image, take the second (medium size), otherwise take the one and only.
const artistUrl = (track: LastFmTrack) => track.image[Math.min(track.image.length - 1, 1)]['#text'];

const toTrack = (lastFmTrack: LastFmTrack): Track => ({
    artist: getArtistName(lastFmTrack),
    name: lastFmTrack.name,
    id: lastFmTrack.mbid || `${lastFmTrack.name}_${getArtistName(lastFmTrack)}`,
    imageUrl: artistUrl(lastFmTrack),
    similarTracks: []
});

const getArtistName = (track: LastFmTrack) => typeof track.artist === "string" ? track.artist : track.artist.name;

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
    })
    .then(data => data.results.trackmatches.track as LastFmTrack[])
    .then(tracks => tracks.map(toTrack));
}

export const getRecentTracks = (user: string) => {
    return executeRequest({
        method: "user.getrecenttracks",
        user
    })
    .then(data => data.recenttracks.track as LastFmTrack[])
    .then(tracks => tracks.map(toTrack));
}

export const trackGetSimilar = (track: Track) => {
    return executeRequest({
        method: 'track.getSimilar',
        track: track.name,
        artist: track.artist
    })
    .then(data => data.similartracks.track as LastFmTrack[])
    .then(tracks => tracks.map(toTrack));
}

export const trackGetInfo = (track: Track) => {
    return executeRequest({
        method: 'track.getInfo',
        track: track.name,
        artist: track.artist
    })
    .then(data => data.track as LastFmTrack[])
    .then(tracks => tracks.map(toTrack));
}