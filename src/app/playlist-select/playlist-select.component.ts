import { Component } from '@angular/core';
import { MusicService } from '../services/music.service';
import { ServerService } from '../services/server.service';
import { SearchService } from './search/search.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-playlist-select',
  templateUrl: './playlist-select.component.html',
  styleUrl: './playlist-select.component.scss'
})
export class PlaylistSelectComponent {

  constructor(
    
    private music: MusicService,
    readonly server: ServerService,
    readonly search: SearchService,
    private snackBar: SnackbarService
  ) {}

  copyCode(): void {
    navigator.clipboard.writeText(this.server.party_id);
    this.snackBar.copyCode();
}

}
