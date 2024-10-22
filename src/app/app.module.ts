import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { PartyService } from './services/party.service';
import { GameComponent } from './game/game.component';
import { PlayerDisplayComponent } from './game/player-display/player-display.component';
import { GamePartyComponent } from './game/game-party/game-party.component';
import { SnackbarService } from './services/snackbar.service';
import { GameService } from './services/game.service';
import { GameOverComponent } from './game-over/game-over.component';
import { RoundOverComponent } from './round-over/round-over.component';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const config: SocketIoConfig = { url: 'https://rhythm-royale.onrender.com', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    LaunchComponent,
    ButtonComponent,
    PlaylistSelectComponent,
    CategoriesComponent,
    SearchComponent,
    PartyComponent,
    SettingsComponent,
    AcceptComponent,
    GameComponent,
    PlayerDisplayComponent,
    GamePartyComponent,
    GameOverComponent,
    RoundOverComponent,

  ],
  imports: [
    BrowserModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltip,
    MatSnackBarModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DialogModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    SpotifyService,
    ServerService,
    SearchService,
    DisplayService,
    DialogService,
    PartyService,
    SnackbarService,
    GameService,
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
