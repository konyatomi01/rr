import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { PartyService } from '../../services/party.service';

/** The player's own card in the game: avatar, points and lives. */
@Component({
  selector: 'rr-player-display',
  imports: [MatCard, MatIcon],
  template: `
    @if (party.self(); as player) {
      <mat-card class="rr-card rr-compact main-player">
        <img [src]="player.pfp" class="rr-pfp main-pfp me-2" alt="">
        <div>
          <div>{{ player.name }}</div>
          <div>{{ player.points }} points</div>
          <div class="d-flex hearts" [attr.aria-label]="player.lives + ' lives left'">
            @for (index of hearts; track index) {
              <mat-icon [svgIcon]="index < player.lives ? 'heart-filled' : 'heart'" />
            }
          </div>
        </div>
      </mat-card>
    }
  `,
  styles: `
    .main-player {
      height: 100%;
      flex-direction: row;
    }
    .main-pfp {
      height: 100%;
    }
    .hearts .mat-icon {
      width: 40px;
      height: 40px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerDisplayComponent {
  protected readonly party = inject(PartyService);
  protected readonly hearts = [0, 1, 2];
}
