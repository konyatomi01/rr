import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
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
            name: ['', Validators.required]
        });
        this.code = this.fb.group({
            code: ['', Validators.required]
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
LaunchComponent = __decorate([
    Component({
        selector: 'app-launch',
        templateUrl: './launch.component.html',
        styleUrl: './launch.component.scss'
    })
], LaunchComponent);
export { LaunchComponent };
//# sourceMappingURL=launch.component.js.map