import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Player } from './player';
import { Party } from './party';
import { Settings } from '../app/popups/settings/settings.component';
import * as dotenv from 'dotenv';


export class GameServer {
    private static instance: GameServer;

    private constructor() { }

    public static getInstance(): GameServer {
        if (!GameServer.instance) {
            GameServer.instance = new GameServer();
        }
        return GameServer.instance;
    }

    generateRandomString = (length: number) => {
        const possible = '0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "").toString();
    }

    playerList: Player[] = [];
    partyList: Party[] = [];
    disconnectedPlayers: Player[] = [];


    findParty(party_id: string): Party | undefined {
        return this.partyList.find(p => p.id === party_id);
    }

    findPlayer(player_id: string): Player | undefined {
        return this.playerList.find(p => p.id === player_id);
    }
    removeParty(party: Party): void {
        this.partyList = this.partyList.filter(p => p.id !== party.id);
    }
    generatePlayerId(): string {
        const n = this.generateRandomString(6);
        if (this.findPlayer(n) === undefined) return n;
        else return this.generatePlayerId();
    }
    generatePartyId(): string {
        const n = this.generateRandomString(6);
        if (this.findParty(n) === undefined) return n;
        else return this.generatePartyId();
    }

    run() {
        dotenv.config();
        const app = express();

        app.use(cors());

        const publicDirPath = path.join(__dirname, '../../dist/rhythm-royale/browser');
        app.use(express.static(publicDirPath));

        app.get('*', (req, res) => {
            res.sendFile(path.join(publicDirPath, 'index.html'));
        });

        const server = createServer(app);
        const io = new Server(server, {
            cors: {
                origin: "*",
            }
        });

        io.on('connection', (socket) => {
            let player: Player | undefined;
            let party: Party | undefined;
            //disconnect
            socket.on('disconnect', () => {
                if (player) {
                    console.log(player.name, 'disconnected');
                    this.playerList = this.playerList.filter(p => p.id !== player!.id);
                    if (party) {
                        party.removePlayer(player);
                    }
                    this.disconnectedPlayers.push(player);

                    setTimeout(() => {
                        if (this.disconnectedPlayers.find(p => p.id === player!.id)) {
                            console.log(player!.name, 'did not reconnect in time');
                            this.disconnectedPlayers = this.disconnectedPlayers.filter(p => p.id !== player!.id);
                        }
                    }, 60000); // 60 seconds
                }
            });
            //reconnect
            socket.on('reconnect', (player_id: string, party_id: string) => {
                party = this.findParty(party_id);
                if (party) {
                    player = this.disconnectedPlayers.find(p => p.id === player_id);
                    if (player) {
                        player.socket = socket;
                        player.disconnected = false;
                        party.addPlayer(player);
                        this.playerList.push(player);
                        console.log(player.name, 'reconnected');
                        socket.emit('succesfullReconnect');
                    }
                }
                else {
                    socket.emit('reconnectFailed');
                    console.log(player_id, 'can not reconnect', party_id, 'party not found!');
                }
            });
            socket.on('getToken', () => {
                socket.emit('token', process.env['API_KEY']);
            });
            //hostGame
            socket.on('hostGame', (name: string, pfp: string) => {
                const player_id = this.generatePlayerId();
                player = new Player(player_id, name, pfp, socket);
                player.isLeader = true;
                this.playerList.push(player);
                console.log(player.name, 'connected with id:', player.id);
                const party_id = this.generatePartyId();
                party = new Party(party_id);
                party.addPlayer(player);
                this.partyList.push(party);
                console.log(player.name, 'is hosting a game with id:', party.id);
                socket.emit('startHostingGame', party.id, player.id);
            });
            //joinGame
            socket.on('joinGame', (name: string, pfp: string, party_id: string) => {
                party = this.findParty(party_id);
                if (party) {
                    const player_id = this.generatePlayerId();
                    player = new Player(player_id, name, pfp, socket);
                    this.playerList.push(player);
                    console.log(player.name, 'connected with id:', player.id);
                    party.addPlayer(player);
                    console.log(player.name, 'is joined to party:', party.id);
                    socket.emit('joinSuccess', party.id, player.id);
                }
                else socket.emit('joinFailed');
            });
            //leaveParty
            socket.on('leaveParty', () => {
                party?.removePlayer(player);
                console.log(player?.name, 'left the party:', party?.id);
                party = undefined;
                player = undefined;
                socket.emit('partyLeft');

            });
            //startProposal
            socket.on('startProposal', (settings: Settings) => {
                if (party) {
                    if (!party.gameProposal) {
                        party.gameProposal = { player: player!, settings: settings };
                        player!.accepted = true;
                        if (party.players.length > 1) {
                            party.players.filter(p => p.id !== player!.id).forEach(p => p.socket.emit('incomingProposal', { player: player?.name, settings: settings }));
                            console.log(player!.name, 'wants to play on:', settings.playlist.title);
                            party.sendUpdateParty();
                        }
                        else party.startGame();

                    }
                    else socket.emit('proposalAlready', party.gameProposal.player.name);
                }
            });
            socket.on('acceptProposal', () => {
                if (party?.gameProposal) {
                    if (!player?.accepted) {
                        player!.accepted = true;
                        party.sendUpdateParty();
                        if (party.players.every(p => p.accepted)) party.startGame();
                        console.log(player?.name, 'has accepted the game proposal');
                    }
                }
            });
            socket.on('declineProposal', () => {
                if (party?.gameProposal) {
                    if (!player?.accepted) {
                        party.gameProposal = undefined;
                        party.players.forEach(p => {
                            p.accepted = false;
                        })
                        party.sendUpdateParty();
                        party.players.filter(p => p.id !== player!.id).forEach(p => p.socket.emit('proposalDeclined', player!.name));
                        console.log(player?.name, 'has declined the game proposal');
                    }
                }
            });
            socket.on('answerRight', (points: number) => {
                if (!player?.answered && player?.isAlive()) {
                    console.log(player.name, 'answered right, got points:', points);
                    player.currentPoints = points;
                    player.points += points;
                    player.answered = true;
                    player.streak += 0.1;
                    player.rightRounds++;
                    party?.checkRoundOver();
                }
            });
            socket.on('answerWrong', () => {
                if (!player?.answered && player?.isAlive()) {
                    console.log(player.name, 'answered wrong');
                    player.currentPoints = 0;
                    player.answered = true;
                    player.lives--;
                    player.streak = 1;
                    party?.checkRoundOver();
                }
            });
        });

        const PORT = 3000;
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
}

const server = GameServer.getInstance();
server.run();
