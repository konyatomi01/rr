import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PlayerData } from '../../../shared/models';
import { DialogService } from '../../services/dialog.service';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'rr-party-list',
  imports: [MatIconButton, MatIcon],
  templateUrl: './party-list.component.html',
  styleUrl: './party-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyListComponent {
  protected readonly party = inject(PartyService);
  private readonly dialog = inject(DialogService);

  async kickPlayer(player: PlayerData): Promise<void> {
    if (await this.dialog.confirm(`Are you sure you want to kick ${player.name}?`, 'Kick')) {
      this.party.kick(player.id);
    }
  }
}
