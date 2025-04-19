import { Component } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { PartyService } from '../../services/party.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'rr-party',
  templateUrl: './party.component.html',
  styleUrl: './party.component.scss'
})
export class PartyComponent {

  constructor(
    private server: ServerService,
    readonly party: PartyService,
    public dialog: DialogService,
  ) {
  }
  leaveParty(): void {
    this.server.leaveParty();
  }
}
