"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServer = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = tslib_1.__importDefault(require("cors"));
const player_1 = require("./player");
class GameServer {
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
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)());
        const publicDirPath = path_1.default.join(__dirname, '../../dist/rhythm-royale/browser');
        app.use(express_1.default.static(publicDirPath));
        app.get('*', (req, res) => {
            res.sendFile(path_1.default.join(publicDirPath, 'index.html'));
        });
        const server = (0, http_1.createServer)(app);
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: "*",
            }
        });
        io.on('connection', (socket) => {
            let player;
            let party;
            socket.on('playerCreated', (name, pfp) => {
                const id = this.generatePartyId();
                player = new player_1.Player(id, name, pfp, socket);
                console.log(player.name, 'connected');
            });
        });
        const PORT = 3000;
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
}
exports.GameServer = GameServer;
const server = GameServer.getInstance();
server.run();
//# sourceMappingURL=server.js.map