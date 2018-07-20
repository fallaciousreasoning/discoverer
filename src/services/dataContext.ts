import * as localforage from 'localforage';
import { Track } from 'src/model';

window['localForage'] = localforage;

const trackPrefix = "track";

localforage.config({
    description: 'Persist information',
    name: 'discoverer',
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE]
});

const cache = {};

const trackKey = ({ id }: { id: string }) => `${trackPrefix}|${id}`;

async function setItem<T>(key: string, item: T): Promise<T> {
    const itemToCache: T = { ...await getItem(key), ...item as any }

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
    const key = trackKey(track);
    return await setItem(key, track);
}

// Assumes that we've cached the track before calling this.
// A safe assumption, as we must setTrack before we can get
export function getTrack(id: string): Track {
    const key = trackKey({ id });
    return cache[key];
}

export async function getTracks(ids: string[]): Promise<Track[]> {
    if (!ids) {
        return [];
    }
    
    return await Promise.all(ids.map(id => getItem(trackKey({ id }))));
}