"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
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
exports.ServerService = ServerService;
exports.ServerService = ServerService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root'
    })
], ServerService);
//# sourceMappingURL=server.sevice.js.map