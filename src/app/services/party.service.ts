import { Injectable } from '@angular/core';

export interface PlayerEval {
  name: string,
  pfp: string,
  points: number,
  streak: number,
}

@Injectable({
  providedIn: 'root'
})
export class PartyService {
  player: any;
  party: any[] = [];
  partyEval: PlayerEval[] = [];

    constructor() { }

  
}