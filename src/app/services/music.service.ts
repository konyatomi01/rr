import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, lastValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(private http: HttpClient) {
    }

  private get token(): string {
    return sessionStorage.getItem('token') || '';
  }

  public getChartsPlaylists(): Observable<any> {
    if (this.token) {
      const apiUrl = `https://api.music.apple.com/v1/catalog/us/charts?types=playlists&limit=80`;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const lists = this.http.get<any>(apiUrl, { headers });
      return(lists); 
    }
    return new Observable();
  }/*
  public getPlaylistBySearch(searchTerm: string): Observable<any[]> {
    return from(this.spotifyApi.search(searchTerm, ['playlist'], undefined, 25)).pipe(
      map(response => response.playlists.items),
      catchError(error => {
        console.error('Error fetching playlists', error);
        return [];
      })
    );
  }

  public getTracksFromPlaylist(playlistId: string): Observable<any[]> {
    return from(this.spotifyApi.playlists.getPlaylistItems(playlistId)).pipe(
      map((page: Page<PlaylistedTrack<Track>>) => {
        return page.items.map(item => item.track);
      }),
      catchError(error => {
        console.error('Error fetching playlist tracks', error);
        return [];
      })
    );
  }*/
}