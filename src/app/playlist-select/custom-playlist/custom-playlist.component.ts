import { Component } from '@angular/core';
import { PlaylistToPlay } from '../../popups/settings/settings.component';
import { DialogService } from '../../services/dialog.service';
import { CustomPlaylistTrack, PartyService } from '../../services/party.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ServerService } from '../../services/server.service';
import { DisplayService } from '../../services/display.service';

@Component({
  selector: 'rr-custom-playlist',
  templateUrl: './custom-playlist.component.html',
  styleUrl: './custom-playlist.component.scss'
})
export class CustomPlaylistComponent {

  constructor(
    public party: PartyService,
    public dialog: DialogService,
    private snackbar: SnackbarService,
    private server: ServerService,
    readonly display: DisplayService
  ) {}

  start(): void {
    if (this.party.customPlaylist.length < 4) 
      this.snackbar.message("You need at least 4 tracks to start a game");
    else {
      const data: PlaylistToPlay = {
        title: 'Custom Playlist',
        cover: 'assets/custom-playlist.jpg',
        tracks: this.party.customPlaylist
      }
      this.dialog.openSettingsDialog(data);
    }
  }

  removeSong(song: CustomPlaylistTrack): void {
    this.server.removeCustomPlaylistTrack(song);
    this.snackbar.message(`Removed ${song.title} from custom playlist`);
  }

  ownSong(song: CustomPlaylistTrack): boolean {
    return this.party.player?.id === song.player?.id;
  }
}

