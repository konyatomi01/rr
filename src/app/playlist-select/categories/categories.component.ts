import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CHART_PAGE_COUNT } from '../../../shared/deezer';
import { Playlist } from '../../../shared/models';
import { MusicService } from '../../services/music.service';
import { PlaylistGridComponent } from '../playlist-grid/playlist-grid.component';

@Component({
  selector: 'rr-categories',
  imports: [MatIconButton, MatIcon, PlaylistGridComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
  private readonly music = inject(MusicService);

  protected readonly pageCount = CHART_PAGE_COUNT;
  readonly page = signal(1);
  /** Loaded pages; a page that failed to load is retried when visited again. */
  private readonly pages = signal(new Map<number, Playlist[] | 'error'>());

  readonly current = computed(() => this.pages().get(this.page()));
  readonly playlists = computed(() => (Array.isArray(this.current()) ? (this.current() as Playlist[]) : []));
  readonly isLoading = computed(() => this.current() === undefined);
  readonly emptyText = computed(() => (this.current() === 'error' ? 'Could not load the charts, try again later!' : ''));

  constructor() {
    void this.load(1);
  }

  go(delta: number): void {
    const page = Math.min(this.pageCount, Math.max(1, this.page() + delta));
    this.page.set(page);
    if (this.pages().get(page) === 'error') this.setPage(page, undefined);
    void this.load(page);
  }

  private async load(page: number): Promise<void> {
    if (this.pages().has(page)) return;
    let result: Playlist[] | 'error';
    try {
      result = await this.music.getChartsPlaylists(page);
    } catch {
      result = 'error';
    }
    this.setPage(page, result);
  }

  private setPage(page: number, value: Playlist[] | 'error' | undefined): void {
    this.pages.update(pages => {
      const next = new Map(pages);
      if (value === undefined) next.delete(page);
      else next.set(page, value);
      return next;
    });
  }
}
