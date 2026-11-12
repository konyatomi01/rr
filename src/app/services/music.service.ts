import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CustomPlaylistTrack, Track } from '../../shared/models';

export interface Playlist {
  name: string;
  id: string;
  image: string;
}

const API_URL = 'https://api.music.apple.com/v1/catalog/us';

@Injectable({ providedIn: 'root' })
export class MusicService {
  private readonly http = inject(HttpClient);

  private get token(): string {
    return sessionStorage.getItem('token') || '';
  }

  async getChartsPlaylists(offset: number): Promise<Playlist[]> {
    const res = await this.get('charts', { types: 'playlists', limit: 20, offset: offset - 20 });
    if (!res) return [];
    return toPlaylists(res.results.playlists[0].data);
  }

  async getPlaylistBySearch(searchTerm: string): Promise<Playlist[]> {
    const res = await this.get('search', { types: 'playlists', limit: 10, term: searchTerm });
    return res?.results.playlists ? toPlaylists(res.results.playlists.data) : [];
  }

  async getSongsBySearch(searchTerm: string): Promise<CustomPlaylistTrack[]> {
    const res = await this.get('search', { types: 'songs', limit: 10, term: searchTerm });
    if (!res?.results.songs) return [];
    return (res.results.songs.data as any[]).map(item => ({
      url: item.attributes.previews[0].url,
      title: item.attributes.name,
      artist: item.attributes.artistName,
      cover: artworkUrl(item.attributes.artwork.url),
    }));
  }

  async getTracksFromPlaylist(playlistId: string): Promise<Track[]> {
    const res = await this.get(`playlists/${playlistId}`);
    if (!res) return [];
    return (res.data[0].relationships.tracks.data as any[])
      .filter(item => item.attributes.previews.length)
      .map(item => ({
        url: item.attributes.previews[0].url,
        title: item.attributes.name,
        artist: item.attributes.artistName,
      }));
  }

  /** Calls the Apple Music catalog API. Resolves to `null` when no developer token is available yet. */
  private async get(path: string, params: Record<string, string | number> = {}): Promise<any | null> {
    const token = this.token;
    if (!token) return null;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return firstValueFrom(
      this.http.get<any>(`${API_URL}/${path}`, { headers, params: new HttpParams({ fromObject: params }) }),
    );
  }
}

function artworkUrl(link: string): string {
  return link.replace('{w}', '300').replace('{h}', '300');
}

function toPlaylists(items: any[]): Playlist[] {
  return items.map(item => ({
    name: item.attributes.name,
    id: item.attributes.playParams.id,
    image: artworkUrl(item.attributes.artwork.url),
  }));
}
