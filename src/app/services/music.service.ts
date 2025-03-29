import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, lastValueFrom, map } from 'rxjs';
import { Track } from '../popups/settings/settings.component';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(private http: HttpClient) {
    }

  private get token(): string {
    return sessionStorage.getItem('token') || '';
  }

  public getChartsPlaylists(offset: number): Observable<any> {
    if (this.token) {
      const apiUrl = `https://api.music.apple.com/v1/catalog/us/charts?types=playlists&limit=20&offset=${offset-20}`;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const lists = this.http.get<any>(apiUrl, { headers });
      return(lists); 
    }
    return new Observable();
  }
  public getPlaylistBySearch(searchTerm: string): Observable<any> {
    if (this.token) {
      const apiUrl = `https://api.music.apple.com/v1/catalog/us/search?types=playlists&limit=10&term=${searchTerm}`;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const lists = this.http.get<any>(apiUrl, { headers });
      return(lists); 
    }
    return new Observable();
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