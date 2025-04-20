import { Injectable } from '@angular/core';
import { Player } from '../../server/player';
import { Track } from '../popups/settings/settings.component';

export type PlayerData = Omit<Player, 'socket' | 'disconnected' | 'isAlive' | 'reset' | 'playerData'>;

export interface CustomPlaylistTrack extends Track {
	player?: PlayerData,
	cover: string
}

@Injectable({
  providedIn: 'root'
})
export class PartyService {
  player?: PlayerData;
  party: PlayerData[] = [];
  showParty: boolean = false;
  customPlaylist: CustomPlaylistTrack[] = [];
  
}