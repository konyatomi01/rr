import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
let DisplayService = class DisplayService {
    constructor(ngZone) {
        this.ngZone = ngZone;
        this.isSmSubject = new BehaviorSubject(false);
        this.isMdSubject = new BehaviorSubject(false);
        this.isLgSubject = new BehaviorSubject(false);
        this.isXlSubject = new BehaviorSubject(false);
        this.isSm$ = this.isSmSubject.asObservable().pipe(distinctUntilChanged());
        this.isMd$ = this.isMdSubject.asObservable().pipe(distinctUntilChanged());
        this.isLg$ = this.isLgSubject.asObservable().pipe(distinctUntilChanged());
        this.isXl$ = this.isXlSubject.asObservable().pipe(distinctUntilChanged());
        this.updateScreenSize(window.innerWidth);
        window.addEventListener('resize', (event) => {
            this.ngZone.run(() => {
                this.updateScreenSize(window.innerWidth);
            });
        });
    }
    updateScreenSize(width) {
        this.isSmSubject.next(width >= 576);
        this.isMdSubject.next(width >= 768);
        this.isLgSubject.next(width >= 992);
        this.isXlSubject.next(width >= 1200);
    }
};
DisplayService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], DisplayService);
export { DisplayService };
//# sourceMappingURL=display.service.js.map