import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';
import { DialogService } from './dialog.service';
import { RoutingService } from './routing.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly router = inject(RoutingService);
  private readonly dialog = inject(DialogService);
  private readonly document = inject(DOCUMENT);

  private readonly audio = new Audio();
  private url = '';

  readonly maxTime = signal(0);
  readonly currentRound = signal(0);
  readonly maxRounds = signal(0);
  readonly rightAnswer = signal('');
  readonly answers = signal<string[]>([]);
  readonly showCountDown = signal(true);
  readonly vibeMode = signal(false);
  readonly answered = signal(false);
  readonly remainingTime = signal(6);
  /** `performance.now()` timestamp of when the current round's music started. */
  startTime = 0;

  readonly isLowTime = computed(() => this.remainingTime() < 6);
  readonly roundFinished = computed(() => this.answered() || this.remainingTime() === 0);

  constructor() {
    this.document.addEventListener('visibilitychange', () => {
      if (this.document.visibilityState === 'visible' && this.url) {
        this.preloadAudio(this.url);
      }
    });
  }

  preloadAudio(url: string): void {
    this.audio.src = url;
    this.audio.preload = 'auto';
    this.audio.load();
    this.audio.oncanplaythrough = () => console.log('Audio preloaded successfully');
    this.audio.onerror = error => console.error('Error preloading audio:', error);
  }

  gameStarts(speed: number, maxRounds: number, vibeMode: boolean): void {
    this.dialog.closeAllDialogs();
    this.vibeMode.set(vibeMode);
    this.maxTime.set(speed);
    this.currentRound.set(0);
    this.maxRounds.set(maxRounds);
    this.remainingTime.set(speed);
    this.showCountDown.set(true);
    this.router.game();
  }

  nextRound(answers: string[], url: string, currentRound: number): void {
    this.remainingTime.set(this.maxTime());
    this.audio.pause();
    this.showCountDown.set(false);
    this.currentRound.set(currentRound);
    this.rightAnswer.set(answers[0]);
    this.answers.set(shuffle(answers));
    this.answered.set(false);
    this.router.game();

    this.url = url;
    this.audio.src = url;
    this.audio.preload = 'auto';
    this.audio.play().catch(error => console.error('Audio playback failed:', error));

    this.startTime = performance.now();
  }

  roundOver(): void {
    this.router.roundover();
    this.audio.pause();
  }

  gameOver(): void {
    this.audio.pause();
    this.router.gameover();
  }
}

function shuffle<T>(array: readonly T[]): T[] {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
