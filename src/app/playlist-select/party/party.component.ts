import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { PartyService } from '../../services/party.service';
import { ServerService } from '../../services/server.service';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'rr-party',
  imports: [MatIcon, ButtonComponent],
  templateUrl: './party.component.html',
  styleUrl: './party.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyComponent {
  protected readonly party = inject(PartyService);
  private readonly server = inject(ServerService);

  leaveParty(): void {
    this.server.leaveParty();
  }
}
