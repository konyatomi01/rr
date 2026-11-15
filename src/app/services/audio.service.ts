import { DOCUMENT, Injectable, inject, signal } from '@angular/core';
import { SnackbarService } from './snackbar.service';

/** 0.1 s of silence, played on the first tap to unlock audio on browsers that require a gesture. */
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

/**
 * Plays the round previews. Two elements: one plays, the other preloads the next round's preview,
 * so a round's music starts the moment the round does.
 */
@Injectable({ providedIn: 'root' })
export class AudioService {
  private readonly document = inject(DOCUMENT);
  private readonly snackbar = inject(SnackbarService);

  private current = new Audio();
  private upcoming = new Audio();
  private playingUrl: string | null = null;

  /** The browser blocked autoplay: the player has to tap to start the music. */
  readonly blocked = signal(false);

  constructor() {
    this.current.preload = this.upcoming.preload = 'auto';
    const unlock = () => [this.current, this.upcoming].forEach(audio => {
      if (audio.src) return;
      audio.src = SILENCE;
      audio.play().then(() => audio.pause()).catch(() => {});
    });
    this.document.addEventListener('pointerdown', unlock, { once: true, capture: true });
    // Browsers may pause media in background tabs; continue where it was when the tab is back.
    this.document.addEventListener('visibilitychange', () => {
      if (this.document.visibilityState === 'visible' && this.playingUrl && this.current.paused && !this.current.ended) {
        this.start();
      }
    });
  }

  preload(url: string): void {
    if (this.upcoming.src === url || this.current.src === url) return;
    this.upcoming.src = url;
    this.upcoming.load();
  }

  /** Starts `url` from the beginning, unless it is already the one playing. */
  play(url: string): void {
    if (this.playingUrl === url) return;
    this.playingUrl = url;
    this.current.pause();
    if (this.upcoming.src === url) {
      [this.current, this.upcoming] = [this.upcoming, this.current];
    } else {
      this.current.src = url;
    }
    this.current.currentTime = 0;
    this.start();
  }

  stop(): void {
    this.playingUrl = null;
    this.blocked.set(false);
    this.current.pause();
  }

  /** Call from a click handler after autoplay was blocked. */
  resume(): void {
    this.blocked.set(false);
    if (this.playingUrl) this.start();
  }

  private start(): void {
    const url = this.playingUrl;
    this.current.play().then(
      () => this.blocked.set(false),
      (error: DOMException) => {
        if (this.playingUrl !== url || error.name === 'AbortError') return; // superseded by a newer round
        if (error.name === 'NotAllowedError') this.blocked.set(true);
        else this.snackbar.message('Could not play this song, try to guess without it!');
      },
    );
  }
}
