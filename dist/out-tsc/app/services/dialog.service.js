"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const settings_component_1 = require("../popups/settings/settings.component");
const accept_component_1 = require("../popups/accept/accept.component");
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
        const dialogRef = this.dialog.open(settings_component_1.SettingsComponent, config);
        return dialogRef.afterClosed();
    }
    openAcceptDialog(data) {
        const dialogRef = this.dialog.open(accept_component_1.AcceptComponent, {
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
exports.DialogService = DialogService;
exports.DialogService = DialogService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root'
    })
], DialogService);
//# sourceMappingURL=dialog.service.js.map