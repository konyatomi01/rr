import { Injectable, signal } from '@angular/core';
import { CustomPlaylistTrack, PlayerData } from '../../shared/models';

export type { CustomPlaylistTrack, PlayerData } from '../../shared/models';

const CUSTOM_PLAYLIST_KEY = 'customPlaylist';

@Injectable({ providedIn: 'root' })
export class PartyService {
  readonly player = signal<PlayerData | undefined>(undefined);
  readonly party = signal<PlayerData[]>([]);
  readonly showParty = signal(false);
  readonly customPlaylist = signal<CustomPlaylistTrack[]>([]);

  toggleShowParty(): void {
    this.showParty.update(show => !show);
  }

  setCustomPlaylist(songs: CustomPlaylistTrack[]): void {
    sessionStorage.setItem(CUSTOM_PLAYLIST_KEY, JSON.stringify(songs));
    this.customPlaylist.set(songs);
  }

  restoreCustomPlaylist(): void {
    const stored: CustomPlaylistTrack[] = JSON.parse(sessionStorage.getItem(CUSTOM_PLAYLIST_KEY) || '[]');
    // Entries saved before the Deezer migration have no id and can't be played any more.
    this.customPlaylist.set(stored.filter(track => track.id));
  }

  clearStoredCustomPlaylist(): void {
    sessionStorage.removeItem(CUSTOM_PLAYLIST_KEY);
  }
}
