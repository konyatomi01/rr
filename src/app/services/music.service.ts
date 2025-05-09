import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Track } from '../popups/settings/settings.component';
import { CustomPlaylistTrack } from './party.service';

export interface Playlist {
  name: string;
  id: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(private http: HttpClient) {
    }

  private get token(): string {
    return sessionStorage.getItem('token') || '';
  }

  getArtworkUrl(link: string): string {
		return link.replace('{w}', '300').replace('{h}', '300');
	}

  public async getChartsPlaylists(offset: number): Promise<Playlist[]> {
    if (this.token) {
      const apiUrl = `https://api.music.apple.com/v1/catalog/us/charts?types=playlists&limit=20&offset=${offset-20}`;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const lists: any[] = (await lastValueFrom(this.http.get<any>(apiUrl, { headers }))).results.playlists[0].data;
      return lists.map(item => ({
        name: item.attributes.name,
        id: item.attributes.playParams.id,
        image: this.getArtworkUrl(item.attributes.artwork.url)
      })); 
    }
    return [];
  }
  public async getPlaylistBySearch(searchTerm: string): Promise<Playlist[]> {
    if (this.token) {
      const apiUrl = `https://api.music.apple.com/v1/catalog/us/search?types=playlists&limit=10&term=${searchTerm}`;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const lists: any = await lastValueFrom(this.http.get<any>(apiUrl, { headers }));
      if (lists.results.playlists) {
        const data: any[] = lists.results.playlists.data;
        return data.map(item => ({
          name: item.attributes.name,
          id: item.attributes.playParams.id,
          image: this.getArtworkUrl(item.attributes.artwork.url)
        }));
      }
    }
    return [];
  }

  public async getSongsBySearch(searchTerm: string): Promise<CustomPlaylistTrack[]> {
    if (this.token) {
      const apiUrl = `https://api.music.apple.com/v1/catalog/us/search?types=songs&limit=10&term=${searchTerm}`;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const lists: any = await lastValueFrom(this.http.get<any>(apiUrl, { headers }));
      if (lists.results.songs) {
        const data: any[] = lists.results.songs.data;
        return data.map(item => ({
          url: item.attributes.previews[0].url,
          title: item.attributes.name,
          artist: item.attributes.artistName,
          cover: this.getArtworkUrl(item.attributes.artwork.url),
        }));
      }
    }
    return [];
  }

  public async getTracksFromPlaylist(playlistId: string): Promise<Track[]> {
    if (this.token) {
      const apiUrl = `https://api.music.apple.com/v1/catalog/us/playlists/${playlistId}`;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const data: any[] = (await lastValueFrom(this.http.get<any>(apiUrl, { headers }))).data[0].relationships.tracks.data;
      return data.filter((item: any) => item.attributes.previews.length)
        .map(item => ({
          url: item.attributes.previews[0].url,
          title: item.attributes.name,
          artist: item.attributes.artistName
        }));
    }
    return [];
  }
}