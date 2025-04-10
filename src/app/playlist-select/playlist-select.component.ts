import { Component } from '@angular/core';
import { ServerService } from '../services/server.service';
import { SnackbarService } from '../services/snackbar.service';
import { SearchService } from './search/search.service';
import { PartyService } from '../services/party.service';

@Component({
  selector: 'app-playlist-select',
  templateUrl: './playlist-select.component.html',
  styleUrl: './playlist-select.component.scss',
  providers: [SearchService]
})
export class PlaylistSelectComponent {

  constructor(
    
    readonly server: ServerService,
    readonly search: SearchService,
    private snackBar: SnackbarService,
    readonly party: PartyService,
  ) {}

  copyCode(): void {
    navigator.clipboard.writeText(this.server.party_id);
    this.snackBar.copyCode();
}

}
