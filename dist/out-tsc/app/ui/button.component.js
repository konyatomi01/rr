"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let ButtonComponent = class ButtonComponent {
    constructor() {
        this.icon = '';
        this.color = 'red';
        this.text = '';
    }
};
exports.ButtonComponent = ButtonComponent;
tslib_1.__decorate([
    (0, core_1.Input)()
], ButtonComponent.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], ButtonComponent.prototype, "color", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], ButtonComponent.prototype, "text", void 0);
exports.ButtonComponent = ButtonComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'rr-button',
        template: `
    <button [ngClass]="color">
        <mat-icon *ngIf="icon" class="me-1">{{icon}}</mat-icon>
        {{text}}
        <ng-content />
    </button>
  `,
        styleUrl: './button.component.scss'
    })
], ButtonComponent);
//# sourceMappingURL=button.component.js.map