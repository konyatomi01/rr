import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CustomPlaylistTrack, PlaylistToPlay } from '../../../shared/models';
import { DialogService } from '../../services/dialog.service';
import { DisplayService } from '../../services/display.service';
import { PartyService } from '../../services/party.service';
import { ServerService } from '../../services/server.service';
import { SnackbarService } from '../../services/snackbar.service';

const MIN_TRACKS = 4;

@Component({
  selector: 'rr-custom-playlist',
  imports: [MatIcon],
  templateUrl: './custom-playlist.component.html',
  styleUrl: './custom-playlist.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPlaylistComponent {
  protected readonly party = inject(PartyService);
  protected readonly dialog = inject(DialogService);
  protected readonly display = inject(DisplayService);
  private readonly snackbar = inject(SnackbarService);
  private readonly server = inject(ServerService);

  protected readonly minTracks = MIN_TRACKS;

  start(): void {
    const tracks = this.party.customPlaylist();
    if (tracks.length < MIN_TRACKS) {
      this.snackbar.message(`You need at least ${MIN_TRACKS} tracks to start a game`);
      return;
    }
    const data: PlaylistToPlay = {
      title: 'Custom Playlist',
      cover: 'assets/custom-playlist.jpg',
      tracks,
    };
    this.dialog.openSettingsDialog(data);
  }

  removeSong(song: CustomPlaylistTrack): void {
    this.server.removeCustomPlaylistTrack(song);
    this.snackbar.message(`Removed ${song.title} from custom playlist`);
  }

  ownSong(song: CustomPlaylistTrack): boolean {
    return this.party.player()?.id === song.player?.id;
  }
}
