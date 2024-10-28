import { Component, ElementRef, ViewChild } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { SpotifyService } from '../../services/spotify.service';
import { ServerService } from '../../services/server.service';
import { DialogService } from '../../services/dialog.service';

interface Category {
  display_name: string,
  api_name: string
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  @ViewChild('category_bar') categoryBar!: ElementRef;

  playlists: any[] = [];
  selectedIndex: number = 0;

  categories: Category[] = [
    {display_name: "Pop", api_name: "pop"},
    {display_name: "Rock", api_name: "rock"},
    {display_name: "HIP-HOP", api_name: "hiphop"},
    {display_name: "Decades", api_name: "decades"},
    {display_name: "Country", api_name: "country"},
    {display_name: "R&B", api_name: "rnb"},
    {display_name: "Alternative", api_name: "alternative"},
    {display_name: "Latin", api_name: "latin"},
    {display_name: "Party", api_name: "party"},
    {display_name: "Toplists", api_name: "toplists"}, 
  ];
  selectedCategory: Category = this.categories[0];

  constructor(
    private spotify: SpotifyService,
    readonly server: ServerService,
    readonly dialog: DialogService
  ) {
    this.getPlaylists();
  }
  async getPlaylists() {
    for(let c of this.categories) {
      const lists = await lastValueFrom(this.spotify.getPlaylistByCategory(c.api_name));
      this.playlists.push(lists);
    }
  }

  categoryPlus() {
    if(this.selectedIndex === this.categories.length -1 ) this.selectedIndex = 0;
    else this.selectedIndex += 1;
  }

  categoryMinus() {
    if(this.selectedIndex ===  0) this.selectedIndex = this.categories.length -1;
    else this.selectedIndex -= 1;
  }
}
