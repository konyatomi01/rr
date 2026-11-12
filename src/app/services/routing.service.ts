import { Injectable, signal } from '@angular/core';

export type AppState = 'launch' | 'select' | 'game' | 'gameover' | 'roundover';

const STORAGE_KEY = 'routerState';
const STATES: readonly AppState[] = ['launch', 'select', 'game', 'gameover', 'roundover'];

@Injectable({ providedIn: 'root' })
export class RoutingService {
  private readonly _state = signal<AppState>(RoutingService.restoreState());
  readonly state = this._state.asReadonly();

  launch(): void {
    this.setState('launch');
  }
  select(): void {
    this.setState('select');
  }
  game(): void {
    this.setState('game');
  }
  gameover(): void {
    this.setState('gameover');
  }
  roundover(): void {
    this.setState('roundover');
  }

  private setState(state: AppState): void {
    this._state.set(state);
    sessionStorage.setItem(STORAGE_KEY, state);
  }

  private static restoreState(): AppState {
    const saved = sessionStorage.getItem(STORAGE_KEY) as AppState | null;
    return saved && STATES.includes(saved) ? saved : 'launch';
  }
}
