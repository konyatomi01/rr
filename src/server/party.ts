import { Playlist, Settings, Track } from "../app/popups/settings/settings.component"
import { Player } from "./player"
import { GameServer } from "./server"
import { popRandomElement } from "./util"

export interface GameProposal {
  player: Player,
  settings: Settings,
}

export class Party {
    id: string
    players: Player[] = []
    playlist: Playlist = { title: '', cover: '', tracks: []}
    answers: string[] = []
    gameMode: 'artist' | 'title' = 'title'
    maxRounds: number = 10
    maxLives: number = 3
    speed: number = 30
    currentRound: number = 0
    currentSong: Track = { url: '', title: '', artist: '' }
    gameProposal: GameProposal | undefined
    private removalTimer: NodeJS.Timeout | null = null
    private timer: any;
    remainingTime: number = 0;

    constructor(_id: string) {
        this.id = _id;
    }

    addPlayer(player: Player) {
        this.players.push(player);
        this.sendUpdateParty();

        if (this.removalTimer) {
            clearTimeout(this.removalTimer);
            this.removalTimer = null;
        }
    }

    removePlayer(player: Player) {
        this.players = this.players.filter(p => p.id !== player.id);
        if (this.players.length > 0) {
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

    sendUpdateParty() {
        this.players = this.players.sort((a, b) => b.points - a.points);
        this.players.forEach(p => {
            p.socket.emit('updateParty', 
                this.players.map(player => ({
                    name: player.name,
                    pfp: player.pfp,
                    lives: player.lives,
                    points: player.points,
                    accepted: player.accepted,
                    rightRounds: player.rightRounds
                }))
            );
        p.sendUpdatePlayer();
    });
  }

  startGame() {
    this.currentRound = 0;
    this.maxLives = this.gameProposal?.settings.health!;
    this.speed = this.gameProposal?.settings.speed!;
    this.gameMode = this.gameProposal?.settings.gameMode!;
    this.maxRounds = this.gameProposal?.settings.rounds!;
    this.playlist = this.gameProposal?.settings.playlist!;
    this.gameProposal = undefined;
    if(this.gameMode === 'artist') this.answers = Array.from(new Set(this.playlist.tracks.map(song => song.artist)));
    else this.answers = Array.from(new Set(this.playlist.tracks.map(song => song.title)));
    
    this.players.forEach(p => {
        p.reset(this.maxLives);
        p.socket.emit('gameStarts', this.speed, this.maxRounds);
        p.sendUpdatePlayer();
    });
    this.sendUpdateParty();
    this.countdown(3);
    console.log(this.id, 'game starts with settings: \n', 
        this.maxLives, 'lives\n', this.speed, 'speed\n', 
        this.maxRounds, 'rounds\n', this.gameMode, 'gamemode\n');
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
    
    this.currentSong = popRandomElement(this.playlist.tracks);
    let answers: string[] = [];
    if(this.gameMode === 'artist') {
        const wrongAnswers = this.getWrongAnswers(this.currentSong.artist);
        answers = [this.currentSong.artist, ...wrongAnswers];
    }
    else {
        const wrongAnswers = this.getWrongAnswers(this.currentSong.title);
        answers = [this.currentSong.title, ...wrongAnswers];
    }
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

  getWrongAnswers(exclude: string): string[] {
    const filteredArray = this.answers.filter(item => item !== exclude);
    for (let i = filteredArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredArray[i], filteredArray[j]] = [filteredArray[j], filteredArray[i]];
    }
    return filteredArray.slice(0, 3);
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
        this.sendRoundEval();
    }, 3000);
    }
  }
  checkRoundOver() {
    if(this.players.filter(p => p.isAlive() && !p.answered).length === 0) this.stopTimer();
  }

  sendRoundEval() {
    console.log(this.id, this.currentRound, '.round is over');
    this.players.forEach(p => {
      p.socket.emit('evalParty', 
          this.players.map(player => ({
              name: player.name,
              pfp: player.pfp,
              points: player.currentPoints
          }))
      );
    });
    setTimeout(() => {
      this.nextRound();
  }, 3000);
    
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
  
}
