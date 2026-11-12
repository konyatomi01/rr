import { Directive, inject, signal } from '@angular/core';
import { DialogService } from '../services/dialog.service';
import { MusicService, Playlist } from '../services/music.service';

/** Shared state and behaviour for the playlist pickers (charts / search). */
@Directive()
export abstract class PlaylistSelectComponentBase {
  protected readonly music = inject(MusicService);
  private readonly dialog = inject(DialogService);

  readonly playlists = signal<Playlist[]>([]);
  readonly isLoading = signal(false);

  async playlistClicked(playlist: Playlist): Promise<void> {
    this.dialog.openSettingsDialog({
      title: playlist.name,
      cover: playlist.image,
      tracks: await this.music.getTracksFromPlaylist(playlist.id),
    });
  }
}
