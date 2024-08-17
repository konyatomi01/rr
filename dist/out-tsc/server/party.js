"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Party = void 0;
const server_1 = require("./server");
class Party {
    constructor(_id) {
        this.players = [];
        this.playlist = { title: '', cover: '', tracks: [] };
        this.gameMode = 'title';
        this.maxRounds = 10;
        this.maxLives = 3;
        this.speed = 30;
        this.currentRound = 0;
        this.currentSong = { url: '', title: '', artist: '' };
        this.id = _id;
    }
    addPlayer(player) {
        this.players.push(player);
    }
    removePlayer(player) {
        this.players.remove(player);
    }
    disband() {
        if (this.players.length == 0)
            server_1.GameServer.getInstance().partyList.remove(this);
    }
}
exports.Party = Party;
//# sourceMappingURL=party.js.map