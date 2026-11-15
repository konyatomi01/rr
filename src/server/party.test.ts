import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GameModes, GameSpeeds, PartyState, PROPOSAL_TIMEOUT_MS, Settings, Track } from '../shared/models';
import { COUNTDOWN_MS, Party, REVEAL_MS, ROUND_OVER_MS, TrackSource } from './party';
import { GameSocket, Player } from './player';

const tracks: Track[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  title: `Title ${i + 1}`,
  artist: `Artist ${i + 1}`,
  cover: '',
}));

const source: TrackSource = {
  getPlaylistTracks: async () => tracks,
  getTrack: async id => ({ track: tracks.find(t => t.id === id)!, preview: `https://cdn.dzcdn.net/${id}.mp3` }),
};

function fakeSocket() {
  const emitted: { event: string; args: unknown[] }[] = [];
  const socket = {
    emit: (event: string, ...args: unknown[]) => emitted.push({ event, args }),
    disconnect: () => {},
  };
  return {
    socket: socket as unknown as GameSocket,
    lastState: () => emitted.filter(e => e.event === 'state').at(-1)?.args[0] as PartyState,
    events: (name: string) => emitted.filter(e => e.event === name).map(e => e.args[0]),
  };
}

let nextId = 0;
function addPlayer(party: Party, name = `P${nextId}`) {
  const io = fakeSocket();
  const player = new Player(`id${nextId++}`, `token${nextId}`, name, 'assets/player-icons/1.png', io.socket);
  party.addPlayer(player);
  return { player, ...io };
}

const settings = (overrides: Partial<Settings> = {}): Settings => ({
  rounds: 3,
  gameMode: GameModes.title,
  speed: GameSpeeds.normal,
  vibeMode: false,
  health: 1,
  playlist: { source: 'deezer', id: '123', title: 'Test', cover: '' },
  ...overrides,
});

/** Lets pending promises (track loading, prefetch) settle. */
const flush = () => vi.advanceTimersByTimeAsync(0);

async function startGame(party: Party, players: ReturnType<typeof addPlayer>[], s = settings()) {
  expect(party.propose(players[0].player, s)).toBeNull();
  players.slice(1).forEach(p => party.respond(p.player, true));
  await flush();
  expect(party.phase).toBe('countdown');
  await vi.advanceTimersByTimeAsync(COUNTDOWN_MS);
  expect(party.phase).toBe('round');
}

/** The test peeks at the server's private round state; clients never see it during a round. */
function correctAnswer(party: Party): string {
  return (party as unknown as { game: { round: { correct: string } } }).game.round.correct;
}

describe('Party', () => {
  let party: Party;
  const onEmpty = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    party = new Party('123456', source, onEmpty);
  });
  afterEach(() => {
    party.dispose();
    vi.useRealTimers();
  });

  it('does not reveal the right answer during the round, and shuffles it among the options', async () => {
    const a = addPlayer(party);
    await startGame(party, [a]);
    const state = a.lastState();
    expect(state.game!.answers).toHaveLength(4);
    expect(state.game!.correctAnswer).toBeNull();
    expect(state.you.correctAnswer).toBeNull();
    expect(state.game!.song).toBeNull();
    expect(state.game!.answers).toContain(correctAnswer(party));
  });

  it('scores answers on the server and ignores client-sent points, repeats and late answers', async () => {
    const a = addPlayer(party);
    const b = addPlayer(party);
    await startGame(party, [a, b], settings({ health: 3 }));
    const round = a.lastState().game!.round;
    const right = correctAnswer(party);

    vi.advanceTimersByTime(2000);
    const result = party.answer(a.player, round, right);
    expect(result).toEqual({ ok: true, data: { correct: true, points: 8000, correctAnswer: right } });
    expect(party.answer(a.player, round, right).ok).toBe(false); // second answer
    expect(party.answer(b.player, round, 'not an option').ok).toBe(false);
    expect(party.answer(b.player, round + 1, right).ok).toBe(false); // wrong round

    // b never answers: the time runs out, b loses exactly one life and can't answer afterwards.
    await vi.advanceTimersByTimeAsync(GameSpeeds.normal * 1000);
    expect(party.phase).toBe('reveal');
    expect(party.answer(b.player, round, right).ok).toBe(false);
    expect(b.player.lives).toBe(2);
    expect(a.player.points).toBe(8000);
    expect(a.player.streak).toBe(1.1);
  });

  it('rejects answers before the first round and after the game', async () => {
    const a = addPlayer(party);
    party.propose(a.player, settings({ rounds: 1 }));
    await flush();
    expect(party.answer(a.player, 0, 'Title 1').ok).toBe(false); // countdown
    await vi.advanceTimersByTimeAsync(COUNTDOWN_MS);
    party.answer(a.player, 1, a.lastState().game!.answers[0]);
    await vi.advanceTimersByTimeAsync(REVEAL_MS + ROUND_OVER_MS);
    expect(party.phase).toBe('gameOver');
    expect(party.answer(a.player, 1, 'Title 1').ok).toBe(false);
  });

  it('ends the game when everyone is eliminated at once', async () => {
    const a = addPlayer(party);
    const b = addPlayer(party);
    await startGame(party, [a, b], settings({ rounds: 5, health: 1 }));
    await vi.advanceTimersByTimeAsync(GameSpeeds.normal * 1000 + REVEAL_MS + ROUND_OVER_MS);
    expect(party.phase).toBe('gameOver');
    expect(a.lastState().game!.endReason).toBe('allEliminated');
  });

  it('ends the round early when the only player still waiting leaves', async () => {
    const a = addPlayer(party);
    const b = addPlayer(party);
    await startGame(party, [a, b], settings({ health: 3 }));
    party.answer(a.player, 1, a.lastState().game!.answers[0]);
    expect(party.phase).toBe('round');
    party.removePlayer(b.player);
    expect(party.phase).toBe('reveal');
  });

  it('does not accept a new proposal or joiners while a game is running', async () => {
    const a = addPlayer(party);
    await startGame(party, [a]);
    expect(party.propose(a.player, settings())).not.toBeNull();
    expect(party.joinError()).toMatch(/in progress/);
  });

  it('starts the game when the last player who has not accepted leaves', async () => {
    const a = addPlayer(party);
    const b = addPlayer(party);
    const c = addPlayer(party);
    party.propose(a.player, settings());
    party.respond(b.player, true);
    party.removePlayer(c.player);
    await flush();
    expect(party.phase).toBe('countdown');
  });

  it('cancels the proposal when the proposer leaves, withdraws, or it times out', async () => {
    const a = addPlayer(party);
    const b = addPlayer(party);
    party.propose(a.player, settings());
    party.withdraw(b.player); // only the proposer can withdraw
    expect(party.phase).toBe('proposal');
    party.withdraw(a.player);
    expect(party.phase).toBe('lobby');

    party.propose(a.player, settings());
    vi.advanceTimersByTime(PROPOSAL_TIMEOUT_MS);
    expect(party.phase).toBe('lobby');
    expect(b.events('notice').at(-1)).toMatch(/in time/);
  });

  it('shows a pending proposal to players who join while it is open', () => {
    const a = addPlayer(party);
    party.propose(addPlayer(party).player, settings());
    const late = addPlayer(party);
    expect(late.lastState().proposal).not.toBeNull();
    expect(late.player.accepted).toBe(false);
    expect(a.player.accepted).toBe(false);
  });

  it('only lets the leader kick, and never themselves', () => {
    const leader = addPlayer(party);
    const other = addPlayer(party);
    expect(party.kick(other.player, leader.player.id)).toBeNull();
    expect(party.kick(leader.player, leader.player.id)).toBeNull();
    expect(party.kick(leader.player, other.player.id)).toBe(other.player);
    expect(other.events('kicked')).toHaveLength(1);
    expect(party.players).toEqual([leader.player]);
  });

  it('keeps the oldest member as leader regardless of points', async () => {
    const a = addPlayer(party);
    const b = addPlayer(party);
    b.player.points = 1000;
    party.broadcast();
    expect(a.lastState().players.find(p => p.isLeader)!.id).toBe(a.player.id);
  });

  it('refuses artist mode when the playlist has fewer than 4 different artists', async () => {
    const sameArtist: TrackSource = {
      ...source,
      getPlaylistTracks: async () => tracks.map(t => ({ ...t, artist: 'Daft Punk' })),
    };
    party = new Party('654321', sameArtist, onEmpty);
    const a = addPlayer(party);
    party.propose(a.player, settings({ gameMode: GameModes.artist }));
    await flush();
    expect(party.phase).toBe('lobby');
    expect(a.events('notice').at(-1)).toMatch(/different artists/);
  });

  it('ends the game with a reason when Deezer fails', async () => {
    const failing: TrackSource = { ...source, getTrack: async () => Promise.reject(new Error('down')) };
    party = new Party('111111', failing, onEmpty);
    const a = addPlayer(party);
    party.propose(a.player, settings());
    await vi.advanceTimersByTimeAsync(COUNTDOWN_MS);
    expect(party.phase).toBe('gameOver');
    expect(a.lastState().game!.endReason).toBe('deezerError');
  });

  it('schedules removal once when empty and cancels it when someone joins', () => {
    const a = addPlayer(party);
    party.removePlayer(a.player);
    party.removePlayer(a.player); // not a member any more: no-op
    vi.advanceTimersByTime(30_000);
    addPlayer(party);
    vi.advanceTimersByTime(60_000);
    expect(onEmpty).not.toHaveBeenCalled();
  });
});
