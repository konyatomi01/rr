import { TestBed } from '@angular/core/testing';
import { RoutingService } from './routing.service';

describe('RoutingService', () => {
  beforeEach(() => sessionStorage.clear());

  it('starts on the launch screen by default', () => {
    expect(TestBed.inject(RoutingService).state()).toBe('launch');
  });

  it('persists the current screen to sessionStorage', () => {
    TestBed.inject(RoutingService).game();
    expect(sessionStorage.getItem('routerState')).toBe('game');
  });

  it('restores a saved screen and ignores invalid values', () => {
    sessionStorage.setItem('routerState', 'select');
    expect(TestBed.inject(RoutingService).state()).toBe('select');

    TestBed.resetTestingModule();
    sessionStorage.setItem('routerState', 'bogus');
    expect(TestBed.inject(RoutingService).state()).toBe('launch');
  });
});
