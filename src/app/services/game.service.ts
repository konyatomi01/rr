import { DestroyRef, Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { AudioService } from './audio.service';
import { PartyService } from './party.service';
import { SnackbarService } from './snackbar.service';

const TICK_MS = 200;

/** Round-level view of the game: the phase timer, the answers and the music. */
@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly party = inject(PartyService);
  private readonly audio = inject(AudioService);
  private readonly snackbar = inject(SnackbarService);

  private readonly now = signal(performance.now());
  /** The answer clicked but not confirmed by the server yet. */
  private readonly pending = signal<{ round: number; answer: string } | null>(null);

  readonly game = this.party.game;
  readonly phase = this.party.phase;
  readonly round = computed(() => this.game()?.round ?? 0);
  readonly maxRounds = computed(() => this.game()?.settings.rounds ?? 0);
  readonly vibeMode = computed(() => this.game()?.settings.vibeMode ?? false);
  readonly answers = computed(() => this.game()?.answers ?? []);

  private readonly deadline = computed(() => {
    const endsIn = this.party.state()?.phaseEndsIn;
    return endsIn == null ? null : this.party.stateReceivedAt() + endsIn;
  });
  /** Whole seconds left in the current timed phase (round, countdown, proposal…), or null. */
  readonly remainingSeconds = computed(() => {
    const deadline = this.deadline();
    return deadline === null ? null : Math.max(0, Math.ceil((deadline - this.now()) / 1000));
  });
  readonly isLowTime = computed(() => (this.remainingSeconds() ?? Infinity) < 6);

  readonly myAnswer = computed(() => {
    const pending = this.pending();
    return this.party.you()?.answer ?? (pending?.round === this.round() ? pending.answer : null);
  });
  readonly correctAnswer = computed(() => this.game()?.correctAnswer ?? this.party.you()?.correctAnswer ?? null);
  readonly isOut = computed(() => (this.party.self()?.lives ?? 0) <= 0);
  /** Show the right answer once it is known: the player answered, or the round is over. */
  readonly roundFinished = computed(
    () => this.correctAnswer() !== null && (this.phase() === 'reveal' || this.myAnswer() !== null),
  );
  readonly canAnswer = computed(
    () => this.phase() === 'round' && this.myAnswer() === null && !this.isOut() && this.remainingSeconds() !== 0,
  );

  readonly feedback = computed(() => {
    const you = this.party.you();
    if (!you || you.correct === null) return null;
    if (you.correct) return { correct: true, text: `Correct! +${this.party.self()?.roundPoints ?? 0} points` };
    return { correct: false, text: you.answer === '' ? 'Time is up! You lost a life.' : 'Wrong answer! You lost a life.' };
  });

  readonly audioBlocked = this.audio.blocked;

  constructor() {
    // Tick while a timed phase is running.
    effect(onCleanup => {
      if (this.deadline() === null) return;
      const interval = setInterval(() => this.now.set(performance.now()), TICK_MS);
      this.now.set(performance.now());
      onCleanup(() => clearInterval(interval));
    });

    // Music: preload the next round early, play during the round (and the reveal, for vibe mode).
    effect(() => {
      const phase = this.phase();
      const game = this.game();
      untracked(() => {
        if (game?.nextPreviewUrl) this.audio.preload(game.nextPreviewUrl);
        if ((phase === 'round' || phase === 'reveal') && game?.previewUrl) this.audio.play(game.previewUrl);
        else this.audio.stop();
      });
    });

    inject(DestroyRef).onDestroy(() => this.audio.stop());
  }

  async answer(answer: string): Promise<void> {
    if (!this.canAnswer()) return;
    const round = this.round();
    this.pending.set({ round, answer });
    const result = await this.party.answer(round, answer);
    if (!result.ok) {
      this.pending.set(null);
      this.snackbar.message(result.error);
    }
  }

  resumeAudio(): void {
    this.audio.resume();
  }
}
