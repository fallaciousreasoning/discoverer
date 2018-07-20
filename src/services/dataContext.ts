import * as localforage from 'localforage';
import { Track } from 'src/store/trackStore';

const trackPrefix = "track";

localforage.config({ 
    description: 'Persist information',
    name: 'discoverer',
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE]
});

const cache = {};

async function setItem<T>(key: string, item: T) {
    const itemToCache = { ...await getItem(key), ...item as any }

    cache[key] = itemToCache;
    await localforage.setItem(key, itemToCache);

    return itemToCache;
}

async function getItem(key: string) {
    const cached = cache[key];
    if (cached) return cached;

    const result = await localforage.getItem(key);
    cache[key] = result;

    return result;
}

export async function setTrack(track: Track) {
    const key = `${trackPrefix} ${track.id}`;
    return await setItem(key, track);
}

// Assumes that we've cached the track before calling this.
// A safe assumption, as we must setTrack before we can get
export function getTrack(id: string) {
    const key = `${trackPrefix} ${id}`;
    return cache[key];
}