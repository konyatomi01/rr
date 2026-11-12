import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GameService } from '../services/game.service';
import { PartyService } from '../services/party.service';
import { ServerService } from '../services/server.service';
import { GamePartyComponent } from './game-party/game-party.component';
import { PlayerDisplayComponent } from './player-display/player-display.component';

@Component({
  selector: 'rr-game',
  imports: [PlayerDisplayComponent, GamePartyComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  protected readonly game = inject(GameService);
  protected readonly party = inject(PartyService);
  private readonly server = inject(ServerService);

  answerButtonClicked(answer: string): void {
    const player = this.party.player();
    if (!player || player.lives <= 0 || this.game.remainingTime() <= 0 || this.game.answered()) return;

    this.game.answered.set(true);
    if (answer === this.game.rightAnswer()) {
      const answerTime = performance.now() - this.game.startTime;
      const points = Math.round((this.game.maxTime() * 1000 - answerTime) * player.streak);
      this.server.answerRight(points);
    } else {
      this.server.answerWrong();
    }
  }
}
