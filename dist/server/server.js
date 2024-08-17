import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Player } from './player';
export class GameServer {
    constructor() {
        this.generateRandomString = (length) => {
            const possible = '0123456789';
            const values = crypto.getRandomValues(new Uint8Array(length));
            return values.reduce((acc, x) => acc + possible[x % possible.length], "").toString();
        };
        this.playerList = [];
        this.partyList = [];
    }
    static getInstance() {
        if (!GameServer.instance) {
            GameServer.instance = new GameServer();
        }
        return GameServer.instance;
    }
    findPlayer(id) {
        return this.playerList.find(p => p.id == id);
    }
    findParty(id) {
        return this.partyList.find(p => p.id == id);
    }
    generatePlayerId() {
        const n = this.generateRandomString(6);
        if (this.findPlayer(n) === undefined)
            return n;
        else
            return this.generatePlayerId();
    }
    generatePartyId() {
        const n = this.generateRandomString(6);
        if (this.findParty(n) === undefined)
            return n;
        else
            return this.generatePartyId();
    }
    run() {
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
            let player;
            let party;
            socket.on('playerCreated', (name, pfp) => {
                const id = this.generatePartyId();
                player = new Player(id, name, pfp, socket);
                console.log(player.name, 'connected');
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
//# sourceMappingURL=server.js.map