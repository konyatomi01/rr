import { Component } from '@angular/core';
import { PartyService, PlayerData } from '../../services/party.service';
import { ServerService } from '../../services/server.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'rr-party-list',
  templateUrl: './party-list.component.html',
  styleUrl: './party-list.component.scss'
})
export class PartyListComponent {

  constructor(
    readonly server: ServerService,
    public party: PartyService,
    private dialog: DialogService,
  ) {}

  async kickPlayer(player: PlayerData): Promise<void> {
    const res = await this.dialog.openKickPlayerDialog(player.name);
    if (res) {
      this.server.kickPlayer(player.id);
    }
  } 
}
