import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { searchState } from '../../search-state';
import { MusicService } from '../../services/music.service';
import { PlaylistGridComponent } from '../playlist-grid/playlist-grid.component';

@Component({
  selector: 'rr-search',
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatPrefix, MatSuffix, MatIconButton, MatIcon, PlaylistGridComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private readonly music = inject(MusicService);

  readonly search = new FormControl('', { nonNullable: true });
  readonly state = searchState(this.search, term => this.music.getPlaylistBySearch(term));

  readonly playlists = computed(() => {
    const state = this.state();
    return state.status === 'done' ? state.items : [];
  });

  readonly emptyText = computed(() => {
    const state = this.state();
    switch (state.status) {
      case 'done':
        return `No playlists found for "${state.term}".`;
      case 'error':
        return 'Could not reach Deezer, please try again!';
      default:
        return 'Use the searchbar to find any public playlist available on Deezer!';
    }
  });
}
