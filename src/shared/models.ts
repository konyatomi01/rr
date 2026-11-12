/**
 * Types shared between the Angular client and the Node game server.
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

/** Fewest playable tracks a playlist needs: one right answer plus three wrong ones. */
export const MIN_PLAYLIST_TRACKS = 4;

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

/** Serialisable player state sent from the server to clients. */
export interface PlayerData {
  id: string;
  name: string;
  pfp: string;
  lives: number;
  points: number;
  streak: number;
  currentPoints: number;
  rightRounds: number;
  answered: boolean;
  accepted: boolean;
  isLeader: boolean;
}

export interface CustomPlaylistTrack extends Track {
  player?: PlayerData;
}

export interface GameProposalData {
  player: string;
  settings: Settings;
}
