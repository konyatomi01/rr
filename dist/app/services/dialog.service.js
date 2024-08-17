import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { SettingsComponent } from '../popups/settings/settings.component';
import { AcceptComponent } from '../popups/accept/accept.component';
let DialogService = class DialogService {
    constructor(dialog) {
        this.dialog = dialog;
    }
    openSettingsDialog(data) {
        const config = {
            data: data,
            position: { top: '0px' },
            hasBackdrop: true,
        };
        const dialogRef = this.dialog.open(SettingsComponent, config);
        return dialogRef.afterClosed();
    }
    openAcceptDialog(data) {
        const dialogRef = this.dialog.open(AcceptComponent, {
            width: '90vw',
            data: data,
            position: { top: '0px' }
        });
        return dialogRef.afterClosed();
    }
    closeDialog() {
        this.dialog.closeAll();
    }
};
DialogService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], DialogService);
export { DialogService };
//# sourceMappingURL=dialog.service.js.map