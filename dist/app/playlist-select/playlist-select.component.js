import { __decorate } from "tslib";
import { Component } from '@angular/core';
let PlaylistSelectComponent = class PlaylistSelectComponent {
    constructor(spotify, server, search) {
        this.spotify = spotify;
        this.server = server;
        this.search = search;
    }
    ngOnInit() {
        this.spotify.authenticate();
    }
    copyCode() {
        navigator.clipboard.writeText(this.server.party_id);
    }
};
PlaylistSelectComponent = __decorate([
    Component({
        selector: 'app-playlist-select',
        templateUrl: './playlist-select.component.html',
        styleUrl: './playlist-select.component.scss'
    })
], PlaylistSelectComponent);
export { PlaylistSelectComponent };
//# sourceMappingURL=playlist-select.component.js.map