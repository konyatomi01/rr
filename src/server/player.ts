import { PlayerData } from "../app/services/party.service";

export class Player {
    disconnected: boolean = false;

    socket: any
    id: string
    name: string = ''
    pfp: string = ''

    lives: number = 0
    points: number = 0
    streak: number = 1
    currentPoints: number = 0
    rightRounds: number = 0
    answered: boolean = false
    accepted: boolean = false 
    isLeader: boolean = false

    constructor(_id: string, _name: string, _pfp: string, _socket: any) {
        this.id = _id;
        this.name = _name;
        this.pfp = _pfp;
        this.socket = _socket;
    }

    isAlive() {return this.lives>0};

    get playerData(): PlayerData {
        return {
            id: this.id,
            name: this.name,
            pfp: this.pfp,
            lives: this.lives,
            points: this.points,
            streak: this.streak,
            currentPoints: this.currentPoints,
            rightRounds: this.rightRounds,
            answered: this.answered,
            accepted: this.accepted,
            isLeader: this.isLeader,
        };
    }
    
    reset(health: number) {
        this.accepted = false;
        this.answered = false;
        this.lives = health;
        this.points = 0;
        this.streak = 1;
        this.rightRounds = 0;
    }

}