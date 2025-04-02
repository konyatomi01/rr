import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { DialogService } from '../../services/dialog.service';
import { DisplayService } from '../../services/display.service';
import { MusicService } from '../../services/music.service';
import { PlaylistSelectComponentBase } from '../playlist-select-base.component';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent extends PlaylistSelectComponentBase {
  constructor(
    private searchService: SearchService,
    private music: MusicService,
    readonly display: DisplayService,
    dialog: DialogService
  ) {
    super(dialog);
    this.subscription = this.searchService.search.valueChanges.subscribe(async value => {
      if(value) await this.fetchPlaylists(value);
    });
  }
  async fetchPlaylists(term: string) {
    this.isLoading = true;
    const lists = await this.music.getPlaylistBySearch(term);
    if (lists.length) this.playlists = lists;
    this.isLoading = false;
  }
}
