import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { PlayerData } from '../../../shared/models';
import { DialogService } from '../../services/dialog.service';
import { PartyService } from '../../services/party.service';
import { ServerService } from '../../services/server.service';

@Component({
  selector: 'rr-party-list',
  imports: [MatIcon],
  templateUrl: './party-list.component.html',
  styleUrl: './party-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyListComponent {
  protected readonly party = inject(PartyService);
  private readonly server = inject(ServerService);
  private readonly dialog = inject(DialogService);

  async kickPlayer(player: PlayerData): Promise<void> {
    if (await this.dialog.openKickPlayerDialog(player.name)) {
      this.server.kickPlayer(player.id);
    }
  }
}
