import { Component } from '@angular/core';
import { SearchService } from './search.service';
import { MusicService } from '../../services/music.service';
import { Observable } from 'rxjs';
import { DisplayService } from '../../services/display.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  playlists!: Observable<any[]>;

  constructor(
    private searchService: SearchService,
    private music: MusicService,
    readonly display: DisplayService,
    readonly dialog: DialogService
  ) {
    this.searchService.form.controls['search']?.valueChanges.subscribe(value => {
      //if(value) this.playlists = this.music.getPlaylistBySearch(value);
    });
  }
}
