"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let SearchComponent = class SearchComponent {
    constructor(searchService, spotify, display, dialog) {
        this.searchService = searchService;
        this.spotify = spotify;
        this.display = display;
        this.dialog = dialog;
    }
    ngOnInit() {
        this.searchService.form.get('search')?.valueChanges.subscribe(value => {
            if (value)
                this.playlists = this.spotify.getPlaylistBySearch(value);
        });
    }
};
exports.SearchComponent = SearchComponent;
exports.SearchComponent = SearchComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-search',
        templateUrl: './search.component.html',
        styleUrl: './search.component.scss'
    })
], SearchComponent);
//# sourceMappingURL=search.component.js.map