import { Component } from '@angular/core';
import { PartyService } from '../services/party.service';
import { GameService } from '../services/game.service';
import { DisplayService } from '../services/display.service';
import { RoutingService } from '../services/routing.service';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss'
})
export class GameOverComponent {
  constructor(
    readonly party: PartyService,
    readonly game: GameService,
    readonly router: RoutingService
  ) {}

}
