import { Injectable } from '@angular/core';
import { Player } from '../../server/player';

export type PlayerData = Omit<Player, 'socket' | 'disconnected' | 'isAlive' | 'reset' | 'playerData'>;


@Injectable({
  providedIn: 'root'
})
export class PartyService {
  player?: PlayerData;
  party: PlayerData[] = [];
  showParty: boolean = false;

    constructor() { }

  
}