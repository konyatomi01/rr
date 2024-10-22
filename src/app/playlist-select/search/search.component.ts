import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { SpotifyService } from '../../services/spotify.service';
import { Observable } from 'rxjs';
import { DisplayService } from '../../services/display.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit{

  playlists!: Observable<any[]>;

  constructor(
    private searchService: SearchService,
    private spotify: SpotifyService,
    readonly display: DisplayService,
    readonly dialog: DialogService
  ) {}


  ngOnInit() {
    this.searchService.form.controls['search']?.valueChanges.subscribe(value => {
      if(value) this.playlists = this.spotify.getPlaylistBySearch(value);
    });
  }
}
