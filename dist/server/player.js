export class Player {
    constructor(_id, _name, _pfp, _socket) {
        this.name = '';
        this.pfp = '';
        this.lives = 0;
        this.points = 0;
        this.streak = 0;
        //currentPoints: number = 0
        this.answered = false;
        this.accepted = false;
        this.id = _id;
        this.pfp = _pfp;
        this.socket = _socket;
    }
    isAlive() { return this.lives > 0; }
}
//# sourceMappingURL=player.js.map