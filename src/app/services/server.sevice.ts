import { Injectable } from '@angular/core';
import { Settings } from '../popups/settings/settings.component';
import { Socket } from 'ngx-socket-io';
import { PartyService } from './party.service';
import { DialogService } from './dialog.service';
import { SnackbarService } from './snackbar.service';
import { GameService } from './game.service';
import { RoutingService } from './routing.service';


@Injectable({
  providedIn: 'root'
})
export class ServerService {
  player_id: string = '';
  party_id: string = '';
  waitingToAccept: boolean = false;

  constructor(
    private router: RoutingService,
    private socket: Socket,
    readonly party: PartyService,
    private dialog: DialogService,
    private snackBar: SnackbarService,
    readonly game: GameService
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
      confirm('Invalid join code!');
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
      confirm('Connection failed!');
    });
    this.socket.on('updateParty', (players: any[]) => {
      this.party.party = players;
    });
    this.socket.on('evalParty', (players: any[]) => {
      this.party.partyEval = players;
      this.game.roundOver();
    });
    this.socket.on('updatePlayer', (player: any) => {
      this.party.player = player;
    });
    this.socket.on('incomingProposal', (proposal: any) => {
      this.dialog.openAcceptDialog(proposal);
    });
    this.socket.on('proposalDeclined', (player_name: string) => {
      this.snackBar.proposalDeclined(player_name);
    });
    this.socket.on('proposalAlready', (player_name: string) => {
      this.snackBar.proposalAlready(player_name);
    });
    this.socket.on('gameStarts', (speed: number, maxRounds: number) => {
      this.game.gameStarts(speed, maxRounds);
    });
    this.socket.on('nextRound', (answers: string[], url: string, currentRound: number) => {
      this.game.nextRound(answers, url, currentRound);
    });
    this.socket.on('countdown', (remainingTime: number) => {
      this.game.remainingTime = remainingTime;
    });
    this.socket.on('gameOver', ()=> {
      this.game.gameOver();
    })
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
}