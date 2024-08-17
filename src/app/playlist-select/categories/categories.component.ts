import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SpotifyService } from '../../services/spotify.service';
import { ServerService } from '../../services/server.sevice';
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
export class CategoriesComponent implements OnInit {
  @ViewChild('category_bar') categoryBar!: ElementRef;

  playlists!: Observable<any[]>;

  categories: Category[] = [
    {display_name: "Pop", api_name: "pop"},
    {display_name: "Rock", api_name: "rock"},
    {display_name: "HIP-HOP", api_name: "hiphop"},
    {display_name: "Decades", api_name: "decades"},
    {display_name: "Country", api_name: "country"},
    {display_name: "R&B", api_name: "rnb"},
    {display_name: "Alternative", api_name: "alternative"},
    {display_name: "Latin", api_name: "latin"}
  ];
  selectedCategory: Category = this.categories[0];

  constructor(
    private spotify: SpotifyService,
    readonly server: ServerService,
    readonly dialog: DialogService
  ) {

  }
  ngOnInit(): void {
    this.categoryChanged();
  }
  
  categoryChanged(): void {
    this.playlists = this.spotify.getPlaylistByCategory(this.selectedCategory.api_name);
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.categoryChanged();

  }

  scroll(x: number): void {
    this.categoryBar.nativeElement.scrollLeft += x;
  }
}
