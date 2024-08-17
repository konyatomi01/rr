import { __decorate } from "tslib";
import { Component } from '@angular/core';
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
SearchComponent = __decorate([
    Component({
        selector: 'app-search',
        templateUrl: './search.component.html',
        styleUrl: './search.component.scss'
    })
], SearchComponent);
export { SearchComponent };
//# sourceMappingURL=search.component.js.map