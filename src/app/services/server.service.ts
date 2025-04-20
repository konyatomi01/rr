import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AcceptDialogData } from '../popups/accept/accept.component';
import { Settings } from '../popups/settings/settings.component';
import { DialogService } from './dialog.service';
import { GameService } from './game.service';
import { CustomPlaylistTrack, PartyService, PlayerData } from './party.service';
import { RoutingService } from './routing.service';
import { SnackbarService } from './snackbar.service';


@Injectable({
  providedIn: 'root'
})
export class ServerService {
  player_id: string = '';
  party_id: string = '';

  constructor(
    private router: RoutingService,
    private socket: Socket,
    readonly party: PartyService,
    private dialog: DialogService,
    private snackBar: SnackbarService,
    readonly game: GameService,
  ) {
    if(sessionStorage.getItem('player_id') && sessionStorage.getItem('party_id')) {
      this.socket.emit('reconnect', sessionStorage.getItem('player_id'), sessionStorage.getItem('party_id'));
    }
    
    this.socket.on('startHostingGame', (party_id: string, player_id: string) => {
      this.gameJoined(party_id, player_id);
    });
    this.socket.on('joinSuccess', (party_id: string, player_id: string) => {
      this.gameJoined(party_id, player_id);
    });
    this.socket.on('joinFailed', () => {
      this.snackBar.message("Invalid join code!");
    });
    this.socket.on('partyLeft', () => {
      sessionStorage.removeItem('player_id');
      sessionStorage.removeItem('party_id');
      this.router.launch();
    });
    this.socket.on('succesfullReconnect', () => {
      this.player_id = sessionStorage.getItem('player_id')!;
      this.party_id = sessionStorage.getItem('party_id')!;
    });
    this.socket.on('reconnectFailed', () => {
      sessionStorage.removeItem('player_id');
      sessionStorage.removeItem('party_id');
      this.router.launch();
      this.dialog.openConnectionLostDialog();
    });
    this.socket.on('updateParty', (players: PlayerData[]) => {
      this.party.party = players;
    });
    this.socket.on('evalParty', (players: PlayerData[]) => {
      this.party.party = players;
      this.game.roundOver();
    });
    this.socket.on('updatePlayer', (player: PlayerData) => {
      this.party.player = player;
    });
    this.socket.on('incomingProposal', (proposal: AcceptDialogData) => {
      this.dialog.openAcceptDialog(proposal);
    });
    this.socket.on('proposalDeclined', (player_name: string) => {
      this.snackBar.message(`${player_name} has declined the game! Pick a new playlist to start!`);
    });
    this.socket.on('proposalAlready', (player_name: string) => {
      this.snackBar.message(`${player_name} has already selected a playlist!`);
    });
    this.socket.on('gameStarts', (speed: number, maxRounds: number, vibeMode: boolean) => {
      this.game.gameStarts(speed, maxRounds, vibeMode);
    });
    this.socket.on('nextRound', (answers: string[], url: string, currentRound: number) => {
      this.game.nextRound(answers, url, currentRound);
    });
    this.socket.on('countdown', (remainingTime: number) => {
      this.game.remainingTime.next(remainingTime);
    });
    this.socket.on('gameOver', ()=> {
      this.game.gameOver();
    });
    this.socket.on('token', (token: string) => {
      sessionStorage.setItem('token', token);
    });
    this.socket.on('playerKicked', (name: string) => {
      this.snackBar.message(`${name} was removed from the party!`);
    });
    this.socket.on('getKicked', () => {
      this.router.launch();
    });
    this.socket.on('updateCustomPlaylist', (songs: CustomPlaylistTrack[]) => {
      sessionStorage.setItem('customPlaylist', JSON.stringify(songs));
      this.party.customPlaylist = songs;
    });
    this.socket.on('addSongSucess', (song: CustomPlaylistTrack) => {
      this.snackBar.message(`${song.title} by ${song.artist} was added to the playlist!`);
    });
    this.socket.on('addSongFailed', (error: string) => {
      this.snackBar.message(error);
    });
    this.socket.emit('getToken');
   }

  hostGame(name: string, pfp: string) {
    this.socket.emit('hostGame', name, pfp);
  }
  joinGame(name: string, pfp: string, id: string) {
    this.socket.emit('joinGame', name, pfp, id);
  }
  gameJoined(party_id: string, player_id: string) {
    this.party_id = party_id;
    this.player_id = player_id;
    sessionStorage.setItem('player_id', this.player_id);
    sessionStorage.setItem('party_id', this.party_id);
    this.router.select();
  }
  leaveParty() {
    this.socket.emit('leaveParty');
  }
  startGame(settings: Settings) {
    this.socket.emit('startProposal', settings);
  }
  acceptProposal() {
    this.socket.emit('acceptProposal');
  }
  declineProposal() {
    this.socket.emit('declineProposal');
  }
  answerRight(points: number) {
    this.socket.emit('answerRight', points);
  }
  answerWrong() {
    this.socket.emit('answerWrong');
  }
  kickPlayer(player_id: string) {
    this.socket.emit('kickPlayer', player_id);
  }
  addCustomPlaylistTrack(track: CustomPlaylistTrack) {
    this.socket.emit('addCustomPlaylistTrack', track);
  }
  removeCustomPlaylistTrack(track: CustomPlaylistTrack) {
    this.socket.emit('removeCustomPlaylistTrack', track);
  }
}