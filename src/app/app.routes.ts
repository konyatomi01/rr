import { Routes } from '@angular/router';
import { LaunchComponent } from './launch/launch.component';
import { launchGuard, leavePartyGuard, partyGuard, screenGuard } from './navigation';

export const routes: Routes = [
  { path: '', component: LaunchComponent, canActivate: [launchGuard], title: 'Rhythm Royale' },
  { path: 'join/:code', component: LaunchComponent, canActivate: [launchGuard], title: 'Join a party – Rhythm Royale' },
  {
    path: 'party/:code',
    canActivate: [partyGuard],
    canDeactivate: [leavePartyGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./playlist-select/playlist-select.component').then(m => m.PlaylistSelectComponent),
        canActivate: [screenGuard('lobby')],
        title: 'Party – Rhythm Royale',
      },
      {
        path: 'game',
        loadComponent: () => import('./game/game.component').then(m => m.GameComponent),
        canActivate: [screenGuard('game')],
        title: 'Playing – Rhythm Royale',
      },
      {
        path: 'results',
        loadComponent: () => import('./game-over/game-over.component').then(m => m.GameOverComponent),
        canActivate: [screenGuard('results')],
        title: 'Results – Rhythm Royale',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
