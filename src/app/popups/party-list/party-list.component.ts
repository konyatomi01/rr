import { Component } from '@angular/core';
import { PartyService } from '../../services/party.service';
import { ServerService } from '../../services/server.service';

@Component({
  selector: 'rr-party-list',
  templateUrl: './party-list.component.html',
  styleUrl: './party-list.component.scss'
})
export class PartyListComponent {

  constructor(
    readonly server: ServerService,
    public party: PartyService,
  ) {}

}
