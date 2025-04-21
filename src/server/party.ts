import { PlaylistToPlay, Settings, Track } from "../app/popups/settings/settings.component"
import { CustomPlaylistTrack } from "../app/services/party.service";
import { Player } from "./player"
import { GameServer } from "./server"

export interface GameProposal {
  player: Player,
  settings: Settings,
}

export class Party {
    id: string
    players: Player[] = [];
    playlist: PlaylistToPlay = { title: '', cover: '', tracks: []};
    answers: string[] = [];
    gameMode: 'artist' | 'title' = 'title';
    maxRounds: number = 10;
    maxLives: number = 3;
    speed: number = 30;
    vibeMode: boolean = false;
    currentRound: number = 0;
    currentSong: Track = { url: '', title: '', artist: '' };
    gameProposal: GameProposal | undefined;
    private removalTimer: NodeJS.Timeout | null = null;
    private timer: any;
    remainingTime: number = 0;
    customPlaylist: CustomPlaylistTrack[] = [];

    constructor(_id: string) {
        this.id = _id;
    }

    addPlayer(player: Player) {
        this.players.push(player);
        player.socket.emit('updateCustomPlaylist', this.customPlaylist);
        if (this.players.filter(p => p.isLeader).length === 0) {
            this.players[0].isLeader = true;
        }
        this.sendUpdateParty();

        if (this.removalTimer) {
            clearTimeout(this.removalTimer);
            this.removalTimer = null;
        }
    }

    removePlayer(player?: Player) {
        if (!player) return;
        player.isLeader = false;
        this.players = this.players.filter(p => p.id !== player.id);
        if (this.players.length && this.players.filter(p => p.isLeader).length === 0) {
          this.players[0].isLeader = true;
          console.log(`${this.players[0].name} is now the leader of: ${this.id}`);
        }
        if (this.players.length) {
            this.sendUpdateParty();
        } else {

            this.removalTimer = setTimeout(() => {
                GameServer.getInstance().removeParty(this);
                console.log(`Party ${this.id} removed due to no players`);
            }, 60000);
        }
    }

    findPlayerById(id: string): Player | undefined {
        return this.players.find(p => p.id === id);
    } 

    sendUpdateParty(isEval: boolean = false) {
        this.players = this.players.sort((a, b) => b.points - a.points);
        this.players.forEach(p => {
            p.socket.emit(isEval ? 'evalParty' : 'updateParty', 
                this.players.map(player => player.playerData),
            );
        p.socket.emit('updatePlayer', p.playerData);
    });
  }

  startGame() {
    this.currentRound = 0;
    if (this.gameProposal) {
      this.maxLives = this.gameProposal.settings.health;
      this.speed = this.gameProposal.settings.speed;
      this.gameMode = this.gameProposal.settings.gameMode;
      this.maxRounds = this.gameProposal.settings.rounds;
      this.playlist = this.gameProposal.settings.playlist;
      this.vibeMode = this.gameProposal.settings.vibeMode;
    }
    this.gameProposal = undefined;
    if(this.gameMode === 'artist') this.answers = Array.from(new Set(this.playlist.tracks.map(song => song.artist)));
    else this.answers = Array.from(new Set(this.playlist.tracks.map(song => song.title)));
    
    this.players.forEach(p => {
        p.reset(this.maxLives);
        p.socket.emit('gameStarts', this.speed, this.maxRounds, this.vibeMode);
        p.socket.emit('updatePlayer', p.playerData);
    });
    this.sendUpdateParty();
    this.countdown(3);
    console.log(this.id, 'game starts with settings: \n', 
        this.maxLives, 'lives\n', this.speed, 'speed\n', 
        this.maxRounds, 'rounds\n', this.gameMode, 'gamemode\n', 'on:', this.playlist.title);
    if (this.vibeMode) console.log('with vibe mode');   
  }

  nextRound() {
    this.currentRound++;
    if(this.currentRound > this.maxRounds) {
      this.gameOver();
      return;
    }
    if(this.players.length > 1 && this.players.filter(p => p.isAlive()).length === 1) {
      this.gameOver();
      return;
    }
    if(this.players.length === 1 && this.players.filter(p => p.isAlive()).length === 0) {
      this.gameOver();
      return;
    }
    if(this.players.length === 0) {
      this.gameOver();
      return;
    }
    this.sendUpdateParty();
    this.remainingTime = this.speed;
    
    const idx = Math.floor(Math.random() * this.playlist.tracks.length);
    this.currentSong = this.playlist.tracks.splice(idx, 1)[0];
    if(!this.currentSong) {
      this.gameOver();
      return;
    }

    const answers = this.getAnswers();
    this.players.forEach(player=>{
      player.currentPoints = 0;
      player.answered = false;
      player.socket.emit('nextRound', answers, this.currentSong.url, this.currentRound);
      
    });
    this.startTimer();

  }

  gameOver() {
    console.log(this.id, 'game is over');
    this.sendUpdateParty();
    this.players.forEach(p => p.socket.emit('gameOver'));

  }

  getAnswers(): string[] {
    const filteredArray = this.answers.filter(item => item !== this.currentSong[this.gameMode]);
    for (let i = filteredArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredArray[i], filteredArray[j]] = [filteredArray[j], filteredArray[i]];
    }
    const wrongAnswers = filteredArray.slice(0, 3);
    return [this.currentSong[this.gameMode], ...wrongAnswers];
}

startTimer() {
    this.timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.players.forEach(p => p.socket.emit('countdown', this.remainingTime));
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.players.filter(p => p.isAlive() && !p.answered).forEach(p => {
        p.lives--;
        p.currentPoints = 0;
        p.streak = 1;
      });
      setTimeout(() => {
        setTimeout(() => {
          this.sendUpdateParty(true);
          setTimeout(() => {
            this.nextRound();
        }, 3000);
      }, 3000);
      }, this.vibeMode ? ((27 - this.speed + this.remainingTime) * 1000) : 0);
    }
  }
  checkRoundOver() {
    if(this.players.filter(p => p.isAlive() && !p.answered).length === 0) this.stopTimer();
  }

  countdown(number: number) {
    if (number >= 0) {
      this.players.forEach(p => p.socket.emit('countdown', number));
      setTimeout(() => {
        this.countdown(number - 1);
      }, 1000);
    } else {
      this.nextRound();
    }
  } 

  kickPlayer(id: string): boolean {
    const player = this.findPlayerById(id);
    if (player) {
      this.players.forEach(p => {
        p.socket.emit('playerKicked', player.name);
      });
      this.sendUpdateParty();
      player.socket.emit('getKicked');
      this.removePlayer(player);
      return true
    }
    return false;
  }

  addCustomTrack(track: CustomPlaylistTrack): true | string {
    if (this.customPlaylist.find(t => t.url === track.url)) {
      return `${track.title} by ${track.artist} is already in the playlist!`;
    }
    if (this.customPlaylist.length >= 30) {
      return `The playlist is full!`;
    }
    this.customPlaylist.push(track);
    this.players.forEach(p => p.socket.emit('updateCustomPlaylist', this.customPlaylist));
    return true;
  }
  
  removeCustomTrack(track: CustomPlaylistTrack) {
    this.customPlaylist = this.customPlaylist.filter(t => t.url !== track.url);
    this.players.forEach(p => p.socket.emit('updateCustomPlaylist', this.customPlaylist));
  }
}
