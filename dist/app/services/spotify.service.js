import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { catchError, from, map } from 'rxjs';
let SpotifyService = class SpotifyService {
    constructor(http) {
        this.http = http;
        this.accessToken = '';
        const clientId = "8c97d7c973eb4679b84a4fbf8c16b75d";
        const clientSecret = "bf6d83b77d104c9fa89a6a1273e5593d";
        this.spotifyApi = SpotifyApi.withClientCredentials(clientId, clientSecret);
        console.log('SpotifyService initialized');
    }
    ngOnInit() {
        this.authenticate();
    }
    async authenticate() {
        try {
            await this.spotifyApi.authenticate();
            console.log('Successfully authenticated with Spotify API');
        }
        catch (error) {
            console.error('Error authenticating with Spotify API', error);
        }
    }
    getPlaylistByCategory(categoryId) {
        return from(this.spotifyApi.browse.getPlaylistsForCategory(categoryId, undefined, 25)).pipe(map(response => response.playlists.items), catchError(error => {
            console.error('Error fetching playlists', error);
            return [];
        }));
    }
    getPlaylistBySearch(searchTerm) {
        return from(this.spotifyApi.search(searchTerm, ['playlist'], undefined, 25)).pipe(map(response => response.playlists.items), catchError(error => {
            console.error('Error fetching playlists', error);
            return [];
        }));
    }
    getTracksFromPlaylist(playlistId) {
        return from(this.spotifyApi.playlists.getPlaylistItems(playlistId)).pipe(map((page) => {
            return page.items.map(item => item.track);
        }), catchError(error => {
            console.error('Error fetching playlist tracks', error);
            return [];
        }));
    }
};
SpotifyService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], SpotifyService);
export { SpotifyService };
//# sourceMappingURL=spotify.service.js.map