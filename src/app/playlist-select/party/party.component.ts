import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.sevice';
import { Observable, of } from 'rxjs';
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
