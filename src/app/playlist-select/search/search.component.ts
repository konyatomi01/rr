import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DialogService } from '../../services/dialog.service';
import { DisplayService } from '../../services/display.service';
import { MusicService } from '../../services/music.service';
import { PlaylistSelectComponentBase } from '../playlist-select-base.component';

@Component({
  selector: 'rr-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent extends PlaylistSelectComponentBase {
  search = new FormControl<string>('', { validators: [Validators.required] });

  constructor(
    private music: MusicService,
    readonly display: DisplayService,
    dialog: DialogService
  ) {
    super(dialog);
    this.subscription = this.search.valueChanges.subscribe(async value => {
      if(value) await this.fetchPlaylists(value);
    });
  }
  async fetchPlaylists(term: string) {
    this.isLoading = true;
    const lists = await this.music.getPlaylistBySearch(term);
    if (lists.length) this.playlists = lists;
    this.isLoading = false;
  }

  reset(): void {
    this.search.setValue('');
    this.search.markAsPristine();
    this.playlists = [];
  }
}
