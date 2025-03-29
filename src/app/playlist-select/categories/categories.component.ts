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

  page: BehaviorSubject<number> = new BehaviorSubject(1);

  constructor(
    private music: MusicService,
    readonly server: ServerService,
    dialog: DialogService
  ) {
    super(dialog);
    this.fetchPlaylists();
    this.subscription = this.page.subscribe(page => this.fetchPlaylists(page * 20));
  }
  async fetchPlaylists(offset: number = 20) {
    const lists = await lastValueFrom(this.music.getChartsPlaylists(offset));
    this.playlists = lists.results.playlists[0].data;
  }

  categoryPlus() {
    this.page.next(this.page.value + 1);
  }

  categoryMinus() {
    this.page.next(this.page.value - 1);
  }
}
