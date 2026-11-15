import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom, map, race, timer } from 'rxjs';
import { AckResult } from '../../shared/events';
import { AnswerResult, GAME_PHASES, PartyState, Profile, SessionInfo, Settings, Track } from '../../shared/models';
import { DialogService } from './dialog.service';
import { SnackbarService } from './snackbar.service';
import { SocketService } from './socket.service';

export type { CustomPlaylistTrack, PlayerData } from '../../shared/models';

const SESSION_KEY = 'rr-session';

/** `restoring`: a stored session is waiting for the server to confirm it. */
export type SessionStatus = 'none' | 'restoring' | 'active';
/** The screen a player in a party should see; the router follows it. */
export type Screen = 'lobby' | 'game' | 'results';

function readSession(): SessionInfo | null {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null') as SessionInfo | null;
    return session?.token && session.code ? session : null;
  } catch {
    return null;
  }
}

/**
 * The party as the server last described it, plus the commands a player can send. The server is
 * the only source of truth: every screen is derived from its latest `state` snapshot.
 */
@Injectable({ providedIn: 'root' })
export class PartyService {
  private readonly socket = inject(SocketService);
  private readonly snackbar = inject(SnackbarService);
  private readonly dialog = inject(DialogService);

  readonly session = signal<SessionInfo | null>(readSession());
  readonly state = signal<PartyState | null>(null);
  /** `performance.now()` when the latest state arrived; phase deadlines are relative to it. */
  readonly stateReceivedAt = signal(0);
  /** Set when the player closes the results screen; reset when the next game starts. */
  readonly resultsDismissed = signal(false);
  /** Whether the lobby shows the player list instead of the playlist picker. */
  readonly showPlayerList = signal(false);

  readonly status = computed<SessionStatus>(() => (!this.session() ? 'none' : this.state() ? 'active' : 'restoring'));
  readonly phase = computed(() => this.state()?.phase ?? null);
  readonly players = computed(() => this.state()?.players ?? []);
  readonly self = computed(() => {
    const state = this.state();
    return state?.players.find(p => p.id === state.you.id);
  });
  readonly you = computed(() => this.state()?.you ?? null);
  readonly isLeader = computed(() => this.self()?.isLeader ?? false);
  readonly code = computed(() => this.state()?.code ?? this.session()?.code ?? '');
  readonly game = computed(() => this.state()?.game ?? null);
  readonly proposal = computed(() => this.state()?.proposal ?? null);
  readonly customPlaylist = computed(() => this.state()?.customPlaylist ?? []);

  readonly screen = computed<Screen | null>(() => {
    const phase = this.phase();
    const self = this.self();
    if (!phase || !self) return null;
    if (GAME_PHASES.includes(phase) && phase !== 'loading') return self.participant ? 'game' : 'lobby';
    if (phase === 'gameOver') return self.participant && !this.resultsDismissed() ? 'results' : 'lobby';
    return 'lobby';
  });

  private readonly status$ = toObservable(this.status);

  constructor() {
    this.socket.setTokenProvider(() => this.session()?.token);
    this.socket.on('state', state => {
      this.stateReceivedAt.set(performance.now());
      this.state.set(state);
    });
    this.socket.on('sessionInvalid', () => {
      const hadSession = !!this.session();
      this.clear();
      if (hadSession) this.dialog.message('Your party is not available any more. Create a new one or join another!');
    });
    this.socket.on('sessionReplaced', () => {
      this.clear();
      this.dialog.message('This party was opened in another tab, so it was closed here.');
    });
    this.socket.on('kicked', () => {
      this.clear();
      this.dialog.message('You were removed from the party.');
    });
    this.socket.on('notice', message => this.snackbar.message(message));

    effect(() => {
      if (this.phase() !== 'gameOver') this.resultsDismissed.set(false);
    });
  }

  /** Resolves once a stored session is confirmed or rejected (or after `timeoutMs`). */
  settled(timeoutMs = 5000): Promise<SessionStatus> {
    return firstValueFrom(
      race(
        this.status$.pipe(filter(status => status !== 'restoring')),
        timer(timeoutMs).pipe(map(() => this.status())),
      ),
    );
  }

  async host(profile: Profile): Promise<boolean> {
    return this.startSession(await this.socket.request('hostGame', profile));
  }

  async join(code: string, profile: Profile): Promise<boolean> {
    return this.startSession(await this.socket.request('joinGame', { ...profile, code }));
  }

  async leave(): Promise<void> {
    await this.socket.request('leaveParty');
    this.clear();
  }

  async propose(settings: Settings): Promise<boolean> {
    return this.check(await this.socket.request('propose', settings));
  }

  withdrawProposal(): void {
    this.socket.emit('cancelProposal');
  }

  respondProposal(accept: boolean): void {
    this.socket.emit('respondProposal', accept);
  }

  answer(round: number, answer: string): Promise<AckResult<AnswerResult>> {
    return this.socket.request('answer', { round, answer });
  }

  kick(playerId: string): void {
    this.socket.emit('kickPlayer', playerId);
  }

  async addCustomTrack(trackId: string): Promise<AckResult<Track>> {
    const result = await this.socket.request('addCustomTrack', trackId);
    if (result.ok) this.snackbar.message(`${result.data.title} by ${result.data.artist} was added to the playlist!`);
    else this.snackbar.message(result.error);
    return result;
  }

  removeCustomTrack(trackId: string): void {
    this.socket.emit('removeCustomTrack', trackId);
  }

  private startSession(result: AckResult<SessionInfo>): boolean {
    if (!this.check(result)) return false;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(result.data));
    this.session.set(result.data);
    return true;
  }

  private check<T>(result: AckResult<T>): result is { ok: true; data: T } {
    if (!result.ok) this.snackbar.message(result.error);
    return result.ok;
  }

  private clear(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this.session.set(null);
    this.state.set(null);
    this.showPlayerList.set(false);
  }
}
