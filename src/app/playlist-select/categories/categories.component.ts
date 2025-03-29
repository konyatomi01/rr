import { Component, ElementRef, ViewChild } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { MusicService } from '../../services/music.service';
import { ServerService } from '../../services/server.service';
import { DialogService } from '../../services/dialog.service';

interface Category {
  display_name: string,
  api_id: string
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

  categories: Category[] = 
  [
      {api_id: "14", display_name: "Pop"},
      {api_id: "18", display_name: "Hip-Hop"},
      {api_id: "21", display_name: "Rock"},
      {api_id: "7", display_name: "Electronic"},
      {api_id: "15", display_name: "R&B"},
      {api_id: "12", display_name: "Latin"},
      {api_id: "20", display_name: "Alternative"},
      {api_id: "6", display_name: "Country"},
      {api_id: "17", display_name: "Dance"},
      {api_id: "8", display_name: "Holiday"},
  ];
  selectedCategory: Category = this.categories[0];

  constructor(
    private music: MusicService,
    readonly server: ServerService,
    readonly dialog: DialogService
  ) {
    this.fetchPlaylists();
  }
  async fetchPlaylists() {
    const lists = await lastValueFrom(this.music.getChartsPlaylists());
    this.playlists = lists.results.playlists[0].data;
    console.log(this.playlists);
  }

  getArtworkUrl(link: string): string {
    return link.replace('{w}', '300').replace('{h}', '300');
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
