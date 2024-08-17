import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { PartyService } from '../services/party.service';

@Component({
  selector: 'app-round-over',
  templateUrl: './round-over.component.html',
  styleUrl: './round-over.component.scss'
})
export class RoundOverComponent {
  constructor(
    readonly party: PartyService,
  ) {}

  tesztparty: any[] = [
    { name: 'xd', pfp: 'assets/player-icons/player-icon-1.svg', points: 121122, rightRounds: 1},
    { name: 'xdfshjvfuzsvf', pfp: 'assets/player-icons/player-icon-2.svg', points: 121122, rightRounds: 3},
    { name: 'xdjksdbfdbfbshjbfj', pfp: 'assets/player-icons/player-icon-4.svg', points: 121122, rightRounds: 12},
    { name: 'xddsjhfvjd', pfp: 'assets/player-icons/player-icon-3.svg', points: 121122, rightRounds: 12},
    { name: 'xdvsvs', pfp: 'assets/player-icons/player-icon-5.svg', points: 121122111, rightRounds: 69},
    { name: 'xdsfs', pfp: 'assets/player-icons/player-icon-1.svg', points: 12112313, rightRounds: 43},
    { name: 'xdsfsfsf', pfp: 'assets/player-icons/player-icon-6.svg', points: 12213123122, rightRounds: 0},
  ]
}
