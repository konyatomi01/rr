import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Page, PlaylistedTrack, SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import { Observable, catchError, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService implements OnInit {
  spotifyApi: SpotifyApi;
  accessToken: string = '';

  constructor(private http: HttpClient) {
    const clientId = "8c97d7c973eb4679b84a4fbf8c16b75d"
    const clientSecret = "bf6d83b77d104c9fa89a6a1273e5593d";

    this.spotifyApi = SpotifyApi.withClientCredentials(clientId, clientSecret);
    }
    
  

  ngOnInit(): void {
    this.authenticate();
  }

  public async authenticate(): Promise<void> {
    try {
      await this.spotifyApi.authenticate();
      console.log('Successfully authenticated with Spotify API');
    } catch (error) {
      console.error('Error authenticating with Spotify API', error);
    }
  }
  
  public getPlaylistByCategory(categoryId: string): Observable<any[]> {
    return from(this.spotifyApi.browse.getPlaylistsForCategory(categoryId, undefined, 25)).pipe(
      map(response => response.playlists.items),
      catchError(error => {
        console.error('Error fetching playlists', error);
        return [];
      })
    );
  }
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
  }
}