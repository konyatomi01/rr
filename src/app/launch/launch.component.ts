import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServerService } from '../services/server.sevice';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrl: './launch.component.scss'
})
export class LaunchComponent {
  icons: string[] = [
    'assets/player-icons/player-icon-1.svg',
    'assets/player-icons/player-icon-2.svg',
    'assets/player-icons/player-icon-3.svg',
    'assets/player-icons/player-icon-4.svg',
    'assets/player-icons/player-icon-5.svg',
    'assets/player-icons/player-icon-6.svg',
    'assets/player-icons/player-icon-7.svg',
  ];
  selectedIcon: string = 'assets/player-icons/player-icon-1.svg';
  accountCreated: boolean = false;

  form = new FormGroup({
    icon: new FormControl('assets/player-icons/player-icon-1.svg'),
    name: new FormControl('', [Validators.required, Validators.maxLength(16)])
  });

  code = new FormGroup({
    code: new FormControl('', [Validators.required])
  });

  constructor(
    private server: ServerService
  ) {}

  selectIcon(icon: string): void {
    this.selectedIcon = icon;
    this.form.get('icon')?.setValue(icon);
  }

  next(): void {
    if (this.form.valid) {
      this.accountCreated = true;
    } else {
      this.form.controls.name.markAsTouched();
    }
  }


  hostGame(): void {
    this.server.hostGame(this.form.controls.name.value!, this.form.controls.icon.value!);
  }
  joinGame(): void {
    if (this.code.valid) this.server.joinGame(this.form.controls.name.value!, this.form.controls.icon.value!, this.code.controls.code.value!);
    else this.code.get('code')!.markAsTouched();
    
  }
}

