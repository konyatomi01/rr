/**
 * Validation of everything a client sends. Clients are untrusted: every payload is checked for
 * type, length and allowed values before the game logic sees it.
 */
import { isDeezerId } from '../shared/deezer';
import {
  CUSTOM_PLAYLIST_COVER,
  GameModes,
  GameSpeeds,
  MAX_HEALTH,
  MAX_NAME_LENGTH,
  MAX_ROUNDS,
  PARTY_CODE_LENGTH,
  PLAYER_ICONS,
  PlaylistRef,
  Profile,
  Settings,
} from '../shared/models';

const MAX_TITLE_LENGTH = 100;
const DEEZER_IMAGE_URL = /^https:\/\/[a-z0-9.-]+\.dzcdn\.net\/[\w\-./]+$/i;
const CONTROL_CHARS = new RegExp('[\\u0000-\\u001f\\u007f-\\u009f\\u200b-\\u200f\\u2028-\\u202e\\u2066-\\u2069]', 'g');
const SPEEDS = new Set<number>([GameSpeeds.slow, GameSpeeds.normal, GameSpeeds.fast]);
const MODES = new Set<string>([GameModes.title, GameModes.artist]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(CONTROL_CHARS, '').trim().slice(0, maxLength);
}

export function randomPlayerName(): string {
  return `Player#${Math.floor(Math.random() * 999)}`;
}

/** Name and avatar, normalized. An empty name gets a generated one, an unknown avatar the first icon. */
export function parseProfile(value: unknown): Profile {
  const raw = isObject(value) ? value : {};
  const name = cleanText(raw['name'], MAX_NAME_LENGTH) || randomPlayerName();
  const pfp = typeof raw['pfp'] === 'string' && PLAYER_ICONS.includes(raw['pfp']) ? raw['pfp'] : PLAYER_ICONS[0];
  return { name, pfp };
}

export function isPartyCode(value: unknown): value is string {
  return typeof value === 'string' && new RegExp(`^\\d{${PARTY_CODE_LENGTH}}$`).test(value);
}

export function isShortString(value: unknown, maxLength = 200): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= maxLength;
}

function parsePlaylist(value: unknown): PlaylistRef | null {
  if (!isObject(value)) return null;
  const title = cleanText(value['title'], MAX_TITLE_LENGTH) || 'Playlist';
  if (value['source'] === 'custom') {
    return { source: 'custom', title: 'Custom Playlist', cover: CUSTOM_PLAYLIST_COVER };
  }
  if (value['source'] === 'deezer' && isDeezerId(value['id'])) {
    const cover = typeof value['cover'] === 'string' && DEEZER_IMAGE_URL.test(value['cover'])
      ? value['cover']
      : CUSTOM_PLAYLIST_COVER;
    return { source: 'deezer', id: value['id'], title, cover };
  }
  return null;
}

/** Game settings, or null if anything is out of range. `rounds` is checked against the tracks later. */
export function parseSettings(value: unknown): Settings | null {
  if (!isObject(value)) return null;
  const { rounds, gameMode, speed, vibeMode, health } = value;
  const playlist = parsePlaylist(value['playlist']);
  if (!playlist) return null;
  if (!Number.isInteger(rounds) || (rounds as number) < 1 || (rounds as number) > MAX_ROUNDS) return null;
  if (!Number.isInteger(health) || (health as number) < 1 || (health as number) > MAX_HEALTH) return null;
  if (typeof speed !== 'number' || !SPEEDS.has(speed)) return null;
  if (typeof gameMode !== 'string' || !MODES.has(gameMode)) return null;
  if (typeof vibeMode !== 'boolean') return null;
  return {
    rounds: rounds as number,
    health: health as number,
    speed: speed as GameSpeeds,
    gameMode: gameMode as GameModes,
    vibeMode,
    playlist,
  };
}

/** Escapes user-provided text for single-line log output. */
export function logSafe(value: unknown): string {
  return JSON.stringify(String(value));
}
