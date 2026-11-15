import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MIN_PLAYLIST_TRACKS, Playlist } from '../../../shared/models';
import { SettingsComponent } from '../../popups/settings/settings.component';
import { MusicService } from '../../services/music.service';
import { SnackbarService } from '../../services/snackbar.service';

/** Grid of playlist covers (charts and search). Clicking one loads it and opens the game settings. */
@Component({
  selector: 'rr-playlist-grid',
  imports: [MatRipple, MatProgressSpinner],
  templateUrl: './playlist-grid.component.html',
  styleUrl: './playlist-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistGridComponent {
  private readonly music = inject(MusicService);
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(SnackbarService);

  readonly playlists = input.required<Playlist[]>();
  readonly loading = input(false);
  readonly emptyText = input('');

  /** The playlist being loaded; other clicks are ignored meanwhile. */
  protected readonly opening = signal<string | null>(null);

  async open(playlist: Playlist): Promise<void> {
    if (this.opening()) return;
    this.opening.set(playlist.id);
    try {
      const tracks = await this.music.getTracksFromPlaylist(playlist.id);
      if (tracks.length < MIN_PLAYLIST_TRACKS) {
        this.snackbar.message('Could not load enough playable tracks from this playlist!');
        return;
      }
      SettingsComponent.open(this.dialog, {
        ref: { source: 'deezer', id: playlist.id, title: playlist.title, cover: playlist.cover },
        tracks,
      });
    } catch {
      this.snackbar.message('Could not load this playlist, please try again!');
    } finally {
      this.opening.set(null);
    }
  }
}
