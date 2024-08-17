"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const testParty = (0, rxjs_1.of)([
    { name: 'xd', pfp: 'assets/player-icons/player-icon-1.svg' },
    { name: 'xd1', pfp: 'assets/player-icons/player-icon-2.svg' },
    { name: 'xd2', pfp: 'assets/player-icons/player-icon-4.svg' },
    { name: 'xd3', pfp: 'assets/player-icons/player-icon-3.svg' },
    { name: 'xd4', pfp: 'assets/player-icons/player-icon-2.svg' },
    { name: 'xd5', pfp: 'assets/player-icons/player-icon-5.svg' },
    { name: 'xd6', pfp: 'assets/player-icons/player-icon-5.svg' },
    { name: 'xd7', pfp: 'assets/player-icons/player-icon-2.svg' }
]);
let PartyComponent = class PartyComponent {
    constructor(server) {
        this.server = server;
    }
    ngOnInit() {
        //server
        this.players = testParty;
    }
    leaveParty() {
        //server
    }
};
exports.PartyComponent = PartyComponent;
exports.PartyComponent = PartyComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-party',
        templateUrl: './party.component.html',
        styleUrl: './party.component.scss'
    })
], PartyComponent);
//# sourceMappingURL=party.component.js.map