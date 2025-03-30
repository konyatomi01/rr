import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsDialogData } from '../popups/settings/settings.component';
import { DialogService } from '../services/dialog.service';

@Component({
  template: '',
})
export abstract class PlaylistSelectComponentBase implements OnDestroy {

  playlists: any[] = [];
  subscription?: Subscription;
  isLoading: boolean = false;

  constructor(
    private dialog: DialogService
  ) {};
  

  playlistClicked(playlist: any) {
    const data: SettingsDialogData = {
      id: playlist.id,
      name: playlist.attributes.name,
      image: this.getArtworkUrl(playlist.attributes.artwork.url)
    }
    this.dialog.openSettingsDialog(data);
  }

  getArtworkUrl(link: string): string {
    return link.replace('{w}', '300').replace('{h}', '300');
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
