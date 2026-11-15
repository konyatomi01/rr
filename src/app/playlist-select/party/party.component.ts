import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PartyService } from '../../services/party.service';

@Component({
  selector: 'rr-party',
  imports: [MatButton, MatIconButton, MatIcon, MatBadge],
  templateUrl: './party.component.html',
  styleUrl: './party.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyComponent {
  protected readonly party = inject(PartyService);
  private readonly router = inject(Router);

  /** Leaving goes through the router, whose guard asks for confirmation. */
  leaveParty(): void {
    void this.router.navigate(['/']);
  }

  togglePlayerList(): void {
    this.party.showPlayerList.update(show => !show);
  }
}
