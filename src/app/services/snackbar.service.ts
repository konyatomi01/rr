import { Injectable, signal } from '@angular/core';

const DISPLAY_TIME_MS = 3000;

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  readonly show = signal(false);
  readonly text = signal('');
  private hideTimer?: ReturnType<typeof setTimeout>;

  message(message: string): void {
    this.text.set(message);
    this.show.set(true);

    clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => this.show.set(false), DISPLAY_TIME_MS);
  }
}
