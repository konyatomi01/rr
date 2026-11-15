import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Track } from '../../../shared/models';
import { searchState } from '../../search-state';
import { MusicService } from '../../services/music.service';
import { PartyService } from '../../services/party.service';

/** Shown until the player types, so the list isn't empty. */
const DEFAULT_SEARCH = 'abba';

@Component({
  selector: 'rr-add-song',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    MatFormField,
    MatInput,
    MatPrefix,
    MatSuffix,
    MatIconButton,
    MatIcon,
    MatProgressSpinner,
  ],
  templateUrl: './add-song.component.html',
  styleUrl: './add-song.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSongComponent {
  private readonly music = inject(MusicService);
  protected readonly party = inject(PartyService);

  readonly search = new FormControl('', { nonNullable: true });
  readonly state = searchState(this.search, term => this.music.getSongsBySearch(term), DEFAULT_SEARCH);
  readonly songs = computed(() => {
    const state = this.state();
    return state.status === 'done' ? state.items : [];
  });
  private readonly addedIds = computed(() => new Set(this.party.customPlaylist().map(t => t.id)));
  protected readonly adding = signal<string | null>(null);

  static open(dialog: MatDialog): void {
    dialog.open(AddSongComponent, { width: '420px' });
  }

  isAdded(song: Track): boolean {
    return this.addedIds().has(song.id);
  }

  async addSong(song: Track): Promise<void> {
    if (this.adding() || this.isAdded(song)) return;
    this.adding.set(song.id);
    try {
      await this.party.addCustomTrack(song.id);
    } finally {
      this.adding.set(null);
    }
  }
}
