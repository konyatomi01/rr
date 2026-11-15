import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CUSTOM_PLAYLIST_COVER, CustomPlaylistTrack, MIN_PLAYLIST_TRACKS } from '../../../shared/models';
import { AddSongComponent } from '../../popups/add-song/add-song.component';
import { SettingsComponent } from '../../popups/settings/settings.component';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'rr-custom-playlist',
  imports: [MatButton, MatIconButton, MatIcon],
  templateUrl: './custom-playlist.component.html',
  styleUrl: './custom-playlist.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPlaylistComponent {
  protected readonly party = inject(PartyService);
  private readonly dialog = inject(MatDialog);

  protected readonly minTracks = MIN_PLAYLIST_TRACKS;

  addSong(): void {
    AddSongComponent.open(this.dialog);
  }

  start(): void {
    SettingsComponent.open(this.dialog, {
      ref: { source: 'custom', title: 'Custom Playlist', cover: CUSTOM_PLAYLIST_COVER },
      tracks: this.party.customPlaylist(),
    });
  }

  removeSong(song: CustomPlaylistTrack): void {
    this.party.removeCustomTrack(song.id);
  }

  ownSong(song: CustomPlaylistTrack): boolean {
    return song.addedBy?.id === this.party.self()?.id;
  }
}
