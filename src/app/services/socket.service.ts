import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AckResult, ClientToServerEvents, ServerToClientEvents } from '../../shared/events';

const REQUEST_TIMEOUT_MS = 8000;

type Args<E extends keyof ClientToServerEvents> = Parameters<ClientToServerEvents[E]>;
/** The event's arguments without the trailing ack callback. */
type RequestArgs<E extends keyof ClientToServerEvents> = Args<E> extends [...infer A, (result: AckResult<infer _>) => void] ? A : never;
type ResultOf<E extends keyof ClientToServerEvents> = Args<E> extends [...unknown[], (result: infer R) => void] ? R : never;

/**
 * The typed connection to the game server (same origin; `ng serve` proxies it in development).
 * The session token is sent in the handshake, so every reconnect restores the session.
 */
@Injectable({ providedIn: 'root' })
export class SocketService {
  private tokenProvider: () => string | undefined = () => undefined;
  private readonly socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
    autoConnect: false,
    auth: callback => callback({ token: this.tokenProvider() }),
  });

  readonly connected = signal(false);
  /** False until the first successful connection, so the "reconnecting" banner doesn't flash on load. */
  readonly hasConnected = signal(false);

  constructor() {
    this.socket.on('connect', () => {
      this.connected.set(true);
      this.hasConnected.set(true);
    });
    this.socket.on('disconnect', reason => {
      this.connected.set(false);
      // socket.io only reconnects by itself after network problems. When the server closed this
      // connection (session opened in another tab), connect again without the old session.
      if (reason === 'io server disconnect') this.socket.connect();
    });
    this.socket.connect();
  }

  setTokenProvider(provider: () => string | undefined): void {
    this.tokenProvider = provider;
  }

  on<E extends keyof ServerToClientEvents>(event: E, handler: ServerToClientEvents[E]): void {
    this.socket.on(event, handler as never);
  }

  /** Fire-and-forget; dropped while offline instead of being queued and replayed later. */
  emit<E extends keyof ClientToServerEvents>(event: E, ...args: Args<E>): void {
    if (this.socket.connected) this.socket.emit(event, ...args);
  }

  /** Sends a command and waits for the server's answer. Never rejects. */
  async request<E extends keyof ClientToServerEvents>(event: E, ...args: RequestArgs<E>): Promise<ResultOf<E>> {
    if (!this.socket.connected) {
      return { ok: false, error: 'Not connected to the server, reconnecting…' } as ResultOf<E>;
    }
    try {
      // socket.io's typings can't follow the generic event here; the contract is enforced by the signature.
      const timed = this.socket.timeout(REQUEST_TIMEOUT_MS) as unknown as {
        emitWithAck(event: string, ...args: unknown[]): Promise<unknown>;
      };
      return (await timed.emitWithAck(event, ...args)) as ResultOf<E>;
    } catch {
      return { ok: false, error: 'The server did not respond, please try again!' } as ResultOf<E>;
    }
  }
}
