import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GameService } from '../services/game.service';
import { PartyService } from '../services/party.service';
import { RoutingService } from '../services/routing.service';
import { ButtonComponent } from '../ui/button/button.component';

@Component({
  selector: 'rr-game-over',
  imports: [ButtonComponent],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameOverComponent {
  protected readonly party = inject(PartyService);
  protected readonly game = inject(GameService);
  protected readonly router = inject(RoutingService);
}
