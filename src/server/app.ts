import express from 'express';
import helmet from 'helmet';
import { createServer, IncomingMessage } from 'node:http';
import path from 'node:path';
import { Server } from 'socket.io';
import { isDeezerId } from '../shared/deezer';
import { Ack, AckResult, ClientToServerEvents, HandshakeAuth, ServerToClientEvents } from '../shared/events';
import { Track } from '../shared/models';
import { TrackSource } from './party';
import { GameSocket, Player } from './player';
import { FailureLimiter, TokenBucket } from './rate-limit';
import { Registry } from './registry';
import { isPartyCode, logSafe, parseProfile, parseSettings } from './validation';

export interface GameServerOptions {
  source: TrackSource;
  /** Directory of the built Angular app; not served when omitted (tests). */
  publicDir?: string;
  reconnectGraceMs?: number;
}

const ok = <T>(data: T): AckResult<T> => ({ ok: true, data });
const fail = <T>(error: string): AckResult<T> => ({ ok: false, error });
const NOT_IN_PARTY = 'You are not in a party any more!';

/** Wrong join codes allowed per IP and minute (codes are only 6 digits). */
const joinFailures = new FailureLimiter(10, 60_000);

export function createGameServer(options: GameServerOptions) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // behind Render's proxy
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          // JSONP: the browser loads Deezer API responses as scripts.
          scriptSrc: ["'self'", 'https://api.deezer.com'],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https://*.dzcdn.net'],
          // data: is the short silence that unlocks audio on the first tap.
          mediaSrc: ["'self'", 'data:', 'https://*.dzcdn.net'],
          connectSrc: ["'self'", (req: IncomingMessage) => `wss://${req.headers.host}`],
        },
      },
    }),
  );
  app.get('/healthz', (_req, res) => {
    res.json({ ok: true, parties: registry.parties.size });
  });
  if (options.publicDir) {
    const publicDir = options.publicDir;
    app.use(express.static(publicDir));
    // Client-side routes (/join/123456, /party/123456/game...) all serve the app; missing files 404.
    app.get('*', (req, res) => {
      if (path.extname(req.path)) res.sendStatus(404);
      else res.sendFile(path.join(publicDir, 'index.html'));
    });
  }

  const httpServer = createServer(app);
  // Same origin only (the server serves the client), so no CORS. Payloads are tiny.
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    maxHttpBufferSize: 10_000,
    serveClient: false,
  });
  const registry = new Registry(options.source, options.reconnectGraceMs);
  io.on('connection', socket => handleConnection(socket, registry, options.source));
  return { app, httpServer, io, registry };
}

function handleConnection(socket: GameSocket, registry: Registry, source: TrackSource): void {
  const ip = socket.handshake.address;
  const events = new TokenBucket(30, 10);
  const deezerLookups = new TokenBucket(5, 0.5);
  let player: Player | null = registry.resume(socket, (socket.handshake.auth as HandshakeAuth | undefined)?.token);

  /** The player and party of this socket, if it is still a member (it may have been kicked). */
  const context = () => {
    const party = registry.partyOf(player);
    return player && party ? { player, party } : null;
  };

  const leaveCurrent = () => {
    if (player && registry.partyOf(player)) {
      console.log(logSafe(player.name), 'left', registry.partyOf(player)?.code);
      registry.leave(player);
    }
    player = null;
  };

  /**
   * Registers a handler that is rate limited and can never crash the server. The ack is always
   * the last argument; a client that sends none gets a no-op, so handlers can call it freely.
   */
  const on = <E extends keyof ClientToServerEvents>(
    event: E,
    handler: (ack: Ack<any>, ...args: unknown[]) => void | Promise<void>,
  ) => {
    socket.on(event, ((...args: unknown[]) => {
      const ack = (typeof args[args.length - 1] === 'function' ? args.pop() : () => {}) as Ack<any>;
      if (!events.take()) {
        ack(fail('Slow down!'));
        return;
      }
      try {
        const result = handler(ack, ...args);
        if (result instanceof Promise) {
          result.catch(e => {
            console.error(`Error in ${event}`, e);
            ack(fail('Something went wrong.'));
          });
        }
      } catch (e) {
        console.error(`Error in ${event}`, e);
        ack(fail('Something went wrong.'));
      }
    }) as never);
  };

  on('hostGame', (ack, profile) => {
    if (registry.isFull) return ack(fail('The server is full, try again later!'));
    leaveCurrent();
    player = registry.host(socket, parseProfile(profile));
    console.log(logSafe(player.name), 'hosts party', registry.partyOf(player)?.code);
    ack(ok(registry.sessionInfo(player)));
  });

  on('joinGame', (ack, request) => {
    if (joinFailures.isBlocked(ip)) return ack(fail('Too many wrong codes, wait a minute!'));
    const code = (request as { code?: unknown } | null)?.code;
    if (!isPartyCode(code)) return ack(fail('The join code has 6 digits!'));
    const party = registry.parties.get(code);
    if (!party) {
      joinFailures.fail(ip);
      return ack(fail('Invalid join code!'));
    }
    const error = party.joinError();
    if (error) return ack(fail(error));
    leaveCurrent();
    player = registry.join(socket, party, parseProfile(request));
    console.log(logSafe(player.name), 'joined party', code);
    ack(ok(registry.sessionInfo(player)));
  });

  on('leaveParty', ack => {
    leaveCurrent();
    ack(ok(undefined));
  });

  on('propose', (ack, raw) => {
    const ctx = context();
    if (!ctx) return ack(fail(NOT_IN_PARTY));
    const settings = parseSettings(raw);
    if (!settings) return ack(fail('Invalid game settings!'));
    const error = ctx.party.propose(ctx.player, settings);
    ack(error ? fail(error) : ok(undefined));
  });

  on('cancelProposal', () => {
    const ctx = context();
    ctx?.party.withdraw(ctx.player);
  });

  on('respondProposal', (_ack, accept) => {
    const ctx = context();
    ctx?.party.respond(ctx.player, accept === true);
  });

  on('answer', (ack, request) => {
    const ctx = context();
    if (!ctx) return ack(fail(NOT_IN_PARTY));
    const { round, answer } = (request ?? {}) as { round?: unknown; answer?: unknown };
    if (!Number.isInteger(round) || typeof answer !== 'string') return ack(fail('Invalid answer!'));
    ack(ctx.party.answer(ctx.player, round as number, answer));
  });

  on('kickPlayer', (_ack, playerId) => {
    const ctx = context();
    if (!ctx || typeof playerId !== 'string') return;
    const kicked = ctx.party.kick(ctx.player, playerId);
    if (kicked) {
      registry.forget(kicked);
      console.log(logSafe(ctx.player.name), 'kicked', logSafe(kicked.name), 'from', ctx.party.code);
    }
  });

  // The client only sends the Deezer id; the track data comes from Deezer, not the client.
  on('addCustomTrack', async (ack, trackId) => {
    const ctx = context();
    if (!ctx) return ack(fail(NOT_IN_PARTY));
    if (!isDeezerId(trackId)) return ack(fail('Invalid song!'));
    const error = ctx.party.customTrackError(trackId);
    if (error) return ack(fail(error));
    if (!deezerLookups.take()) return ack(fail('You are adding songs too fast, wait a moment!'));

    let playable: { track: Track; preview: string } | null;
    try {
      playable = await source.getTrack(trackId);
    } catch (e) {
      console.error('Could not look up track', trackId, e);
      return ack(fail('Could not add the song, please try again!'));
    }
    if (!playable) return ack(fail('This song has no preview available!'));
    if (context()?.party !== ctx.party) return ack(fail(NOT_IN_PARTY));
    const addError = ctx.party.addCustomTrack(playable.track, ctx.player);
    ack(addError ? fail(addError) : ok(playable.track));
  });

  on('removeCustomTrack', (_ack, trackId) => {
    const ctx = context();
    if (ctx && typeof trackId === 'string') ctx.party.removeCustomTrack(trackId);
  });

  socket.on('disconnect', () => {
    if (player) registry.disconnected(player, socket);
  });
}
