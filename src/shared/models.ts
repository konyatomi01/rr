/**
 * Types and limits shared between the Angular client and the Node game server.
 * Keep this file free of Angular (or any other runtime) imports so the server can compile it.
 */

export enum GameModes {
  title = 'title',
  artist = 'artist',
}

export enum GameSpeeds {
  slow = 30,
  normal = 10,
  fast = 5,
}

/** Fewest playable tracks (and distinct answers) a game needs: one right answer plus three wrong ones. */
export const MIN_PLAYLIST_TRACKS = 4;
export const ANSWER_COUNT = 4;
export const MAX_ROUNDS = 30;
export const MAX_HEALTH = 3;
export const MAX_NAME_LENGTH = 16;
export const MAX_PARTY_SIZE = 12;
export const MAX_CUSTOM_TRACKS = 30;
export const PARTY_CODE_LENGTH = 6;
/** A game proposal expires if not everyone accepted it within this time. */
export const PROPOSAL_TIMEOUT_MS = 30_000;
export const PREVIEW_LENGTH_MS = 30_000;
export const CUSTOM_PLAYLIST_COVER = 'assets/custom-playlist.jpg';
export const PLAYER_ICONS: readonly string[] = [1, 2, 13, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
  n => `assets/player-icons/${n}.png`,
);

/**
 * A Deezer track. Preview URLs are signed and expire after ~15 minutes, so they are never
 * stored here: the server resolves a fresh one by `id` right before each round.
 */
export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
}

export interface Playlist {
  id: string;
  title: string;
  cover: string;
  trackCount: number;
}

/** Identifies the playlist a game is played on. The server loads the tracks itself. */
export type PlaylistRef =
  | { source: 'deezer'; id: string; title: string; cover: string }
  | { source: 'custom'; title: string; cover: string };

/** What the settings dialog needs: the playlist to propose plus its tracks for validation. */
export interface PlaylistDetails {
  ref: PlaylistRef;
  tracks: Track[];
}

export interface Settings {
  rounds: number;
  gameMode: GameModes;
  speed: GameSpeeds;
  vibeMode: boolean;
  health: number;
  playlist: PlaylistRef;
}

/**
 * - `lobby`: picking a playlist.
 * - `proposal`: someone proposed a game, waiting for everyone to accept.
 * - `loading`: everyone accepted, the server loads the playlist.
 * - `countdown`: 3-2-1 before the first round.
 * - `round`: the music plays and players answer.
 * - `reveal`: the round is over, the right answer is shown (the music keeps playing in vibe mode).
 * - `roundOver`: the round's scores and the song are shown.
 * - `gameOver`: final results; a new game can be proposed from here.
 */
export type PartyPhase = 'lobby' | 'proposal' | 'loading' | 'countdown' | 'round' | 'reveal' | 'roundOver' | 'gameOver';

/** Phases of a running game. Nobody can join a party in these. */
export const GAME_PHASES: readonly PartyPhase[] = ['loading', 'countdown', 'round', 'reveal', 'roundOver'];

export type GameEndReason = 'rounds' | 'lastStanding' | 'allEliminated' | 'noTracks' | 'deezerError' | 'abandoned';

/** Public player state, sent to everyone in the party. */
export interface PlayerData {
  id: string;
  name: string;
  pfp: string;
  lives: number;
  points: number;
  streak: number;
  /** Points scored in the current (or last) round. */
  roundPoints: number;
  rightRounds: number;
  answered: boolean;
  accepted: boolean;
  isLeader: boolean;
  connected: boolean;
  /** Plays (or played) in the current game; false for players who joined after it. */
  participant: boolean;
}

export interface CustomPlaylistTrack extends Track {
  addedBy?: { id: string; name: string; pfp: string };
}

export interface ProposalInfo {
  byId: string;
  byName: string;
  settings: Settings;
}

export interface GameInfo {
  settings: Settings;
  /** 1-based number of the current round; 0 before the first one. */
  round: number;
  /** Answer options of the current round, already shuffled. Empty outside `round` / `reveal`. */
  answers: string[];
  /** Audio of the current round (`round` / `reveal`). */
  previewUrl: string | null;
  /** Audio of the upcoming round, sent early so clients can preload it. */
  nextPreviewUrl: string | null;
  /** The right answer and the song, revealed after the round (`reveal` / `roundOver`). */
  correctAnswer: string | null;
  song: Track | null;
  endReason: GameEndReason | null;
}

/** What only the receiving player sees about themselves. */
export interface SelfState {
  id: string;
  answer: string | null;
  correct: boolean | null;
  /** Revealed to a player as soon as they answered. */
  correctAnswer: string | null;
}

/** Full party snapshot. The server sends it to each player whenever anything changes. */
export interface PartyState {
  code: string;
  phase: PartyPhase;
  /** Milliseconds until the current timed phase ends, or null if it is not timed. */
  phaseEndsIn: number | null;
  /** In join order; the first player is the leader. */
  players: PlayerData[];
  proposal: ProposalInfo | null;
  game: GameInfo | null;
  customPlaylist: CustomPlaylistTrack[];
  you: SelfState;
}

export interface Profile {
  name: string;
  pfp: string;
}

export interface SessionInfo {
  /** Secret: proves the identity of this player when reconnecting. Never broadcast. */
  token: string;
  code: string;
  playerId: string;
}

export interface AnswerResult {
  correct: boolean;
  points: number;
  correctAnswer: string;
}
