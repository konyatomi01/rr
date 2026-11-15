import { Injectable, effect, inject, untracked } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanDeactivateFn, Router, UrlTree } from '@angular/router';
import { DialogService } from './services/dialog.service';
import { PartyService, Screen } from './services/party.service';
import { SnackbarService } from './services/snackbar.service';

export function screenUrl(code: string, screen: Screen | null): string[] {
  return !screen || screen === 'lobby' ? ['/party', code] : ['/party', code, screen];
}

/** Navigations that must not ask "leave the party?" (the party is already gone). */
const FORCE = { force: true };

/**
 * Keeps the URL in sync with the server's state: when the phase changes (a game starts, ends…)
 * every player is moved to the matching screen. Screens inside a party replace each other in the
 * history, so the back button always means "leave the party".
 */
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);
  private readonly party = inject(PartyService);

  constructor() {
    effect(() => {
      const status = this.party.status();
      const screen = this.party.screen();
      const code = this.party.code();
      untracked(() => {
        if (status === 'none') {
          if (this.inParty()) void this.router.navigate(['/'], { replaceUrl: true, state: FORCE });
        } else if (status === 'active' && screen) {
          const target = this.router.createUrlTree(screenUrl(code, screen));
          if (!this.router.isActive(target, { paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' })) {
            void this.router.navigateByUrl(target, { replaceUrl: this.inParty() });
          }
        }
      });
    });
  }

  private inParty(): boolean {
    return this.router.url.startsWith('/party/');
  }
}

/** Party screens need a session for that party; without one, offer to join it. */
export const partyGuard: CanActivateFn = async (route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> => {
  const party = inject(PartyService);
  const router = inject(Router);
  const code = route.paramMap.get('code') ?? '';
  if ((await party.settled()) !== 'active') return router.createUrlTree(['/join', code]);
  return party.code() === code ? true : router.createUrlTree(screenUrl(party.code(), party.screen()));
};

/** Each party screen is only reachable in the matching phase (no game screen in the lobby…). */
export function screenGuard(screen: Screen): CanActivateFn {
  return () => {
    const party = inject(PartyService);
    const current = party.screen();
    return !current || current === screen ? true : inject(Router).createUrlTree(screenUrl(party.code(), current));
  };
}

/** The launch screens are for players not in a party; members are sent back to their party. */
export const launchGuard: CanActivateFn = async (route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> => {
  const party = inject(PartyService);
  if ((await party.settled()) !== 'active') return true;
  const code = route.paramMap.get('code');
  if (code && code !== party.code()) {
    inject(SnackbarService).message(`You are already in party ${party.code()}. Leave it to join another one!`);
  }
  return inject(Router).createUrlTree(screenUrl(party.code(), party.screen()));
};

/** Leaving the party screens (back button, Leave button) asks first, then leaves the party. */
export const leavePartyGuard: CanDeactivateFn<unknown> = async (_component, _route, _state, next) => {
  const router = inject(Router);
  const party = inject(PartyService);
  const dialog = inject(DialogService);
  const forced = router.currentNavigation()?.extras.state?.['force'] === true;
  if (forced || party.status() === 'none' || next.url.startsWith(`/party/${party.code()}`)) return true;

  const inGame = party.screen() === 'game';
  const confirmed = await dialog.confirm(
    inGame ? 'Leave the game? You will leave the party too.' : 'Leave the party?',
    'Leave',
    'Stay',
  );
  if (confirmed) await party.leave();
  return confirmed;
};
