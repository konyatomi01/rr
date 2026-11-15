import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MAX_NAME_LENGTH, PARTY_CODE_LENGTH, PLAYER_ICONS, Profile } from '../../shared/models';
import { PartyService } from '../services/party.service';
import { SocketService } from '../services/socket.service';

const PROFILE_KEY = 'rr-profile';

function storedProfile(): Partial<Profile> {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) ?? '{}') as Partial<Profile>;
  } catch {
    return {};
  }
}

function generatePlayerName(): string {
  return `Player#${Math.floor(Math.random() * 999)}`;
}

@Component({
  selector: 'rr-launch',
  imports: [ReactiveFormsModule, MatCard, MatButton, MatButtonToggleGroup, MatButtonToggle, MatFormField, MatInput, MatError, MatIcon],
  templateUrl: './launch.component.html',
  styleUrl: './launch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchComponent {
  private readonly party = inject(PartyService);
  protected readonly socket = inject(SocketService);

  /** Join code from an invite link (/join/:code). */
  readonly code = input<string>();

  protected readonly icons = PLAYER_ICONS;
  protected readonly maxNameLength = MAX_NAME_LENGTH;
  readonly accountCreated = signal(false);
  readonly busy = signal(false);

  readonly form = new FormGroup({
    icon: new FormControl(PLAYER_ICONS.includes(storedProfile().pfp ?? '') ? storedProfile().pfp! : PLAYER_ICONS[0], {
      nonNullable: true,
    }),
    name: new FormControl(storedProfile().name ?? '', {
      nonNullable: true,
      validators: [Validators.maxLength(MAX_NAME_LENGTH)],
    }),
  });

  readonly joinCode = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(new RegExp(`^\\d{${PARTY_CODE_LENGTH}}$`))],
  });

  readonly joinForm = new FormGroup({ code: this.joinCode });

  constructor() {
    effect(() => {
      const code = this.code();
      if (code) this.joinCode.setValue(code);
    });
  }

  private profile(): Profile {
    const { icon, name } = this.form.getRawValue();
    return { pfp: icon, name: name.trim() || generatePlayerName() };
  }

  next(): void {
    if (this.form.invalid) {
      this.form.controls.name.markAsTouched();
      return;
    }
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: this.form.controls.name.value, pfp: this.form.controls.icon.value }));
    } catch {
      // Storage unavailable (private mode): the profile just isn't remembered.
    }
    this.accountCreated.set(true);
  }

  async hostGame(): Promise<void> {
    await this.run(() => this.party.host(this.profile()));
  }

  async joinGame(): Promise<void> {
    if (this.joinCode.invalid) {
      this.joinCode.markAsTouched();
      return;
    }
    await this.run(() => this.party.join(this.joinCode.value, this.profile()));
  }

  /** One request at a time, so repeated clicks can't create several parties. */
  private async run(request: () => Promise<boolean>): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    try {
      await request();
    } finally {
      this.busy.set(false);
    }
  }
}
