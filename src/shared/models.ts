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

export interface Track {
  url: string;
  title: string;
  artist: string;
}

export interface PlaylistToPlay {
  title: string;
  cover: string;
  tracks: Track[];
}

export interface Settings {
  rounds: number;
  gameMode: GameModes;
  speed: GameSpeeds;
  vibeMode: boolean;
  health: number;
  playlist: PlaylistToPlay;
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
  cover: string;
}

export interface GameProposalData {
  player: string;
  settings: Settings;
}
