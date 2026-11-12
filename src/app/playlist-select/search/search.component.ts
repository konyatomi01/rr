import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ProgressSpinnerComponent } from '../../ui/spinner/spinner.component';
import { PlaylistSelectComponentBase } from '../playlist-select-base.component';

@Component({
  selector: 'rr-search',
  imports: [ReactiveFormsModule, MatIcon, ProgressSpinnerComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent extends PlaylistSelectComponentBase {
  readonly search = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  constructor() {
    super();
    this.search.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      if (value) this.fetchPlaylists(value);
    });
  }

  reset(): void {
    this.search.setValue('');
    this.search.markAsPristine();
    this.playlists.set([]);
  }

  private async fetchPlaylists(term: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const lists = await this.music.getPlaylistBySearch(term);
      if (lists.length) this.playlists.set(lists);
    } finally {
      this.isLoading.set(false);
    }
  }
}
