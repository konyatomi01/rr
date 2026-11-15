import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { GameService } from '../services/game.service';
import { PartyService } from '../services/party.service';
import { SnackbarService } from '../services/snackbar.service';
import { SlidingToggleDirective } from '../sliding-toggle.directive';
import { CategoriesComponent } from './categories/categories.component';
import { CustomPlaylistComponent } from './custom-playlist/custom-playlist.component';
import { PartyListComponent } from './party-list/party-list.component';
import { PartyComponent } from './party/party.component';
import { SearchComponent } from './search/search.component';

enum PlaylistSelectTab {
  charts,
  search,
  custom,
}

@Component({
  selector: 'rr-playlist-select',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatButton,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatBadge,
    MatIcon,
    MatProgressSpinner,
    SlidingToggleDirective,
    PartyComponent,
    PartyListComponent,
    SearchComponent,
    CategoriesComponent,
    CustomPlaylistComponent,
  ],
  templateUrl: './playlist-select.component.html',
  styleUrl: './playlist-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistSelectComponent {
  protected readonly party = inject(PartyService);
  protected readonly game = inject(GameService);
  private readonly snackBar = inject(SnackbarService);

  protected readonly tabs = PlaylistSelectTab;
  readonly tabControl = new FormControl(PlaylistSelectTab.charts, { nonNullable: true });
  readonly selectedTab = toSignal(this.tabControl.valueChanges, { initialValue: this.tabControl.value });

  /** This player accepted a proposal (or made it) and waits for the others. */
  readonly waiting = computed(() => {
    const phase = this.party.phase();
    return phase === 'loading' || (phase === 'proposal' && (this.party.self()?.accepted ?? false));
  });
  readonly isProposer = computed(() => this.party.proposal()?.byId === this.party.self()?.id);

  /** Shares an invite link (native share sheet on phones, clipboard elsewhere). */
  async invite(): Promise<void> {
    const code = this.party.code();
    const url = `${location.origin}/join/${code}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Rhythm Royale', text: `Join my Rhythm Royale party! Code: ${code}`, url });
        return;
      } catch (e) {
        if ((e as DOMException).name === 'AbortError') return; // the player closed the share sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      this.snackBar.message('Invite link copied! Send it to your friends.');
    } catch {
      this.snackBar.message(`Could not copy the link. The join code is ${code}.`);
    }
  }
}
