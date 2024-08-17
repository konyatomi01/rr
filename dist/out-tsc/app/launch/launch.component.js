"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaunchComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
let LaunchComponent = class LaunchComponent {
    constructor(fb, server) {
        this.fb = fb;
        this.server = server;
        this.icons = [
            'assets/player-icons/player-icon-1.svg',
            'assets/player-icons/player-icon-2.svg',
            'assets/player-icons/player-icon-3.svg',
            'assets/player-icons/player-icon-4.svg',
            'assets/player-icons/player-icon-5.svg',
            'assets/player-icons/player-icon-6.svg',
            'assets/player-icons/player-icon-7.svg',
        ];
        this.selectedIcon = 'assets/player-icons/player-icon-1.svg';
        this.accountCreated = false;
        this.form = this.fb.group({
            icon: [''],
            name: ['', forms_1.Validators.required]
        });
        this.code = this.fb.group({
            code: ['', forms_1.Validators.required]
        });
    }
    selectIcon(icon) {
        this.selectedIcon = icon;
        this.form.get('icon')?.setValue(icon);
    }
    next() {
        if (this.form.valid) {
            this.accountCreated = true;
            this.server.playerCreated(this.form.get('name').value, this.form.get('icon').value);
        }
        else {
            this.form.get('name').markAsTouched();
        }
    }
    hostGame() {
        this.server.hostGame();
    }
};
exports.LaunchComponent = LaunchComponent;
exports.LaunchComponent = LaunchComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-launch',
        templateUrl: './launch.component.html',
        styleUrl: './launch.component.scss'
    })
], LaunchComponent);
//# sourceMappingURL=launch.component.js.map