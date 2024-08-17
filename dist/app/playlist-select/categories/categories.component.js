import { __decorate } from "tslib";
import { Component, ViewChild } from '@angular/core';
let CategoriesComponent = class CategoriesComponent {
    constructor(spotify, server, dialog) {
        this.spotify = spotify;
        this.server = server;
        this.dialog = dialog;
        this.categories = [
            { display_name: "Pop", api_name: "pop" },
            { display_name: "Rock", api_name: "rock" },
            { display_name: "HIP-HOP", api_name: "hiphop" },
            { display_name: "Decades", api_name: "decades" },
            { display_name: "Country", api_name: "country" },
            { display_name: "R&B", api_name: "rnb" },
            { display_name: "Alternative", api_name: "alternative" },
            { display_name: "Latin", api_name: "latin" }
        ];
        this.selectedCategory = this.categories[0];
    }
    ngOnInit() {
        this.categoryChanged();
    }
    categoryChanged() {
        this.playlists = this.spotify.getPlaylistByCategory(this.selectedCategory.api_name);
        this.playlists.subscribe({
            next(value) {
                console.log('Emitted array of objects:', value);
                value.forEach(obj => console.log('Object:', obj));
            }
        });
    }
    selectCategory(category) {
        this.selectedCategory = category;
        this.categoryChanged();
    }
    scroll(x) {
        this.categoryBar.nativeElement.scrollLeft += x;
    }
};
__decorate([
    ViewChild('category_bar')
], CategoriesComponent.prototype, "categoryBar", void 0);
CategoriesComponent = __decorate([
    Component({
        selector: 'app-categories',
        templateUrl: './categories.component.html',
        styleUrl: './categories.component.scss'
    })
], CategoriesComponent);
export { CategoriesComponent };
//# sourceMappingURL=categories.component.js.map