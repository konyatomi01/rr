import { randomBytes, randomInt } from 'node:crypto';
import { PARTY_CODE_LENGTH, Profile, SessionInfo } from '../shared/models';
import { Party, TrackSource } from './party';
import { GameSocket, Player } from './player';

export const MAX_PARTIES = 2000;
/** How long a disconnected player keeps their place in the party. */
export const RECONNECT_GRACE_MS = 60_000;

/** All parties and player sessions of the server. */
export class Registry {
  readonly parties = new Map<string, Party>();
  private readonly sessions = new Map<string, Player>();
  private readonly memberships = new Map<Player, Party>();
  private readonly graceTimers = new Map<Player, NodeJS.Timeout>();

  constructor(
    private readonly source: TrackSource,
    private readonly graceMs = RECONNECT_GRACE_MS,
  ) {}

  get isFull(): boolean {
    return this.parties.size >= MAX_PARTIES;
  }

  partyOf(player: Player | null): Party | undefined {
    return player ? this.memberships.get(player) : undefined;
  }

  host(socket: GameSocket, profile: Profile): Player {
    const party = new Party(this.newPartyCode(), this.source, p => this.removeParty(p));
    this.parties.set(party.code, party);
    return this.join(socket, party, profile);
  }

  join(socket: GameSocket, party: Party, profile: Profile): Player {
    const token = randomBytes(24).toString('base64url');
    const player = new Player(this.newPlayerId(party), token, profile.name, profile.pfp, socket);
    this.sessions.set(token, player);
    this.memberships.set(player, party);
    party.addPlayer(player);
    return player;
  }

  sessionInfo(player: Player): SessionInfo {
    return { token: player.token, code: this.partyOf(player)?.code ?? '', playerId: player.id };
  }

  /**
   * Binds a (re)connecting socket to the session of `token`. If the session is open in another
   * tab, that tab is disconnected: the newest one wins.
   */
  resume(socket: GameSocket, token: unknown): Player | null {
    if (typeof token !== 'string' || !token) return null;
    const player = this.sessions.get(token);
    const party = this.partyOf(player ?? null);
    if (!player || !party) {
      socket.emit('sessionInvalid');
      return null;
    }
    const previous = player.socket;
    player.socket = socket;
    if (previous && previous !== socket) {
      previous.emit('sessionReplaced');
      previous.disconnect(true);
    }
    this.clearGrace(player);
    party.playerReconnected();
    return player;
  }

  disconnected(player: Player, socket: GameSocket): void {
    if (player.socket !== socket) return; // replaced by a newer tab
    player.socket = null;
    const party = this.partyOf(player);
    if (!party) return;
    party.playerDisconnected();
    this.clearGrace(player);
    this.graceTimers.set(
      player,
      setTimeout(() => this.leave(player), this.graceMs),
    );
  }

  leave(player: Player): void {
    const party = this.partyOf(player);
    this.forget(player);
    party?.removePlayer(player);
  }

  /** Ends a session without touching the party (it already removed the player). */
  forget(player: Player): void {
    this.sessions.delete(player.token);
    this.memberships.delete(player);
    this.clearGrace(player);
  }

  dispose(): void {
    this.parties.forEach(party => party.dispose());
    this.graceTimers.forEach(timer => clearTimeout(timer));
    this.parties.clear();
    this.sessions.clear();
    this.memberships.clear();
    this.graceTimers.clear();
  }

  private removeParty(party: Party): void {
    party.dispose();
    this.parties.delete(party.code);
    for (const [player, p] of this.memberships) {
      if (p === party) this.forget(player);
    }
    console.log(`Party ${party.code} removed: no players left`);
  }

  private clearGrace(player: Player): void {
    const timer = this.graceTimers.get(player);
    if (timer) clearTimeout(timer);
    this.graceTimers.delete(player);
  }

  private newPartyCode(): string {
    for (let attempt = 0; attempt < 100; attempt++) {
      const code = randomInt(10 ** PARTY_CODE_LENGTH).toString().padStart(PARTY_CODE_LENGTH, '0');
      if (!this.parties.has(code)) return code;
    }
    throw new Error('Could not find a free party code');
  }

  private newPlayerId(party: Party): string {
    let id: string;
    do id = randomBytes(4).toString('hex');
    while (party.players.some(p => p.id === id));
    return id;
  }
}
