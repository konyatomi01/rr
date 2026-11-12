import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { GameModes, GameSpeeds, PlaylistToPlay, Settings } from '../../../shared/models';
import { ServerService } from '../../services/server.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { SlideToggleComponent } from '../../ui/slide-toggle/slide-toggle.component';
import { ToggleButtonComponent, ToggleDirective } from '../../ui/toggle-button/toggle-button.component';

const MIN_ARTISTS_FOR_ARTIST_MODE = 4;
const TOOLTIP_TIME_MS = 3500;

@Component({
  selector: 'rr-settings',
  imports: [
    ReactiveFormsModule,
    MatIcon,
    MatDialogClose,
    ButtonComponent,
    ToggleButtonComponent,
    ToggleDirective,
    SlideToggleComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly server = inject(ServerService);
  private readonly snackBar = inject(SnackbarService);
  protected readonly data = inject<PlaylistToPlay>(MAT_DIALOG_DATA);

  protected readonly gameModes = GameModes;
  protected readonly gameSpeeds = GameSpeeds;
  protected readonly hearts = [1, 2, 3];

  readonly form = new FormGroup({
    rounds: new FormControl(3, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(30)],
    }),
    mode: new FormControl(GameModes.title, { nonNullable: true, validators: Validators.required }),
    speed: new FormControl(GameSpeeds.slow, { nonNullable: true, validators: Validators.required }),
    vibeMode: new FormControl(false, { nonNullable: true }),
    lives: new FormControl(3, { nonNullable: true, validators: Validators.required }),
  });

  /** Artist mode needs enough distinct artists to generate wrong answers. */
  readonly enoughArtists =
    new Set(this.data.tracks.map(track => track.artist)).size >= MIN_ARTISTS_FOR_ARTIST_MODE;

  readonly showVibeModeTooltip = signal(false);
  private tooltipTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.tooltipTimer));
  }

  toggleVibeModeTooltip(): void {
    clearTimeout(this.tooltipTimer);
    if (this.showVibeModeTooltip()) {
      this.showVibeModeTooltip.set(false);
    } else {
      this.showVibeModeTooltip.set(true);
      this.tooltipTimer = setTimeout(() => this.showVibeModeTooltip.set(false), TOOLTIP_TIME_MS);
    }
  }

  setMode(): void {
    if (!this.enoughArtists) {
      this.snackBar.message(
        `Only available when there are at least ${MIN_ARTISTS_FOR_ARTIST_MODE} different artists in the playlist!`,
      );
      this.form.controls.mode.setValue(GameModes.title);
    }
  }

  plusRounds(): void {
    const rounds = this.form.controls.rounds;
    if (rounds.value + 1 <= this.data.tracks.length) {
      rounds.setValue(rounds.value + 1);
    }
  }

  minusRounds(): void {
    const rounds = this.form.controls.rounds;
    if (rounds.value - 1 >= 1) {
      rounds.setValue(rounds.value - 1);
    }
  }

  start(): void {
    const { rounds, mode, speed, vibeMode, lives } = this.form.getRawValue();
    const settings: Settings = {
      rounds,
      gameMode: mode,
      speed,
      vibeMode,
      health: lives,
      playlist: this.data,
    };
    this.server.startGame(settings);
  }
}
