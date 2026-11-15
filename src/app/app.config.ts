import { provideHttpClient, withJsonpSupport } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { NavigationService } from './navigation';
import { GameService } from './services/game.service';

/** App icons from src/assets, used as `<mat-icon svgIcon="heart" />`. */
const SVG_ICONS = ['heart', 'heart-filled', 'crown', 'plus', 'minus', 'rounds', 'lives', 'speed'];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // JSONP: the browser calls Deezer directly (it sends no CORS headers) so results follow
    // the player's region.
    provideHttpClient(withJsonpSupport()),
    provideRouter(
      routes,
      withComponentInputBinding(),
      // Keeps the browser history consistent when a guard cancels a back navigation.
      withRouterConfig({ canceledNavigationResolution: 'computed' }),
    ),
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { panelClass: 'rr-dialog', autoFocus: 'dialog', restoreFocus: true, maxWidth: '92vw' } satisfies MatDialogConfig,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 3000, panelClass: 'rr-snackbar' } satisfies MatSnackBarConfig,
    },
    provideAppInitializer(() => {
      const icons = inject(MatIconRegistry);
      const sanitizer = inject(DomSanitizer);
      // Static, same-origin asset paths only.
      SVG_ICONS.forEach(name => icons.addSvgIcon(name, sanitizer.bypassSecurityTrustResourceUrl(`assets/${name}.svg`)));
      // Connect to the game server (restoring a stored session) and follow its state from the start.
      inject(NavigationService);
      inject(GameService);
    }),
  ],
};
