import { randomInt } from 'node:crypto';
import { AckResult } from '../shared/events';
import {
  ANSWER_COUNT,
  AnswerResult,
  CustomPlaylistTrack,
  GAME_PHASES,
  GameEndReason,
  MAX_CUSTOM_TRACKS,
  MAX_PARTY_SIZE,
  MIN_PLAYLIST_TRACKS,
  PartyPhase,
  PartyState,
  PlaylistRef,
  PREVIEW_LENGTH_MS,
  PROPOSAL_TIMEOUT_MS,
  Settings,
  Track,
} from '../shared/models';
import { Player } from './player';

/** Where the game gets its music from (Deezer in production, a fake in tests). */
export interface TrackSource {
  getPlaylistTracks(playlistId: string): Promise<Track[]>;
  /** The track with a fresh preview URL, or null if it can't be played. */
  getTrack(trackId: string): Promise<{ track: Track; preview: string } | null>;
}

export const COUNTDOWN_MS = 3000;
export const REVEAL_MS = 3000;
export const ROUND_OVER_MS = 3000;
export const EMPTY_PARTY_TTL_MS = 60_000;
/** Consecutive failed preview lookups (Deezer errors) before the game is ended. */
const MAX_LOOKUP_FAILURES = 3;
/** Tracks without a preview skipped in a row before giving up, to spare Deezer's rate limit. */
const MAX_UNPLAYABLE_SKIPS = 10;

interface PlayableTrack {
  track: Track;
  preview: string;
}

interface Round {
  number: number;
  track: Track;
  preview: string;
  answers: string[];
  correct: string;
  startedAt: number;
}

interface Game {
  settings: Settings;
  /** Tracks not played yet. */
  pool: Track[];
  /** Distinct answers of the playlist (titles or artists) to pick the wrong ones from. */
  answerPool: string[];
  multiplayer: boolean;
  round: Round | null;
  /** The next round's track, looked up ahead of time so rounds start without waiting for Deezer. */
  next: Promise<PlayableTrack | null> | null;
  nextResolved: PlayableTrack | null;
  lookupFailed: boolean;
  endReason: GameEndReason | null;
}

interface Proposal {
  by: Player;
  settings: Settings;
}

function fail<T>(error: string): AckResult<T> {
  return { ok: false, error };
}

function shuffle<T>(items: readonly T[]): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * A party and its game, as an explicit state machine (see `PartyPhase`). Every command checks the
 * phase first, and all timed transitions go through a single timer, so stale timers or late
 * messages can never act on a newer round or game.
 */
export class Party {
  phase: PartyPhase = 'lobby';
  /** In join order: the first player is the leader. */
  players: Player[] = [];
  customPlaylist: CustomPlaylistTrack[] = [];

  private proposal: Proposal | null = null;
  private game: Game | null = null;
  private timer: NodeJS.Timeout | null = null;
  private phaseEndsAt: number | null = null;
  private emptyTimer: NodeJS.Timeout | null = null;

  constructor(
    readonly code: string,
    private readonly source: TrackSource,
    private readonly onEmpty: (party: Party) => void,
  ) {}

  get leader(): Player | undefined {
    return this.players[0];
  }

  has(player: Player): boolean {
    return this.players.includes(player);
  }

  // --- Membership ----------------------------------------------------------------------------

  /** Why nobody can join right now, or null if they can. */
  joinError(): string | null {
    if (GAME_PHASES.includes(this.phase)) return 'A game is in progress in this party, try again when it is over!';
    if (this.players.length >= MAX_PARTY_SIZE) return 'This party is full!';
    return null;
  }

  addPlayer(player: Player): void {
    this.players.push(player);
    if (this.emptyTimer) {
      clearTimeout(this.emptyTimer);
      this.emptyTimer = null;
    }
    this.broadcast();
  }

  removePlayer(player: Player): void {
    if (!this.has(player)) return;
    this.players = this.players.filter(p => p !== player);

    if (!this.players.length) {
      this.clearTimer();
      this.proposal = null;
      this.game = null;
      this.phase = 'lobby';
      if (this.emptyTimer) clearTimeout(this.emptyTimer);
      this.emptyTimer = setTimeout(() => {
        if (!this.players.length) this.onEmpty(this);
      }, EMPTY_PARTY_TTL_MS);
      return;
    }

    if (this.phase === 'proposal') {
      if (this.proposal?.by === player) {
        this.cancelProposal(`${player.name} left, the game proposal was cancelled.`);
        return;
      }
      if (this.startIfAllAccepted()) return;
    }
    if (this.phase === 'round' && this.endRoundIfAllAnswered()) return;
    this.broadcast();
  }

  playerDisconnected(): void {
    if (this.phase === 'round' && this.endRoundIfAllAnswered()) return;
    this.broadcast();
  }

  playerReconnected(): void {
    this.broadcast();
  }

  /** Only the leader can kick, and not themselves. Returns the kicked player. */
  kick(by: Player, playerId: string): Player | null {
    if (by !== this.leader) return null;
    const target = this.players.find(p => p.id === playerId);
    if (!target || target === by) return null;
    target.socket?.emit('kicked');
    this.notice(`${target.name} was removed from the party!`, target);
    this.removePlayer(target);
    return target;
  }

  // --- Proposal ------------------------------------------------------------------------------

  /** Returns an error message, or null if the proposal was made. */
  propose(player: Player, settings: Settings): string | null {
    if (this.phase === 'proposal' && this.proposal) return `${this.proposal.by.name} has already selected a playlist!`;
    if (this.phase !== 'lobby' && this.phase !== 'gameOver') return 'A game is already starting!';
    if (settings.playlist.source === 'custom' && this.customPlaylist.length < MIN_PLAYLIST_TRACKS) {
      return `You need at least ${MIN_PLAYLIST_TRACKS} tracks to start a game!`;
    }
    this.proposal = { by: player, settings };
    this.players.forEach(p => (p.accepted = p === player));
    this.phase = 'proposal';
    if (!this.startIfAllAccepted()) {
      this.schedule(PROPOSAL_TIMEOUT_MS, () => this.cancelProposal('Not everyone accepted the game in time!'));
      this.broadcast();
    }
    return null;
  }

  respond(player: Player, accept: boolean): void {
    if (this.phase !== 'proposal' || !this.proposal || player.accepted) return;
    if (!accept) {
      this.cancelProposal(`${player.name} has declined the game! Pick a new playlist to start!`, player);
      return;
    }
    player.accepted = true;
    if (!this.startIfAllAccepted()) this.broadcast();
  }

  /** Lets the proposer take their proposal back. */
  withdraw(player: Player): void {
    if (this.phase === 'proposal' && this.proposal?.by === player) {
      this.cancelProposal(`${player.name} cancelled the game proposal.`, player);
    }
  }

  private startIfAllAccepted(): boolean {
    if (!this.proposal || !this.players.every(p => p.accepted)) return false;
    void this.startGame(this.proposal).catch(e => this.logError('startGame', e));
    return true;
  }

  private cancelProposal(message: string, except?: Player): void {
    this.clearTimer();
    this.proposal = null;
    this.players.forEach(p => (p.accepted = false));
    this.phase = this.game?.endReason ? 'gameOver' : 'lobby';
    this.notice(message, except);
    this.broadcast();
  }

  // --- Game ----------------------------------------------------------------------------------

  private async startGame(proposal: Proposal): Promise<void> {
    this.clearTimer();
    this.phase = 'loading';
    this.broadcast();

    let tracks: Track[];
    try {
      tracks = await this.loadTracks(proposal.settings.playlist);
    } catch (e) {
      this.logError(`could not load playlist ${JSON.stringify(proposal.settings.playlist)}`, e);
      if (this.proposal === proposal) this.cancelProposal('Could not load the playlist. Try again or pick another one!');
      return;
    }
    if (this.proposal !== proposal) return; // cancelled while loading (e.g. everyone left)

    const mode = proposal.settings.gameMode;
    const answerPool = Array.from(new Set(tracks.map(track => track[mode])));
    if (tracks.length < MIN_PLAYLIST_TRACKS || answerPool.length < ANSWER_COUNT) {
      this.cancelProposal(
        mode === 'artist' && tracks.length >= MIN_PLAYLIST_TRACKS
          ? `This playlist needs at least ${ANSWER_COUNT} different artists for artist mode!`
          : 'This playlist does not have enough playable tracks!',
      );
      return;
    }

    const settings = { ...proposal.settings, rounds: Math.min(proposal.settings.rounds, tracks.length) };
    this.proposal = null;
    this.players.forEach(p => p.startGame(settings.health));
    const game: Game = {
      settings,
      pool: [...tracks],
      answerPool,
      multiplayer: this.players.length > 1,
      round: null,
      next: null,
      nextResolved: null,
      lookupFailed: false,
      endReason: null,
    };
    this.game = game;
    this.prefetchNext(game);
    this.phase = 'countdown';
    this.schedule(COUNTDOWN_MS, () => this.run(this.startRound()));
    this.broadcast();
    console.log(this.code, 'game starts:', JSON.stringify({ ...settings, playlist: settings.playlist.title }));
  }

  private async loadTracks(ref: PlaylistRef): Promise<Track[]> {
    if (ref.source === 'custom') {
      return this.customPlaylist.map(({ id, title, artist, cover }) => ({ id, title, artist, cover }));
    }
    // Copy: the cached array is shared, and rounds take played tracks out of the pool.
    return [...(await this.source.getPlaylistTracks(ref.id))];
  }

  private prefetchNext(game: Game): void {
    game.nextResolved = null;
    game.next = this.nextPlayableTrack(game).then(next => {
      if (this.game === game) {
        game.nextResolved = next;
        // Let clients preload the audio while they look at the countdown / round results.
        if (next && (this.phase === 'countdown' || this.phase === 'reveal' || this.phase === 'roundOver')) {
          this.broadcast();
        }
      }
      return next;
    });
  }

  /** Takes random tracks out of the pool until one has a playable preview. Never rejects. */
  private async nextPlayableTrack(game: Game): Promise<PlayableTrack | null> {
    let failures = 0;
    let skips = 0;
    while (game.pool.length && failures < MAX_LOOKUP_FAILURES && skips < MAX_UNPLAYABLE_SKIPS) {
      const [track] = game.pool.splice(randomInt(game.pool.length), 1);
      try {
        const playable = await this.source.getTrack(track.id);
        if (this.game !== game) return null;
        if (playable) return { track, preview: playable.preview };
        skips++;
      } catch (e) {
        failures++;
        game.pool.push(track); // a Deezer hiccup is not the track's fault
        this.logError(`preview lookup failed for ${track.id}`, e);
      }
    }
    if (failures >= MAX_LOOKUP_FAILURES) game.lookupFailed = true;
    return null;
  }

  private async startRound(): Promise<void> {
    const game = this.game;
    if (!game || !game.next) return;
    this.clearTimer();
    if (!game.nextResolved) this.broadcast(); // still waiting for Deezer: clients show a spinner

    const next = await game.next;
    if (this.game !== game || (this.phase !== 'countdown' && this.phase !== 'roundOver')) return;
    if (!next) {
      this.endGame(game.lookupFailed ? 'deezerError' : 'noTracks');
      return;
    }

    const number = (game.round?.number ?? 0) + 1;
    const correct = next.track[game.settings.gameMode];
    const wrong = shuffle(game.answerPool.filter(answer => answer !== correct)).slice(0, ANSWER_COUNT - 1);
    game.round = {
      number,
      track: next.track,
      preview: next.preview,
      correct,
      answers: shuffle([correct, ...wrong]),
      startedAt: Date.now(),
    };
    game.next = null;
    game.nextResolved = null;
    if (number < game.settings.rounds) this.prefetchNext(game);

    this.players.forEach(p => p.clearAnswer());
    this.phase = 'round';
    this.schedule(game.settings.speed * 1000, () => this.endRound());
    this.broadcast();
  }

  answer(player: Player, roundNumber: number, answer: string): AckResult<AnswerResult> {
    const game = this.game;
    const round = game?.round;
    if (this.phase !== 'round' || !game || !round || round.number !== roundNumber) return fail('This round is over!');
    if (!player.isPlaying()) return fail('You are out of this game!');
    if (player.answered) return fail('You have already answered!');
    if (!round.answers.includes(answer)) return fail('Invalid answer!');

    const timeLimit = game.settings.speed * 1000;
    const elapsed = Date.now() - round.startedAt;
    if (elapsed > timeLimit) return fail('Time is up!');

    // Scored on the server's clock: faster answers and longer streaks earn more.
    if (answer === round.correct) {
      player.scoreRight(answer, Math.round((timeLimit - elapsed) * player.streak));
    } else {
      player.scoreWrong(answer);
    }
    const result: AckResult<AnswerResult> = {
      ok: true,
      data: { correct: player.correct === true, points: player.roundPoints, correctAnswer: round.correct },
    };
    if (!this.endRoundIfAllAnswered()) this.broadcast();
    return result;
  }

  /**
   * Ends the round early once every connected player still in the game answered. Disconnected
   * players are not waited for, unless nobody is connected (e.g. a solo player reloading).
   */
  private endRoundIfAllAnswered(): boolean {
    if (this.phase !== 'round') return false;
    const playing = this.players.filter(p => p.isPlaying());
    const connected = playing.filter(p => p.connected);
    const done = playing.length === 0 || (connected.length > 0 && connected.every(p => p.answered));
    if (done) this.endRound();
    return done;
  }

  private endRound(): void {
    const game = this.game;
    const round = game?.round;
    if (this.phase !== 'round' || !game || !round) return;
    this.clearTimer();
    this.players.filter(p => p.isPlaying() && !p.answered).forEach(p => p.scoreWrong(''));

    // In vibe mode the whole 30 s preview plays before moving on.
    const elapsed = Date.now() - round.startedAt;
    const revealMs = game.settings.vibeMode ? Math.max(REVEAL_MS, PREVIEW_LENGTH_MS - elapsed) : REVEAL_MS;
    this.phase = 'reveal';
    this.schedule(revealMs, () => {
      this.phase = 'roundOver';
      this.schedule(ROUND_OVER_MS, () => {
        const reason = this.endReason(game);
        if (reason) this.endGame(reason);
        else this.run(this.startRound());
      });
      this.broadcast();
    });
    this.broadcast();
  }

  private endReason(game: Game): GameEndReason | null {
    const participants = this.players.filter(p => p.participant);
    if (!participants.length) return 'abandoned';
    const alive = participants.filter(p => p.isAlive()).length;
    if (game.multiplayer ? alive <= 1 : alive === 0) return alive === 1 ? 'lastStanding' : 'allEliminated';
    if ((game.round?.number ?? 0) >= game.settings.rounds) return 'rounds';
    return null;
  }

  private endGame(reason: GameEndReason): void {
    const game = this.game;
    if (!game) return;
    this.clearTimer();
    game.endReason = reason;
    game.next = null;
    game.nextResolved = null;
    this.phase = 'gameOver';
    this.players.forEach(p => (p.accepted = false));
    this.broadcast();
    console.log(this.code, 'game over:', reason);
  }

  // --- Custom playlist -----------------------------------------------------------------------

  customTrackError(trackId: string): string | null {
    if (this.customPlaylist.some(t => t.id === trackId)) return 'This song is already in the playlist!';
    if (this.customPlaylist.length >= MAX_CUSTOM_TRACKS) return 'The playlist is full!';
    return null;
  }

  addCustomTrack(track: Track, by: Player): string | null {
    const error = this.customTrackError(track.id);
    if (error) return error;
    this.customPlaylist.push({ ...track, addedBy: { id: by.id, name: by.name, pfp: by.pfp } });
    this.broadcast();
    return null;
  }

  removeCustomTrack(trackId: string): void {
    const before = this.customPlaylist.length;
    this.customPlaylist = this.customPlaylist.filter(t => t.id !== trackId);
    if (this.customPlaylist.length !== before) this.broadcast();
  }

  // --- State ---------------------------------------------------------------------------------

  snapshot(player: Player): PartyState {
    const game = this.game;
    const round = game?.round ?? null;
    const phase = this.phase;
    const inRound = phase === 'round' || phase === 'reveal';
    const revealed = phase === 'reveal' || phase === 'roundOver';
    const showGame = game && phase !== 'lobby' && phase !== 'proposal' && phase !== 'loading';
    const showAnswer = round && (inRound || phase === 'roundOver');
    return {
      code: this.code,
      phase,
      phaseEndsIn: this.phaseEndsAt === null ? null : Math.max(0, this.phaseEndsAt - Date.now()),
      players: this.players.map(p => p.toData(p === this.leader)),
      proposal: this.proposal
        ? { byId: this.proposal.by.id, byName: this.proposal.by.name, settings: this.proposal.settings }
        : null,
      game: showGame
        ? {
            settings: game.settings,
            round: round?.number ?? 0,
            answers: inRound && round ? round.answers : [],
            previewUrl: inRound && round ? round.preview : null,
            nextPreviewUrl: phase === 'round' ? null : (game.nextResolved?.preview ?? null),
            correctAnswer: revealed && round ? round.correct : null,
            song: revealed && round ? round.track : null,
            endReason: game.endReason,
          }
        : null,
      customPlaylist: this.customPlaylist,
      you: {
        id: player.id,
        answer: showAnswer ? player.answer : null,
        correct: showAnswer ? player.correct : null,
        correctAnswer: showAnswer && player.answered ? round.correct : null,
      },
    };
  }

  broadcast(): void {
    this.players.forEach(p => p.socket?.emit('state', this.snapshot(p)));
  }

  private notice(message: string, except?: Player): void {
    this.players.forEach(p => p !== except && p.socket?.emit('notice', message));
  }

  // --- Timers --------------------------------------------------------------------------------

  /** Runs `action` after `ms`, replacing any pending transition. */
  private schedule(ms: number, action: () => void): void {
    this.clearTimer();
    this.phaseEndsAt = Date.now() + ms;
    const timer = setTimeout(() => {
      if (this.timer !== timer) return;
      this.timer = null;
      this.phaseEndsAt = null;
      try {
        action();
      } catch (e) {
        this.logError('timer', e);
      }
    }, ms);
    this.timer = timer;
  }

  private clearTimer(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.phaseEndsAt = null;
  }

  private run(promise: Promise<void>): void {
    promise.catch(e => this.logError('async', e));
  }

  private logError(what: string, e: unknown): void {
    console.error(this.code, what, e);
  }

  dispose(): void {
    this.clearTimer();
    if (this.emptyTimer) clearTimeout(this.emptyTimer);
    this.game = null;
    this.proposal = null;
  }
}
