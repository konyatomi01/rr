import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { PartyService } from '../services/party.service';
import { ServerService } from '../services/server.service';
import { ButtonComponent } from '../ui/button/button.component';

const ICONS = [1, 2, 13, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => `assets/player-icons/${n}.png`);

@Component({
  selector: 'rr-launch',
  imports: [ReactiveFormsModule, MatIcon, ButtonComponent],
  templateUrl: './launch.component.html',
  styleUrl: './launch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchComponent {
  private readonly server = inject(ServerService);

  protected readonly icons = ICONS;
  readonly accountCreated = signal(false);

  readonly form = new FormGroup({
    icon: new FormControl(ICONS[0], { nonNullable: true }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(16)] }),
  });

  readonly code = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
  });

  constructor() {
    inject(PartyService).clearStoredCustomPlaylist();
  }

  private get name(): string {
    return this.form.controls.name.value || generatePlayerName();
  }

  next(): void {
    if (this.form.valid) {
      this.accountCreated.set(true);
    } else {
      this.form.controls.name.markAsTouched();
    }
  }

  hostGame(): void {
    this.server.hostGame(this.name, this.form.controls.icon.value);
  }

  joinGame(): void {
    if (this.code.valid) {
      this.server.joinGame(this.name, this.form.controls.icon.value, this.code.value);
    } else {
      this.code.markAsTouched();
    }
  }
}

function generatePlayerName(): string {
  return `Player#${Math.floor(Math.random() * 999)}`;
}
