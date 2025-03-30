import { Component } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { DialogService } from '../../services/dialog.service';
import { MusicService } from '../../services/music.service';
import { ServerService } from '../../services/server.service';
import { PlaylistSelectComponentBase } from '../playlist-select-base.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent extends PlaylistSelectComponentBase {

  page: number = 1;
  dataCache: any[][] = Array.from({ length: 10 }, () => []);

  constructor(
    private music: MusicService,
    readonly server: ServerService,
    dialog: DialogService
  ) {
    super(dialog);
    this.fetchPlaylists();
  }
  async fetchPlaylists(offset: number = 20) {
    if (this.dataCache[this.page - 1].length) {
      this.playlists = this.dataCache[this.page - 1];
      return;
    }
    else {
      this.isLoading = true;
      const lists = await lastValueFrom(this.music.getChartsPlaylists(offset));
      this.isLoading = false;
      this.playlists = lists.results.playlists[0].data;
      this.dataCache[this.page - 1] = this.playlists;
      return;
    }
  }

  categoryPlus() {
    this.page++;
    this.fetchPlaylists(this.page * 20);
  }

  categoryMinus() {
    this.page--;
    this.fetchPlaylists(this.page * 20);
  }
}
