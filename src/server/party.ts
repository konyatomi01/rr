import { CustomPlaylistTrack, MIN_PLAYLIST_TRACKS, PlaylistRef, Settings, Track } from '../shared/models';
import { isDeezerId } from '../shared/deezer';
import { getPlaylistTracks, getTrack } from './deezer';
import { Player } from "./player"
import { GameServer } from "./server"

export interface GameProposal {
  player: Player,
  settings: Settings,
}

const MAX_CUSTOM_TRACKS = 30;
/** Consecutive preview lookups that may fail before the game is ended. */
const MAX_PREVIEW_FAILURES = 3;

export class Party {
    id: string
    players: Player[] = [];
    playlistTitle: string = '';
    /** Tracks not played yet in the current game. */
    tracks: Track[] = [];
    answers: string[] = [];
    gameMode: 'artist' | 'title' = 'title';
    maxRounds: number = 10;
    maxLives: number = 3;
    speed: number = 30;
    vibeMode: boolean = false;
    currentRound: number = 0;
    currentSong: Track = { id: '', title: '', artist: '', cover: '' };
    gameProposal: GameProposal | undefined;
    /** Bumped when a game starts or ends, so async work from an older game can tell it is stale. */
    private gameId = 0;
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

  /**
   * Loads the proposed playlist's tracks from Deezer and starts the game. The proposal stays set
   * while loading, so nobody can propose another game in the meantime.
   */
  async startGame() {
    const proposal = this.gameProposal;
    if (!proposal) return;
    const settings = proposal.settings;

    let tracks: Track[];
    try {
      tracks = await this.loadTracks(settings.playlist);
    } catch (e) {
      console.error(this.id, 'could not load playlist', settings.playlist, e);
      this.cancelProposal('Could not load the playlist. Try again or pick another one!');
      return;
    }
    if (this.gameProposal !== proposal) return;
    if (tracks.length < MIN_PLAYLIST_TRACKS) {
      this.cancelProposal('This playlist does not have enough playable tracks!');
      return;
    }

    this.gameId++;
    this.currentRound = 0;
    this.maxLives = settings.health;
    this.speed = settings.speed;
    this.gameMode = settings.gameMode;
    this.maxRounds = settings.rounds;
    this.vibeMode = settings.vibeMode;
    this.playlistTitle = settings.playlist.title;
    this.tracks = tracks;
    this.gameProposal = undefined;
    this.answers = Array.from(new Set(tracks.map(song => song[this.gameMode])));

    this.players.forEach(p => {
        p.reset(this.maxLives);
        p.socket.emit('gameStarts', this.speed, this.maxRounds, this.vibeMode);
        p.socket.emit('updatePlayer', p.playerData);
    });
    this.sendUpdateParty();
    this.countdown(3);
    console.log(this.id, 'game starts with settings: \n', 
        this.maxLives, 'lives\n', this.speed, 'speed\n', 
        this.maxRounds, 'rounds\n', this.gameMode, 'gamemode\n', 'on:', this.playlistTitle);
    if (this.vibeMode) console.log('with vibe mode');
  }

  private async loadTracks(ref: PlaylistRef): Promise<Track[]> {
    if (ref.source === 'custom') {
      return this.customPlaylist.map(({ id, title, artist, cover }) => ({ id, title, artist, cover }));
    }
    if (!isDeezerId(ref.id)) throw new Error(`Invalid playlist id: ${ref.id}`);
    // Copy: the cached array is shared, and rounds splice played tracks out of it.
    return [...await getPlaylistTracks(ref.id)];
  }

  private cancelProposal(message: string) {
    this.gameProposal = undefined;
    this.players.forEach(p => {
      p.accepted = false;
      p.socket.emit('startFailed', message);
    });
    this.sendUpdateParty();
  }

  /** Removes random tracks from the pool until one has a playable preview, with a fresh URL. */
  private async nextPlayableTrack(): Promise<{ track: Track; preview: string } | undefined> {
    let failures = 0;
    while (this.tracks.length && failures < MAX_PREVIEW_FAILURES) {
      const idx = Math.floor(Math.random() * this.tracks.length);
      const [track] = this.tracks.splice(idx, 1);
      try {
        const playable = await getTrack(track.id);
        if (playable) return { track, preview: playable.preview };
        console.log(this.id, 'skipping unplayable track', track.id, track.title);
      } catch (e) {
        failures++;
        console.error(this.id, 'preview lookup failed for', track.id, e);
      }
    }
    return undefined;
  }

  async nextRound() {
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

    const gameId = this.gameId;
    const next = await this.nextPlayableTrack();
    if (gameId !== this.gameId) return; // the game ended or restarted while we were waiting
    if (!next) {
      this.gameOver();
      return;
    }
    this.currentSong = next.track;

    const answers = this.getAnswers();
    this.players.forEach(player=>{
      player.currentPoints = 0;
      player.answered = false;
      player.socket.emit('nextRound', answers, next.preview, this.currentRound);

    });
    this.startTimer();

  }

  gameOver() {
    this.gameId++;
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
    if (this.customPlaylist.find(t => t.id === track.id)) {
      return `${track.title} by ${track.artist} is already in the playlist!`;
    }
    if (this.customPlaylist.length >= MAX_CUSTOM_TRACKS) {
      return `The playlist is full!`;
    }
    this.customPlaylist.push(track);
    this.players.forEach(p => p.socket.emit('updateCustomPlaylist', this.customPlaylist));
    return true;
  }
  
  removeCustomTrack(trackId: string) {
    this.customPlaylist = this.customPlaylist.filter(t => t.id !== trackId);
    this.players.forEach(p => p.socket.emit('updateCustomPlaylist', this.customPlaylist));
  }
}
