import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServerService } from '../services/server.sevice';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrl: './launch.component.scss'
})
export class LaunchComponent {
  form: FormGroup;
  code: FormGroup;
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

  constructor(
    private fb: FormBuilder,
    private server: ServerService
  ) {
    this.form = this.fb.group({
      icon: ['assets/player-icons/player-icon-1.svg'],
      name: ['', Validators.required]
    });
    this.code = this.fb.group({
      code: ['', Validators.required]
    })
  }

  selectIcon(icon: string): void {
    this.selectedIcon = icon;
    this.form.get('icon')?.setValue(icon);
  }

  next(): void {
    if (this.form.valid) {
      this.accountCreated = true;
    } else {
      this.form.get('name')!.markAsTouched();
    }
  }


  hostGame(): void {
    this.server.hostGame(this.form.get('name')!.value, this.form.get('icon')!.value);
  }
  joinGame(): void {
    if (this.code.valid) this.server.joinGame(this.form.get('name')!.value, this.form.get('icon')!.value, this.code.get('code')!.value);
    else this.code.get('code')!.markAsTouched();
    
  }
}

