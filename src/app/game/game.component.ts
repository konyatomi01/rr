import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { GameService } from '../services/game.service';
import { PartyService } from '../services/party.service';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  constructor(
    readonly gameService: GameService,
    readonly party: PartyService,
  ) {}

  get isLowTime(): boolean {
    const remainingTime = this.gameService.remainingTime.getValue();
    return remainingTime < 6;
  }
}

