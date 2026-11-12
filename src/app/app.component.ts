import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GameOverComponent } from './game-over/game-over.component';
import { GameComponent } from './game/game.component';
import { LaunchComponent } from './launch/launch.component';
import { PlaylistSelectComponent } from './playlist-select/playlist-select.component';
import { RoundOverComponent } from './round-over/round-over.component';
import { RoutingService } from './services/routing.service';
import { SnackbarService } from './services/snackbar.service';

@Component({
  selector: 'rr-root',
  imports: [LaunchComponent, PlaylistSelectComponent, GameComponent, GameOverComponent, RoundOverComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly route = inject(RoutingService);
  protected readonly snackBar = inject(SnackbarService);
}
