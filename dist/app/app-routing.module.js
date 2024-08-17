import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LaunchComponent } from './launch/launch.component';
import { PlaylistSelectComponent } from './playlist-select/playlist-select.component';
const routes = [
    { path: '', component: LaunchComponent },
    { path: 'select', component: PlaylistSelectComponent }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map