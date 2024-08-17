import { GameServer } from "./server";
export class Party {
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
            GameServer.getInstance().partyList.remove(this);
    }
}
//# sourceMappingURL=party.js.map