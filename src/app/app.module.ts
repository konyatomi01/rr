import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { GameOverComponent } from './game-over/game-over.component';
import { GamePartyComponent } from './game/game-party/game-party.component';
import { GameComponent } from './game/game.component';
import { PlayerDisplayComponent } from './game/player-display/player-display.component';
import { LaunchComponent } from './launch/launch.component';
import { CategoriesComponent } from './playlist-select/categories/categories.component';
import { PartyComponent } from './playlist-select/party/party.component';
import { PlaylistSelectComponent } from './playlist-select/playlist-select.component';
import { SearchComponent } from './playlist-select/search/search.component';
import { AcceptComponent } from './popups/accept/accept.component';
import { SettingsComponent } from './popups/settings/settings.component';
import { RoundOverComponent } from './round-over/round-over.component';
import { DialogService } from './services/dialog.service';
import { DisplayService } from './services/display.service';
import { GameService } from './services/game.service';
import { MusicService } from './services/music.service';
import { PartyService } from './services/party.service';
import { ServerService } from './services/server.service';
import { SnackbarService } from './services/snackbar.service';
import { ButtonComponent } from './ui/button/button.component';
import { GameButtonComponent } from './ui/game-button/game-button.component';
import { ProgressSpinnerComponent } from './ui/spinner/spinner.component';
import { ToggleButtonComponent, ToggleDirective } from './ui/toggle-button/toggle-button.component';
import { MessageComponent } from './popups/message/message.component';
import { PartyListComponent } from './popups/party-list/party-list.component';


const config: SocketIoConfig = { url: 'https://rhythm-royale.onrender.com', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    LaunchComponent,
    ButtonComponent,
    GameButtonComponent,
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
    ProgressSpinnerComponent,
    ToggleDirective,
    ToggleButtonComponent,
    MessageComponent,
    PartyListComponent

  ],
  imports: [
    FormsModule,
    BrowserModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltip,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    MusicService,
    ServerService,
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
