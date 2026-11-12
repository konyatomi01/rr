import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'rr-game-party',
  templateUrl: './game-party.component.html',
  styleUrl: './game-party.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePartyComponent {
  protected readonly party = inject(PartyService);
  protected readonly hearts = [0, 1, 2];
}
