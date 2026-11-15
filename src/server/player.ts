import type { Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '../shared/events';
import { PlayerData } from '../shared/models';

export type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export class Player {
  /** Null while the player is disconnected (they keep their place for a grace period). */
  socket: GameSocket | null;

  lives = 0;
  points = 0;
  streak = 1;
  roundPoints = 0;
  rightRounds = 0;
  /** The answer of the current round; '' if the time ran out, null if not answered yet. */
  answer: string | null = null;
  correct: boolean | null = null;
  accepted = false;
  participant = false;

  constructor(
    /** Public id, visible to everyone in the party. */
    readonly id: string,
    /** Secret session token, only ever sent to this player. */
    readonly token: string,
    public name: string,
    public pfp: string,
    socket: GameSocket,
  ) {
    this.socket = socket;
  }

  get connected(): boolean {
    return this.socket !== null;
  }

  get answered(): boolean {
    return this.answer !== null;
  }

  isAlive(): boolean {
    return this.lives > 0;
  }

  /** Still in the running game: took part from the start and has lives left. */
  isPlaying(): boolean {
    return this.participant && this.isAlive();
  }

  toData(isLeader: boolean): PlayerData {
    return {
      id: this.id,
      name: this.name,
      pfp: this.pfp,
      lives: this.lives,
      points: this.points,
      streak: this.streak,
      roundPoints: this.roundPoints,
      rightRounds: this.rightRounds,
      answered: this.answered,
      accepted: this.accepted,
      isLeader,
      connected: this.connected,
      participant: this.participant,
    };
  }

  startGame(health: number): void {
    this.participant = true;
    this.accepted = false;
    this.lives = health;
    this.points = 0;
    this.streak = 1;
    this.roundPoints = 0;
    this.rightRounds = 0;
    this.clearAnswer();
  }

  clearAnswer(): void {
    this.answer = null;
    this.correct = null;
    this.roundPoints = 0;
  }

  scoreRight(answer: string, points: number): void {
    this.answer = answer;
    this.correct = true;
    this.roundPoints = points;
    this.points += points;
    this.rightRounds++;
    // Rounded to one decimal so repeated additions don't drift (1.2000000000000002).
    this.streak = Math.round((this.streak + 0.1) * 10) / 10;
  }

  /** A wrong answer, or `answer = ''` when the time ran out. */
  scoreWrong(answer: string): void {
    this.answer = answer;
    this.correct = false;
    this.roundPoints = 0;
    this.lives = Math.max(0, this.lives - 1);
    this.streak = 1;
  }
}
