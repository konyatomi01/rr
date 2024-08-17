import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { of } from 'rxjs';
const testParty = of([
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
PartyComponent = __decorate([
    Component({
        selector: 'app-party',
        templateUrl: './party.component.html',
        styleUrl: './party.component.scss'
    })
], PartyComponent);
export { PartyComponent };
//# sourceMappingURL=party.component.js.map