"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const web_api_ts_sdk_1 = require("@spotify/web-api-ts-sdk");
const rxjs_1 = require("rxjs");
let SpotifyService = class SpotifyService {
    constructor(http) {
        this.http = http;
        this.accessToken = '';
        const clientId = "8c97d7c973eb4679b84a4fbf8c16b75d";
        const clientSecret = "bf6d83b77d104c9fa89a6a1273e5593d";
        this.spotifyApi = web_api_ts_sdk_1.SpotifyApi.withClientCredentials(clientId, clientSecret);
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
        return (0, rxjs_1.from)(this.spotifyApi.browse.getPlaylistsForCategory(categoryId, undefined, 25)).pipe((0, rxjs_1.map)(response => response.playlists.items), (0, rxjs_1.catchError)(error => {
            console.error('Error fetching playlists', error);
            return [];
        }));
    }
    getPlaylistBySearch(searchTerm) {
        return (0, rxjs_1.from)(this.spotifyApi.search(searchTerm, ['playlist'], undefined, 25)).pipe((0, rxjs_1.map)(response => response.playlists.items), (0, rxjs_1.catchError)(error => {
            console.error('Error fetching playlists', error);
            return [];
        }));
    }
    getTracksFromPlaylist(playlistId) {
        return (0, rxjs_1.from)(this.spotifyApi.playlists.getPlaylistItems(playlistId)).pipe((0, rxjs_1.map)((page) => {
            return page.items.map(item => item.track);
        }), (0, rxjs_1.catchError)(error => {
            console.error('Error fetching playlist tracks', error);
            return [];
        }));
    }
};
exports.SpotifyService = SpotifyService;
exports.SpotifyService = SpotifyService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root'
    })
], SpotifyService);
//# sourceMappingURL=spotify.service.js.map