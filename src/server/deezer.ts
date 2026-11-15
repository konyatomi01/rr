import {
  checkDeezerBody,
  DEEZER_API_URL,
  DEEZER_TIMEOUT_MS,
  DeezerError,
  DeezerGet,
  fetchPlayableTrack,
  fetchPlaylistTracks,
} from '../shared/deezer';
import { Track } from '../shared/models';

/**
 * Server-side Deezer access for running games. Browsing and search happen in the browser
 * (so they follow the player's region); the server loads game tracks and resolves previews.
 */

const PLAYLIST_TRACKS_TTL_MS = 10 * 60_000;
const MAX_CACHE_ENTRIES = 200;

const get: DeezerGet = async <T>(path: string, params: Record<string, string | number> = {}) => {
  const url = new URL(DEEZER_API_URL + path);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));

  const res = await fetch(url, { signal: AbortSignal.timeout(DEEZER_TIMEOUT_MS) });
  if (!res.ok) throw new DeezerError(`Deezer responded with HTTP ${res.status} for ${path}`);
  return checkDeezerBody<T>(path, await res.json());
};

/** All playable tracks of a playlist. Cached briefly so repeated games don't refetch. */
export function getPlaylistTracks(playlistId: string): Promise<Track[]> {
  return cached(`playlist:${playlistId}`, PLAYLIST_TRACKS_TTL_MS, () => fetchPlaylistTracks(get, playlistId));
}

/** A track with a freshly signed preview URL. Never cached: previews expire after ~15 min. */
export function getTrack(trackId: string) {
  return fetchPlayableTrack(get, trackId);
}

/**
 * Deezer allows ~50 requests / 5 s per IP and all games share the server's IP. Stores the
 * promise so concurrent callers share one request; failed requests are evicted immediately.
 */
const cache = new Map<string, { expires: number; value: Promise<unknown> }>();

function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expires > now) return hit.value as Promise<T>;

  const value = load();
  const entry = { expires: now + ttlMs, value };
  cache.delete(key); // re-insert so Map order stays oldest-first for eviction
  cache.set(key, entry);
  value.catch(() => {
    if (cache.get(key) === entry) cache.delete(key);
  });
  if (cache.size > MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  return value;
}
