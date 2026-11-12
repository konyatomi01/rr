import { DestroyRef, Injectable, Signal, inject, signal } from '@angular/core';

/** Bootstrap breakpoints, exposed as signals that follow the viewport width. */
@Injectable({ providedIn: 'root' })
export class DisplayService {
  private readonly destroyRef = inject(DestroyRef);

  readonly isSm = this.minWidth(576);
  readonly isMd = this.minWidth(768);
  readonly isLg = this.minWidth(992);
  readonly isXl = this.minWidth(1200);

  private minWidth(px: number): Signal<boolean> {
    const query = window.matchMedia(`(min-width: ${px}px)`);
    const matches = signal(query.matches);
    const listener = (event: MediaQueryListEvent) => matches.set(event.matches);
    query.addEventListener('change', listener);
    this.destroyRef.onDestroy(() => query.removeEventListener('change', listener));
    return matches.asReadonly();
  }
}
