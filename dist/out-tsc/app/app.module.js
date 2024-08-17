"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const icon_1 = require("@angular/material/icon");
const form_field_1 = require("@angular/material/form-field");
const dialog_1 = require("@angular/material/dialog");
const tooltip_1 = require("@angular/material/tooltip");
const app_routing_module_1 = require("./app-routing.module");
const app_component_1 = require("./app.component");
const launch_component_1 = require("./launch/launch.component");
const async_1 = require("@angular/platform-browser/animations/async");
const forms_1 = require("@angular/forms");
const common_1 = require("@angular/common");
const button_component_1 = require("./ui/button.component");
const playlist_select_component_1 = require("./playlist-select/playlist-select.component");
const http_1 = require("@angular/common/http");
const spotify_service_1 = require("./services/spotify.service");
const server_sevice_1 = require("./services/server.sevice");
const categories_component_1 = require("./playlist-select/categories/categories.component");
const search_component_1 = require("./playlist-select/search/search.component");
const search_service_1 = require("./playlist-select/search/search.service");
const display_service_1 = require("./services/display.service");
const party_component_1 = require("./playlist-select/party/party.component");
const settings_component_1 = require("./popups/settings/settings.component");
const dialog_service_1 = require("./services/dialog.service");
const accept_component_1 = require("./popups/accept/accept.component");
const ngx_socket_io_1 = require("ngx-socket-io");
const config = { url: 'http://localhost:3000', options: {} };
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [
            app_component_1.AppComponent,
            launch_component_1.LaunchComponent,
            button_component_1.ButtonComponent,
            playlist_select_component_1.PlaylistSelectComponent,
            categories_component_1.CategoriesComponent,
            search_component_1.SearchComponent,
            party_component_1.PartyComponent,
            settings_component_1.SettingsComponent,
            accept_component_1.AcceptComponent
        ],
        imports: [
            platform_browser_1.BrowserModule,
            app_routing_module_1.AppRoutingModule,
            icon_1.MatIconModule,
            form_field_1.MatFormFieldModule,
            tooltip_1.MatTooltip,
            dialog_1.MatDialogModule,
            forms_1.ReactiveFormsModule,
            common_1.CommonModule,
            http_1.HttpClientModule,
            ngx_socket_io_1.SocketIoModule.forRoot(config)
        ],
        providers: [
            spotify_service_1.SpotifyService,
            server_sevice_1.ServerService,
            search_service_1.SearchService,
            display_service_1.DisplayService,
            dialog_service_1.DialogService,
            (0, platform_browser_1.provideClientHydration)(),
            (0, async_1.provideAnimationsAsync)()
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map