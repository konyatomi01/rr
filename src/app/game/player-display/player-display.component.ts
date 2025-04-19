import { Component } from '@angular/core';
import { PartyService } from '../../services/party.service';
import { ServerService } from '../../services/server.service';

@Component({
  selector: 'rr-player-display',
  templateUrl: './player-display.component.html',
  styleUrl: './player-display.component.scss'
})
export class PlayerDisplayComponent {

  constructor(
    readonly party: PartyService,
    readonly server: ServerService
  ) {}

}
