import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  private isSmSubject = new BehaviorSubject<boolean>(false);
  private isMdSubject = new BehaviorSubject<boolean>(false);
  private isLgSubject = new BehaviorSubject<boolean>(false);
  private isXlSubject = new BehaviorSubject<boolean>(false);

  isSm$: Observable<boolean> = this.isSmSubject.asObservable().pipe(distinctUntilChanged());
  isMd$: Observable<boolean> = this.isMdSubject.asObservable().pipe(distinctUntilChanged());
  isLg$: Observable<boolean> = this.isLgSubject.asObservable().pipe(distinctUntilChanged());
  isXl$: Observable<boolean> = this.isXlSubject.asObservable().pipe(distinctUntilChanged());

  constructor(private ngZone: NgZone) {
    this.updateScreenSize(window.innerWidth);
    window.addEventListener('resize', (event) => {
      this.ngZone.run(() => {
        this.updateScreenSize(window.innerWidth);
      });
    });
  }

  private updateScreenSize(width: number): void {
    this.isSmSubject.next(width >= 576);
    this.isMdSubject.next(width >= 768);
    this.isLgSubject.next(width >= 992);
    this.isXlSubject.next(width >= 1200);
  }
}