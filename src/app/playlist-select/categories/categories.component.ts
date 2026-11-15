import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CHART_PAGE_COUNT } from '../../../shared/deezer';
import { Playlist } from '../../../shared/models';
import { ProgressSpinnerComponent } from '../../ui/spinner/spinner.component';
import { PlaylistSelectComponentBase } from '../playlist-select-base.component';

export const PAGE_COUNT = CHART_PAGE_COUNT;

@Component({
  selector: 'rr-categories',
  imports: [MatIcon, ProgressSpinnerComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent extends PlaylistSelectComponentBase {
  protected readonly pageCount = PAGE_COUNT;
  readonly page = signal(1);
  private readonly dataCache = new Map<number, Playlist[]>();

  constructor() {
    super();
    this.fetchPlaylists();
  }

  categoryPlus(): void {
    if (this.page() >= PAGE_COUNT) return;
    this.page.update(page => page + 1);
    this.fetchPlaylists();
  }

  categoryMinus(): void {
    if (this.page() <= 1) return;
    this.page.update(page => page - 1);
    this.fetchPlaylists();
  }

  private async fetchPlaylists(): Promise<void> {
    const page = this.page();
    const cached = this.dataCache.get(page);
    if (cached?.length) {
      this.playlists.set(cached);
      return;
    }
    this.isLoading.set(true);
    try {
      const playlists = await this.music.getChartsPlaylists(page);
      this.dataCache.set(page, playlists);
      // Ignore responses for pages the user has already navigated away from.
      if (this.page() === page) this.playlists.set(playlists);
    } finally {
      if (this.page() === page) this.isLoading.set(false);
    }
  }
}
