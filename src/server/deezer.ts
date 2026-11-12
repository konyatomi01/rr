import { Playlist, Track } from '../shared/models';

/**
 * Thin client for Deezer's public API (no key needed). All music data the app shows or plays
 * goes through here, so the browser never talks to Deezer directly.
 */

const API_URL = 'https://api.deezer.com';
const REQUEST_TIMEOUT_MS = 8000;
const CHART_PAGE_SIZE = 20;
const SEARCH_LIMIT = 10;
const TRACKS_PAGE_SIZE = 100;
const MAX_PLAYLIST_TRACKS = 500;

const MINUTE = 60_000;
const CHARTS_TTL = 60 * MINUTE;
const SEARCH_TTL = 10 * MINUTE;
const PLAYLIST_TRACKS_TTL = 10 * MINUTE;
const MAX_CACHE_ENTRIES = 500;

/** Deezer reports "not found" with this error code (inside an HTTP 200 response). */
export const NO_DATA_CODE = 800;

export class DeezerError extends Error {
  constructor(message: string, readonly code?: number) {
    super(message);
  }
}

export interface PlayableTrack {
  track: Track;
  /** Signed preview URL, valid for ~15 minutes after it was fetched. */
  preview: string;
}

export function isDeezerId(id: unknown): id is string {
  return typeof id === 'string' && /^\d{1,20}$/.test(id);
}

export function getChartPlaylists(page: number): Promise<Playlist[]> {
  return cached(`charts:${page}`, CHARTS_TTL, async () => {
    const res = await get<List<DeezerPlaylist>>('/chart/0/playlists', {
      index: (page - 1) * CHART_PAGE_SIZE,
      limit: CHART_PAGE_SIZE,
    });
    return res.data.map(toPlaylist);
  });
}

export function searchPlaylists(query: string): Promise<Playlist[]> {
  return cached(`playlists:${query.toLowerCase()}`, SEARCH_TTL, async () => {
    const res = await get<List<DeezerPlaylist>>('/search/playlist', { q: query, limit: SEARCH_LIMIT });
    return res.data.map(toPlaylist);
  });
}

export function searchTracks(query: string): Promise<Track[]> {
  return cached(`tracks:${query.toLowerCase()}`, SEARCH_TTL, async () => {
    const res = await get<List<DeezerTrack>>('/search/track', { q: query, limit: SEARCH_LIMIT });
    return res.data.filter(isPlayable).map(toTrack);
  });
}

/** All playable tracks of a playlist (following Deezer's pagination). */
export function getPlaylistTracks(playlistId: string): Promise<Track[]> {
  return cached(`playlist:${playlistId}`, PLAYLIST_TRACKS_TTL, async () => {
    const tracks: Track[] = [];
    for (let index = 0; index < MAX_PLAYLIST_TRACKS; index += TRACKS_PAGE_SIZE) {
      const res = await get<List<DeezerTrack>>(`/playlist/${playlistId}/tracks`, {
        index,
        limit: TRACKS_PAGE_SIZE,
      });
      tracks.push(...res.data.filter(isPlayable).map(toTrack));
      if (!res.next || res.data.length < TRACKS_PAGE_SIZE) break;
    }
    return tracks;
  });
}

/** A track with a freshly signed preview URL. Never cached. `null` if it can't be played. */
export async function getTrack(trackId: string): Promise<PlayableTrack | null> {
  try {
    const track = await get<DeezerTrack>(`/track/${trackId}`);
    return isPlayable(track) ? { track: toTrack(track), preview: track.preview } : null;
  } catch (e) {
    if (e instanceof DeezerError && e.code === NO_DATA_CODE) return null;
    throw e;
  }
}

// --- HTTP ---------------------------------------------------------------------------------

async function get<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(API_URL + path);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));

  const res = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!res.ok) throw new DeezerError(`Deezer responded with HTTP ${res.status} for ${path}`);
  const body = await res.json();
  // Deezer signals errors (quota exceeded, not found, ...) inside a 200 response.
  if (body?.error) {
    throw new DeezerError(`Deezer error on ${path}: ${body.error.message}`, body.error.code);
  }
  return body as T;
}

// --- Cache --------------------------------------------------------------------------------

/**
 * All players share the server's IP, and Deezer allows ~50 requests / 5 s per IP, so browse
 * and search results are cached in memory. Stores the promise so concurrent callers share one
 * request; failed requests are evicted immediately.
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

// --- Mapping ------------------------------------------------------------------------------

interface List<T> {
  data: T[];
  total?: number;
  next?: string;
}

interface DeezerPlaylist {
  id: number;
  title: string;
  picture_medium: string;
  nb_tracks: number;
}

interface DeezerTrack {
  id: number;
  title: string;
  title_short?: string;
  readable?: boolean;
  preview: string;
  artist: { name: string };
  album: { cover_medium: string };
}

function isPlayable(track: DeezerTrack): boolean {
  return !!track.preview && track.readable !== false;
}

function toPlaylist(item: DeezerPlaylist): Playlist {
  return {
    id: String(item.id),
    title: item.title,
    cover: item.picture_medium,
    trackCount: item.nb_tracks,
  };
}

function toTrack(item: DeezerTrack): Track {
  return {
    id: String(item.id),
    // title_short drops suffixes like "(Remastered 2011)", which would give the answer away.
    title: item.title_short || item.title,
    artist: item.artist.name,
    cover: item.album.cover_medium,
  };
}
