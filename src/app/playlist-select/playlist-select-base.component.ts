import { Directive, inject, signal } from '@angular/core';
import { MIN_PLAYLIST_TRACKS, Playlist } from '../../shared/models';
import { DialogService } from '../services/dialog.service';
import { MusicService } from '../services/music.service';
import { SnackbarService } from '../services/snackbar.service';

/** Shared state and behaviour for the playlist pickers (charts / search). */
@Directive()
export abstract class PlaylistSelectComponentBase {
  protected readonly music = inject(MusicService);
  private readonly dialog = inject(DialogService);
  private readonly snackbar = inject(SnackbarService);

  readonly playlists = signal<Playlist[]>([]);
  readonly isLoading = signal(false);

  async playlistClicked(playlist: Playlist): Promise<void> {
    const tracks = await this.music.getTracksFromPlaylist(playlist.id);
    if (tracks.length < MIN_PLAYLIST_TRACKS) {
      this.snackbar.message('Could not load enough playable tracks from this playlist!');
      return;
    }
    this.dialog.openSettingsDialog({
      ref: { source: 'deezer', id: playlist.id, title: playlist.title, cover: playlist.cover },
      tracks,
    });
  }
}
