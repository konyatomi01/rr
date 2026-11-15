import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { RoundOverComponent } from '../round-over/round-over.component';
import { GameService } from '../services/game.service';
import { PartyService } from '../services/party.service';
import { GamePartyComponent } from './game-party/game-party.component';
import { PlayerDisplayComponent } from './player-display/player-display.component';

@Component({
  selector: 'rr-game',
  imports: [MatCard, MatButton, MatIconButton, MatIcon, MatProgressSpinner, PlayerDisplayComponent, GamePartyComponent, RoundOverComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  protected readonly game = inject(GameService);
  protected readonly party = inject(PartyService);
  private readonly router = inject(Router);

  /** Leaving goes through the router, whose guard asks for confirmation. */
  leave(): void {
    void this.router.navigate(['/']);
  }
}
