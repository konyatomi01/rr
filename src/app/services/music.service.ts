import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import {
  checkDeezerBody,
  DEEZER_API_URL,
  DEEZER_TIMEOUT_MS,
  DeezerGet,
  fetchChartPlaylists,
  fetchPlaylistSearch,
  fetchPlaylistTracks,
  fetchTrackSearch,
} from '../../shared/deezer';
import { Playlist, Track } from '../../shared/models';

/**
 * Browses and searches Deezer straight from the browser, so charts, search results and track
 * availability follow the player's region. Deezer sends no CORS headers, hence JSONP.
 * (Running games is the server's job: it loads tracks and resolves previews itself.)
 */
@Injectable({ providedIn: 'root' })
export class MusicService {
  private readonly http = inject(HttpClient);

  private readonly get: DeezerGet = async <T>(path: string, params: Record<string, string | number> = {}) => {
    const query = new HttpParams({ fromObject: { ...params, output: 'jsonp' } });
    const body = await firstValueFrom(
      this.http.jsonp<unknown>(`${DEEZER_API_URL}${path}?${query}`, 'callback').pipe(timeout(DEEZER_TIMEOUT_MS)),
    );
    return checkDeezerBody<T>(path, body);
  };

  /** `page` is 1-based. */
  getChartsPlaylists(page: number): Promise<Playlist[]> {
    return orEmpty('charts', fetchChartPlaylists(this.get, page));
  }

  getPlaylistBySearch(searchTerm: string): Promise<Playlist[]> {
    return orEmpty('playlist search', fetchPlaylistSearch(this.get, searchTerm));
  }

  getSongsBySearch(searchTerm: string): Promise<Track[]> {
    return orEmpty('track search', fetchTrackSearch(this.get, searchTerm));
  }

  getTracksFromPlaylist(playlistId: string): Promise<Track[]> {
    return orEmpty('playlist tracks', fetchPlaylistTracks(this.get, playlistId));
  }
}

/** Failed requests resolve to an empty list, so callers can treat them as "no results". */
async function orEmpty<T>(what: string, request: Promise<T[]>): Promise<T[]> {
  try {
    return await request;
  } catch (e) {
    console.error(`Deezer ${what} request failed`, e);
    return [];
  }
}
