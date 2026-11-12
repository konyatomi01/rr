import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Playlist, Track } from '../../shared/models';
import { SERVER_URL } from '../server-url';

const API_URL = `${SERVER_URL}/api/music`;

/** Browses and searches music through the game server, which proxies (and caches) Deezer. */
@Injectable({ providedIn: 'root' })
export class MusicService {
  private readonly http = inject(HttpClient);

  /** `page` is 1-based. */
  getChartsPlaylists(page: number): Promise<Playlist[]> {
    return this.get('charts', { page });
  }

  getPlaylistBySearch(searchTerm: string): Promise<Playlist[]> {
    return this.get('playlists/search', { q: searchTerm });
  }

  getSongsBySearch(searchTerm: string): Promise<Track[]> {
    return this.get('tracks/search', { q: searchTerm });
  }

  getTracksFromPlaylist(playlistId: string): Promise<Track[]> {
    return this.get(`playlists/${encodeURIComponent(playlistId)}/tracks`);
  }

  /** Resolves to an empty list when the request fails, so callers can treat it as "no results". */
  private async get<T>(path: string, params: Record<string, string | number> = {}): Promise<T[]> {
    try {
      return await firstValueFrom(
        this.http.get<T[]>(`${API_URL}/${path}`, { params: new HttpParams({ fromObject: params }) }),
      );
    } catch (e) {
      console.error(`Music request failed: ${path}`, e);
      return [];
    }
  }
}
