"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
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
exports.CategoriesComponent = CategoriesComponent;
tslib_1.__decorate([
    (0, core_1.ViewChild)('category_bar')
], CategoriesComponent.prototype, "categoryBar", void 0);
exports.CategoriesComponent = CategoriesComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-categories',
        templateUrl: './categories.component.html',
        styleUrl: './categories.component.scss'
    })
], CategoriesComponent);
//# sourceMappingURL=categories.component.js.map