import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'rr-launch',
  templateUrl: './launch.component.html',
  styleUrl: './launch.component.scss'
})
export class LaunchComponent {
  icons: string[] = [
    'assets/player-icons/1.png',
    'assets/player-icons/2.png',
    'assets/player-icons/13.png',
    'assets/player-icons/4.png',
    'assets/player-icons/5.png',
    'assets/player-icons/6.png',
    'assets/player-icons/7.png',
    'assets/player-icons/8.png',
    'assets/player-icons/9.png',
    'assets/player-icons/10.png',
    'assets/player-icons/11.png',
    'assets/player-icons/12.png',
  ];
  accountCreated: boolean = false;

  form = new FormGroup({
    icon: new FormControl('assets/player-icons/1.png'),
    name: new FormControl('', [Validators.maxLength(16)])
  });

  code = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]);

  constructor(
    private server: ServerService
  ) {}

  private get name(): string {
    return this.form.controls.name.value || this.generatePlayerName();
  }

  next(): void {
    if (this.form.valid) {
      this.accountCreated = true;
    } else {
      this.form.controls.name.markAsTouched();
    }
  }

  generatePlayerName(): string {
    const number = Math.floor(Math.random() * 999);
    return `Player#${number.toString()}`;
  }

  hostGame(): void {
    this.server.hostGame(this.name, this.form.controls.icon.value!);
  }
  joinGame(): void {
    if (this.code.valid) {
      this.server.joinGame(this.name, this.form.controls.icon.value!, this.code.value!);
    } else {
      this.code.markAsTouched();
    }
  }
}

