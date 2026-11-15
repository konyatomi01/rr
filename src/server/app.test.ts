import { AddressInfo } from 'node:net';
import { io as connect, Socket } from 'socket.io-client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AckResult, ClientToServerEvents, ServerToClientEvents } from '../shared/events';
import { GameModes, GameSpeeds, PartyState, SessionInfo, Settings, Track } from '../shared/models';
import { createGameServer } from './app';

type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const tracks: Track[] = Array.from({ length: 6 }, (_, i) => ({ id: `${i}`, title: `T${i}`, artist: `A${i}`, cover: '' }));
const server = createGameServer({
  source: {
    getPlaylistTracks: async () => tracks,
    getTrack: async id => ({ track: tracks[Number(id)] ?? tracks[0], preview: 'https://x.dzcdn.net/p.mp3' }),
  },
  reconnectGraceMs: 500,
});
let url = '';
const SETTINGS: Settings = {
  rounds: 3,
  gameMode: GameModes.title,
  speed: GameSpeeds.normal,
  vibeMode: false,
  health: 3,
  playlist: { source: 'deezer', id: '1', title: 'x', cover: '' },
};
const sockets: ClientSocket[] = [];

beforeAll(async () => {
  await new Promise<void>(resolve => server.httpServer.listen(0, resolve));
  url = `http://localhost:${(server.httpServer.address() as AddressInfo).port}`;
});
afterAll(async () => {
  sockets.forEach(s => s.disconnect());
  server.registry.dispose();
  await server.io.close();
});

function client(token?: string): ClientSocket {
  const socket: ClientSocket = connect(url, { auth: token ? { token } : {}, transports: ['websocket'], forceNew: true });
  sockets.push(socket);
  return socket;
}

const next = <E extends keyof ServerToClientEvents>(socket: ClientSocket, event: E) =>
  new Promise<Parameters<ServerToClientEvents[E]>[0]>(resolve => socket.once(event, ((arg: never) => resolve(arg)) as never));

async function host(socket: ClientSocket, name = 'Host'): Promise<SessionInfo> {
  const result = await socket.emitWithAck('hostGame', { name, pfp: 'assets/player-icons/1.png' });
  if (!result.ok) throw new Error(result.error);
  return result.data;
}

async function join(socket: ClientSocket, code: string, name = 'Guest'): Promise<AckResult<SessionInfo>> {
  return socket.emitWithAck('joinGame', { name, pfp: 'nope', code });
}

describe('game server', () => {
  it('survives malformed and out-of-order messages', async () => {
    const raw = client() as unknown as Socket;
    await new Promise<void>(resolve => raw.on('connect', () => resolve()));
    const garbage = [undefined, null, 42, 'x', { playlist: { source: 'custom' } }, { round: 'a' }, [1, 2]];
    for (const event of ['propose', 'answer', 'respondProposal', 'cancelProposal', 'kickPlayer', 'removeCustomTrack', 'addCustomTrack', 'joinGame', 'hostGame']) {
      for (const payload of garbage) raw.emit(event, payload);
    }
    raw.emit('propose', { rounds: 3 }); // no ack callback
    const res = await fetch(`${url}/healthz`);
    expect((await res.json()).ok).toBe(true);
  });

  it('validates the profile: long names are cut and unknown avatars replaced', async () => {
    const h = client();
    const session = await host(h);
    const g = client();
    const state = next(g, 'state');
    await join(g, session.code, 'x'.repeat(5000) + '\u0000');
    const players = (await state).players;
    expect(players[1].name).toBe('x'.repeat(16));
    expect(players[1].pfp).toBe('assets/player-icons/1.png');
  });

  it('restores the session from the token on reconnect, and rejects unknown tokens', async () => {
    const first = client();
    const session = await host(first);
    first.disconnect();

    const again = client(session.token);
    const state: PartyState = await next(again, 'state');
    expect(state.code).toBe(session.code);
    expect(state.you.id).toBe(session.playerId);

    const stranger = client('made-up-token');
    await next(stranger, 'sessionInvalid');
  });

  it('never exposes session tokens to other players', async () => {
    const h = client();
    const session = await host(h);
    const g = client();
    const state = next(h, 'state');
    await join(g, session.code);
    expect(JSON.stringify(await state)).not.toContain(session.token);
  });

  it('disconnects the older tab when a session is opened twice', async () => {
    const first = client();
    const session = await host(first);
    const replaced = next(first, 'sessionReplaced');
    client(session.token);
    await replaced;
  });

  it('ignores commands from a kicked player', async () => {
    const h = client();
    const session = await host(h);
    const g = client();
    const kicked = next(g, 'kicked');
    const guest = await join(g, session.code);
    if (!guest.ok) throw new Error(guest.error);
    h.emit('kickPlayer', guest.data.playerId);
    await kicked;
    const result = await g.emitWithAck('propose', {
      ...SETTINGS,
    });
    expect(result.ok).toBe(false);
  });

  it('rejects wrong join codes and joining a running game', async () => {
    const g = client();
    expect(await join(g, '12')).toEqual({ ok: false, error: 'The join code has 6 digits!' });

    const h = client();
    const session = await host(h);
    const started = await h.emitWithAck('propose', {
      ...SETTINGS,
    });
    expect(started.ok).toBe(true);
    await new Promise(resolve => setTimeout(resolve, 50));
    const late = await join(client(), session.code);
    expect(late.ok).toBe(false);
  });
});
