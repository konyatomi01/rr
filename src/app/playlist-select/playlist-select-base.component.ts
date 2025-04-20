import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DialogService } from '../services/dialog.service';
import { MusicService, Playlist } from '../services/music.service';

@Component({
  template: '',
})
export abstract class PlaylistSelectComponentBase implements OnDestroy {

  playlists: Playlist[] = [];
  subscription?: Subscription;
  isLoading: boolean = false;

  constructor(
    private dialog: DialogService,
    readonly music: MusicService
  ) {};
  

  async playlistClicked(playlist: Playlist) {
    this.dialog.openSettingsDialog({
      title: playlist.name,
      cover: playlist.image,
      tracks: await this.music.getTracksFromPlaylist(playlist.id)
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
