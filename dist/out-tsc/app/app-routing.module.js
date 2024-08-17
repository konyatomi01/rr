"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutingModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const launch_component_1 = require("./launch/launch.component");
const playlist_select_component_1 = require("./playlist-select/playlist-select.component");
const routes = [
    { path: '', component: launch_component_1.LaunchComponent },
    { path: 'select', component: playlist_select_component_1.PlaylistSelectComponent }
];
let AppRoutingModule = class AppRoutingModule {
};
exports.AppRoutingModule = AppRoutingModule;
exports.AppRoutingModule = AppRoutingModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule]
    })
], AppRoutingModule);
//# sourceMappingURL=app-routing.module.js.map