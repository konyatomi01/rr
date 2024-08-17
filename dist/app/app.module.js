import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LaunchComponent } from './launch/launch.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './ui/button.component';
import { PlaylistSelectComponent } from './playlist-select/playlist-select.component';
import { HttpClientModule } from '@angular/common/http';
import { SpotifyService } from './services/spotify.service';
import { ServerService } from './services/server.sevice';
import { CategoriesComponent } from './playlist-select/categories/categories.component';
import { SearchComponent } from './playlist-select/search/search.component';
import { SearchService } from './playlist-select/search/search.service';
import { DisplayService } from './services/display.service';
import { PartyComponent } from './playlist-select/party/party.component';
import { SettingsComponent } from './popups/settings/settings.component';
import { DialogService } from './services/dialog.service';
import { AcceptComponent } from './popups/accept/accept.component';
import { SocketIoModule } from 'ngx-socket-io';
const config = { url: 'http://localhost:3000', options: {} };
let AppModule = class AppModule {
};
AppModule = __decorate([
    NgModule({
        declarations: [
            AppComponent,
            LaunchComponent,
            ButtonComponent,
            PlaylistSelectComponent,
            CategoriesComponent,
            SearchComponent,
            PartyComponent,
            SettingsComponent,
            AcceptComponent
        ],
        imports: [
            BrowserModule,
            AppRoutingModule,
            MatIconModule,
            MatFormFieldModule,
            MatTooltip,
            MatDialogModule,
            ReactiveFormsModule,
            CommonModule,
            HttpClientModule,
            SocketIoModule.forRoot(config)
        ],
        providers: [
            SpotifyService,
            ServerService,
            SearchService,
            DisplayService,
            DialogService,
            provideClientHydration(),
            provideAnimationsAsync()
        ],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map