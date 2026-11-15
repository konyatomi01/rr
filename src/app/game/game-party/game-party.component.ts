import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { rankPlayers } from '../../ranking';
import { PartyService } from '../../services/party.service';

/** Everyone's points and lives during the game, in ranking order. */
@Component({
  selector: 'rr-game-party',
  imports: [MatIcon],
  template: `
    <div class="players">
      @for (entry of ranked(); track entry.player.id) {
        <div class="rr-player-row player mb-1 ps-1" [class.disconnected]="!entry.player.connected">
          <img [src]="entry.player.pfp" class="pfp" alt="">
          <div class="d-flex h-100 details justify-content-between align-items-center px-1">
            <div class="overflow-hidden">
              <div class="text-truncate">{{ entry.player.name }}</div>
              <div>{{ entry.player.points }}p</div>
            </div>
            <div class="d-flex align-items-center hearts" [attr.aria-label]="entry.player.lives + ' lives left'">
              @for (index of hearts; track index) {
                <mat-icon [svgIcon]="index < entry.player.lives ? 'heart-filled' : 'heart'" />
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .players {
      width: 100%;
      height: 100%;
      overflow: auto;
    }
    .player {
      height: 50px;
    }
    .details {
      width: calc(100% - 50px);
    }
    .pfp {
      height: 85%;
    }
    .hearts .mat-icon {
      width: 25px;
      height: 25px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePartyComponent {
  private readonly party = inject(PartyService);
  protected readonly hearts = [0, 1, 2];
  protected readonly ranked = computed(() => rankPlayers(this.party.players().filter(p => p.participant)));
}
