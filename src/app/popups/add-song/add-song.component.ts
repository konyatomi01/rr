import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CustomPlaylistTrack } from '../../../shared/models';
import { MusicService } from '../../services/music.service';
import { PartyService } from '../../services/party.service';
import { ServerService } from '../../services/server.service';
import { ProgressSpinnerComponent } from '../../ui/spinner/spinner.component';

const DEFAULT_SEARCH = 'abba';

@Component({
  selector: 'rr-add-song',
  imports: [ReactiveFormsModule, MatIcon, MatDialogClose, ProgressSpinnerComponent],
  templateUrl: './add-song.component.html',
  styleUrl: './add-song.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSongComponent {
  private readonly music = inject(MusicService);
  private readonly server = inject(ServerService);
  private readonly party = inject(PartyService);

  readonly search = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly songs = signal<CustomPlaylistTrack[]>([]);
  readonly isLoading = signal(false);

  constructor() {
    this.search.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      if (value) this.fetchSongs(value);
    });
    this.reset();
  }

  reset(): void {
    this.search.setValue('');
    this.search.markAsPristine();
    this.fetchSongs(DEFAULT_SEARCH);
  }

  addSong(song: CustomPlaylistTrack): void {
    this.server.addCustomPlaylistTrack({ ...song, player: this.party.player() });
  }

  private async fetchSongs(term: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const songs = await this.music.getSongsBySearch(term);
      if (songs.length) this.songs.set(songs);
    } finally {
      this.isLoading.set(false);
    }
  }
}
