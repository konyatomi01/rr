import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { rankPlayers } from '../ranking';
import { GameService } from '../services/game.service';
import { PartyService } from '../services/party.service';

/** Between rounds: the song that played and everyone's score for the round. */
@Component({
  selector: 'rr-round-over',
  imports: [MatCard, MatIcon],
  templateUrl: './round-over.component.html',
  styleUrl: './round-over.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundOverComponent {
  private readonly party = inject(PartyService);
  protected readonly game = inject(GameService);
  protected readonly ranked = computed(() => rankPlayers(this.party.players().filter(p => p.participant)));
}
