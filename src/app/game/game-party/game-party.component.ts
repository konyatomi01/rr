import { Component } from '@angular/core';
import { PartyService } from '../../services/party.service';
import { ServerService } from '../../services/server.sevice';


@Component({
  selector: 'app-game-party',
  templateUrl: './game-party.component.html',
  styleUrl: './game-party.component.scss'
})
export class GamePartyComponent {
  constructor(
    readonly party: PartyService,
    private server: ServerService
  ) {}

}
