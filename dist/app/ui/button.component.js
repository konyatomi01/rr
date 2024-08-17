import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
let ButtonComponent = class ButtonComponent {
    constructor() {
        this.icon = '';
        this.color = 'red';
        this.text = '';
    }
};
__decorate([
    Input()
], ButtonComponent.prototype, "icon", void 0);
__decorate([
    Input()
], ButtonComponent.prototype, "color", void 0);
__decorate([
    Input()
], ButtonComponent.prototype, "text", void 0);
ButtonComponent = __decorate([
    Component({
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
export { ButtonComponent };
//# sourceMappingURL=button.component.js.map