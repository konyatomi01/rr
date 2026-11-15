/**
 * Deezer public API (no key needed): response shapes, mapping to app models, and the queries
 * the app runs. Shared by the browser (JSONP, so results follow the player's region) and the
 * game server (fetch). Keep this free of runtime imports so both sides can compile it.
 */
import { Playlist, Track } from './models';

export const DEEZER_API_URL = 'https://api.deezer.com';
export const DEEZER_TIMEOUT_MS = 8000;
/** Deezer reports "not found" with this error code (inside an HTTP 200 response). */
export const NO_DATA_CODE = 800;
/** Deezer's chart has 100 playlists, served in pages of this size. */
export const CHART_PAGE_SIZE = 20;
export const CHART_PAGE_COUNT = 5;

const SEARCH_LIMIT = 10;
const TRACKS_PAGE_SIZE = 100;
const MAX_PLAYLIST_TRACKS = 500;

export class DeezerError extends Error {
  constructor(message: string, readonly code?: number) {
    super(message);
  }
}

/** Performs one API call; must throw a `DeezerError` when the body contains `error`. */
export type DeezerGet = <T>(path: string, params?: Record<string, string | number>) => Promise<T>;

/** Throws if Deezer signalled an error, which it does inside a 200 response. */
export function checkDeezerBody<T>(path: string, body: unknown): T {
  const error = (body as DeezerErrorBody | null)?.error;
  if (error) throw new DeezerError(`Deezer error on ${path}: ${error.message}`, error.code);
  return body as T;
}

export function isDeezerId(id: unknown): id is string {
  return typeof id === 'string' && /^\d{1,20}$/.test(id);
}

// --- Queries ------------------------------------------------------------------------------

/** `page` is 1-based. */
export async function fetchChartPlaylists(get: DeezerGet, page: number): Promise<Playlist[]> {
  const res = await get<DeezerList<DeezerPlaylist>>('/chart/0/playlists', {
    index: (page - 1) * CHART_PAGE_SIZE,
    limit: CHART_PAGE_SIZE,
  });
  return res.data.map(toPlaylist);
}

export async function fetchPlaylistSearch(get: DeezerGet, query: string): Promise<Playlist[]> {
  const res = await get<DeezerList<DeezerPlaylist>>('/search/playlist', { q: query, limit: SEARCH_LIMIT });
  return res.data.map(toPlaylist);
}

export async function fetchTrackSearch(get: DeezerGet, query: string): Promise<Track[]> {
  const res = await get<DeezerList<DeezerTrack>>('/search/track', { q: query, limit: SEARCH_LIMIT });
  return res.data.filter(isPlayable).map(toTrack);
}

/** All playable tracks of a playlist, following Deezer's pagination. */
export async function fetchPlaylistTracks(get: DeezerGet, playlistId: string): Promise<Track[]> {
  const tracks: Track[] = [];
  for (let index = 0; index < MAX_PLAYLIST_TRACKS; index += TRACKS_PAGE_SIZE) {
    const res = await get<DeezerList<DeezerTrack>>(`/playlist/${playlistId}/tracks`, {
      index,
      limit: TRACKS_PAGE_SIZE,
    });
    tracks.push(...res.data.filter(isPlayable).map(toTrack));
    if (!res.next || res.data.length < TRACKS_PAGE_SIZE) break;
  }
  return tracks;
}

/** A track plus its signed preview URL (valid ~15 minutes). `null` if it can't be played. */
export async function fetchPlayableTrack(
  get: DeezerGet,
  trackId: string,
): Promise<{ track: Track; preview: string } | null> {
  try {
    const track = await get<DeezerTrack>(`/track/${trackId}`);
    return isPlayable(track) ? { track: toTrack(track), preview: track.preview } : null;
  } catch (e) {
    if (e instanceof DeezerError && e.code === NO_DATA_CODE) return null;
    throw e;
  }
}

// --- Mapping ------------------------------------------------------------------------------

interface DeezerErrorBody {
  error?: { type: string; message: string; code: number };
}

interface DeezerList<T> {
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
