"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistSelectComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
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
exports.PlaylistSelectComponent = PlaylistSelectComponent;
exports.PlaylistSelectComponent = PlaylistSelectComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-playlist-select',
        templateUrl: './playlist-select.component.html',
        styleUrl: './playlist-select.component.scss'
    })
], PlaylistSelectComponent);
//# sourceMappingURL=playlist-select.component.js.map