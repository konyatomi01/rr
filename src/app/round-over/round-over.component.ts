import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { PartyService } from '../services/party.service';

@Component({
  selector: 'rr-round-over',
  imports: [MatIcon],
  templateUrl: './round-over.component.html',
  styleUrl: './round-over.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundOverComponent {
  protected readonly party = inject(PartyService);
}
