import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let ServerService = class ServerService {
    constructor(router, socket) {
        this.router = router;
        this.socket = socket;
        this.player_id = '696969';
        this.party_id = '696969';
        this.waitingToAccept = false;
    }
    playerCreated(name, pfp) {
        this.socket.emit('playerCreated', name, pfp);
    }
    hostGame() {
        //server
        this.navigateToPlaylistSelect();
    }
    navigateToPlaylistSelect() {
        this.router.navigate(['/select']);
    }
    startGame(settings) {
        //server
    }
};
ServerService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ServerService);
export { ServerService };
//# sourceMappingURL=server.sevice.js.map