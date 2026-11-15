/**
 * The Socket.IO contract between the client and the game server. Both sides type their sockets
 * with these interfaces, so event names and payloads are checked end to end.
 *
 * The client authenticates with the secret session token in the handshake (`auth.token`), so the
 * session is restored automatically on every (re)connect.
 */
import { AnswerResult, PartyState, Profile, SessionInfo, Settings, Track } from './models';

export type AckResult<T = void> = { ok: true; data: T } | { ok: false; error: string };
export type Ack<T = void> = (result: AckResult<T>) => void;

export interface ClientToServerEvents {
  hostGame(profile: Profile, ack: Ack<SessionInfo>): void;
  joinGame(request: Profile & { code: string }, ack: Ack<SessionInfo>): void;
  leaveParty(ack: Ack): void;
  propose(settings: Settings, ack: Ack): void;
  cancelProposal(): void;
  respondProposal(accept: boolean): void;
  answer(request: { round: number; answer: string }, ack: Ack<AnswerResult>): void;
  kickPlayer(playerId: string): void;
  addCustomTrack(trackId: string, ack: Ack<Track>): void;
  removeCustomTrack(trackId: string): void;
}

export interface ServerToClientEvents {
  state(state: PartyState): void;
  /** The handshake token is unknown (expired session, restarted server). */
  sessionInvalid(): void;
  /** The same session was opened in another tab; this socket is disconnected. */
  sessionReplaced(): void;
  /** The leader removed this player from the party. */
  kicked(): void;
  /** A message to show to the player (snackbar). */
  notice(message: string): void;
}

export interface HandshakeAuth {
  token?: string;
}
