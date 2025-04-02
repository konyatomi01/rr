import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DialogService } from '../services/dialog.service';
import { Playlist } from '../services/music.service';

@Component({
  template: '',
})
export abstract class PlaylistSelectComponentBase implements OnDestroy {

  playlists: Playlist[] = [];
  subscription?: Subscription;
  isLoading: boolean = false;

  constructor(
    private dialog: DialogService
  ) {};
  

  playlistClicked(playlist: Playlist) {
    this.dialog.openSettingsDialog({ ...playlist, image: this.getArtworkUrl(playlist.image) });
  }

  getArtworkUrl(link: string): string {
    return link.replace('{w}', '300').replace('{h}', '300');
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
