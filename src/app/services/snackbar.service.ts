import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const DISPLAY_TIME_MS = 3000;

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  message(message: string): void {
    this.snackBar.open(message, undefined, { duration: DISPLAY_TIME_MS });
  }
}
