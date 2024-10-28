import { Component } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrl: './party.component.scss'
})
export class PartyComponent {

  constructor(
    private server: ServerService,
    readonly party: PartyService
  ) {
  }
  leaveParty(): void {
    this.server.leaveParty();
  }
}
