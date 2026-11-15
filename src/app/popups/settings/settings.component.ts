import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ANSWER_COUNT, GameModes, GameSpeeds, MAX_HEALTH, MAX_ROUNDS, PlaylistDetails, Settings } from '../../../shared/models';
import { PartyService } from '../../services/party.service';
import { SnackbarService } from '../../services/snackbar.service';
import { SlidingToggleDirective } from '../../sliding-toggle.directive';

@Component({
  selector: 'rr-settings',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatIconButton,
    MatIcon,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatSlideToggle,
    SlidingToggleDirective,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly party = inject(PartyService);
  private readonly snackBar = inject(SnackbarService);
  private readonly dialogRef = inject<MatDialogRef<SettingsComponent>>(MatDialogRef);
  protected readonly data = inject<PlaylistDetails>(MAT_DIALOG_DATA);

  protected readonly gameModes = GameModes;
  protected readonly gameSpeeds = GameSpeeds;
  protected readonly hearts = Array.from({ length: MAX_HEALTH }, (_, i) => i + 1);
  /** One track per round, so a playlist can't have more rounds than tracks. */
  protected readonly maxRounds = Math.min(MAX_ROUNDS, this.data.tracks.length);

  readonly form = new FormGroup({
    rounds: new FormControl(Math.min(3, this.maxRounds), {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(this.maxRounds)],
    }),
    mode: new FormControl(GameModes.title, { nonNullable: true }),
    speed: new FormControl(GameSpeeds.slow, { nonNullable: true }),
    vibeMode: new FormControl(false, { nonNullable: true }),
    lives: new FormControl(MAX_HEALTH, { nonNullable: true }),
  });
  protected readonly rounds = toSignal(this.form.controls.rounds.valueChanges, { initialValue: this.form.controls.rounds.value });
  protected readonly lives = toSignal(this.form.controls.lives.valueChanges, { initialValue: this.form.controls.lives.value });

  /** Artist mode needs enough distinct artists to generate wrong answers. */
  readonly enoughArtists = new Set(this.data.tracks.map(track => track.artist)).size >= ANSWER_COUNT;

  readonly showVibeInfo = signal(false);
  readonly starting = signal(false);

  static open(dialog: MatDialog, data: PlaylistDetails): void {
    dialog.closeAll();
    dialog.open(SettingsComponent, { data, width: '420px' });
  }

  explainArtistMode(): void {
    if (!this.enoughArtists) {
      this.snackBar.message(`Only available when there are at least ${ANSWER_COUNT} different artists in the playlist!`);
    }
  }

  changeRounds(delta: number): void {
    const rounds = this.form.controls.rounds;
    rounds.setValue(Math.min(this.maxRounds, Math.max(1, rounds.value + delta)));
  }

  async start(): Promise<void> {
    if (this.form.invalid || this.starting()) return;
    const { rounds, mode, speed, vibeMode, lives } = this.form.getRawValue();
    const settings: Settings = { rounds, gameMode: mode, speed, vibeMode, health: lives, playlist: this.data.ref };
    this.starting.set(true);
    const proposed = await this.party.propose(settings);
    this.starting.set(false);
    if (proposed) this.dialogRef.close();
  }
}
