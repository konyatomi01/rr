"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let DisplayService = class DisplayService {
    constructor(ngZone) {
        this.ngZone = ngZone;
        this.isSmSubject = new rxjs_1.BehaviorSubject(false);
        this.isMdSubject = new rxjs_1.BehaviorSubject(false);
        this.isLgSubject = new rxjs_1.BehaviorSubject(false);
        this.isXlSubject = new rxjs_1.BehaviorSubject(false);
        this.isSm$ = this.isSmSubject.asObservable().pipe((0, operators_1.distinctUntilChanged)());
        this.isMd$ = this.isMdSubject.asObservable().pipe((0, operators_1.distinctUntilChanged)());
        this.isLg$ = this.isLgSubject.asObservable().pipe((0, operators_1.distinctUntilChanged)());
        this.isXl$ = this.isXlSubject.asObservable().pipe((0, operators_1.distinctUntilChanged)());
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
exports.DisplayService = DisplayService;
exports.DisplayService = DisplayService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root'
    })
], DisplayService);
//# sourceMappingURL=display.service.js.map