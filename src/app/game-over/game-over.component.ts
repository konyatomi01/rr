import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { GameEndReason } from '../../shared/models';
import { rankPlayers } from '../ranking';
import { GameService } from '../services/game.service';
import { PartyService } from '../services/party.service';

const REASONS: Record<GameEndReason, string> = {
  rounds: 'All rounds have been played.',
  lastStanding: 'Only one player is left standing.',
  allEliminated: 'Everyone ran out of lives.',
  noTracks: 'The playlist ran out of playable songs.',
  deezerError: 'The music service stopped responding, so the game had to end.',
  abandoned: 'Everyone left the game.',
};

@Component({
  selector: 'rr-game-over',
  imports: [MatCard, MatButton],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameOverComponent {
  protected readonly party = inject(PartyService);
  protected readonly game = inject(GameService);

  protected readonly ranked = computed(() => rankPlayers(this.party.players().filter(p => p.participant)));

  protected readonly title = computed(() => {
    const ranked = this.ranked();
    if (ranked.length < 2) return 'The game is over!';
    const winners = ranked.filter(entry => entry.rank === 1);
    return winners.length === 1 ? `${winners[0].player.name} wins!` : "It's a tie!";
  });

  protected readonly reason = computed(() => {
    const reason = this.game.game()?.endReason;
    return reason ? REASONS[reason] : '';
  });

  protected medal(rank: number): string {
    return ['', 'gold', 'silver', 'bronze'][rank] ?? '';
  }

  playAgain(): void {
    this.party.resultsDismissed.set(true);
  }
}
