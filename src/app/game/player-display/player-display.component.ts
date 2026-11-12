import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'rr-player-display',
  templateUrl: './player-display.component.html',
  styleUrl: './player-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerDisplayComponent {
  protected readonly party = inject(PartyService);
  protected readonly hearts = [0, 1, 2];
}
