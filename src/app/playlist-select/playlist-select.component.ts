import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { PartyService } from '../services/party.service';
import { ServerService } from '../services/server.service';
import { SnackbarService } from '../services/snackbar.service';
import { ButtonComponent } from '../ui/button/button.component';
import { ToggleButtonComponent, ToggleDirective } from '../ui/toggle-button/toggle-button.component';
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
    ButtonComponent,
    ToggleButtonComponent,
    ToggleDirective,
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
  protected readonly server = inject(ServerService);
  protected readonly party = inject(PartyService);
  private readonly snackBar = inject(SnackbarService);

  protected readonly tabs = PlaylistSelectTab;
  readonly tabControl = new FormControl(PlaylistSelectTab.charts, { nonNullable: true });
  readonly selectedTab = toSignal(this.tabControl.valueChanges, { initialValue: this.tabControl.value });
  readonly waitingToAccept = computed(() => this.party.player()?.accepted ?? false);

  constructor() {
    this.party.restoreCustomPlaylist();
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.server.partyId());
    this.snackBar.message('Code copied!');
  }
}
