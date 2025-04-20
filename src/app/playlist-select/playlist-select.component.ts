import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PartyService } from '../services/party.service';
import { ServerService } from '../services/server.service';
import { SnackbarService } from '../services/snackbar.service';

enum PlaylistSelectTab {
  charts,
  search,
  custom
}

@Component({
  selector: 'rr-playlist-select',
  templateUrl: './playlist-select.component.html',
  styleUrl: './playlist-select.component.scss',
})
export class PlaylistSelectComponent {
  selectedTab = new FormControl<PlaylistSelectTab>(PlaylistSelectTab.charts);
  tabs = PlaylistSelectTab;

  get waitingToAccept(): boolean {
    return this.party.player?.accepted || false;
  }

  constructor(
    
    readonly server: ServerService,
    private snackBar: SnackbarService,
    readonly party: PartyService,
  ) {
    this.party.customPlaylist = JSON.parse(sessionStorage.getItem('customPlaylist') || '[]');
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.server.party_id);
    this.snackBar.message("Code copied!");
}

}
