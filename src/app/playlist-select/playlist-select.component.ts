import { Component } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { ServerService } from '../services/server.sevice';
import { SearchService } from './search/search.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-playlist-select',
  templateUrl: './playlist-select.component.html',
  styleUrl: './playlist-select.component.scss'
})
export class PlaylistSelectComponent {

  constructor(
    
    private spotify: SpotifyService,
    readonly server: ServerService,
    readonly search: SearchService,
    private snackBar: SnackbarService
  ) {
    this.spotify.authenticate();
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.server.party_id);
    this.snackBar.copyCode();
}

}
