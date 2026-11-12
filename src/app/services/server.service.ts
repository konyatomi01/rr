import { Injectable, inject, signal } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CustomPlaylistTrack, GameProposalData, PlayerData, Settings } from '../../shared/models';
import { DialogService } from './dialog.service';
import { GameService } from './game.service';
import { PartyService } from './party.service';
import { RoutingService } from './routing.service';
import { SnackbarService } from './snackbar.service';

const PLAYER_ID_KEY = 'player_id';
const PARTY_ID_KEY = 'party_id';

@Injectable({ providedIn: 'root' })
export class ServerService {
  private readonly router = inject(RoutingService);
  private readonly socket = inject(Socket);
  private readonly party = inject(PartyService);
  private readonly dialog = inject(DialogService);
  private readonly snackBar = inject(SnackbarService);
  private readonly game = inject(GameService);

  readonly playerId = signal('');
  readonly partyId = signal('');

  constructor() {
    const storedPlayerId = sessionStorage.getItem(PLAYER_ID_KEY);
    const storedPartyId = sessionStorage.getItem(PARTY_ID_KEY);
    if (storedPlayerId && storedPartyId) {
      this.socket.emit('reconnect', storedPlayerId, storedPartyId);
    }
    this.registerListeners();
  }

  hostGame(name: string, pfp: string): void {
    this.socket.emit('hostGame', name, pfp);
  }
  joinGame(name: string, pfp: string, id: string): void {
    this.socket.emit('joinGame', name, pfp, id);
  }
  leaveParty(): void {
    this.socket.emit('leaveParty');
  }
  startGame(settings: Settings): void {
    this.socket.emit('startProposal', settings);
  }
  acceptProposal(): void {
    this.socket.emit('acceptProposal');
  }
  declineProposal(): void {
    this.socket.emit('declineProposal');
  }
  answerRight(points: number): void {
    this.socket.emit('answerRight', points);
  }
  answerWrong(): void {
    this.socket.emit('answerWrong');
  }
  kickPlayer(playerId: string): void {
    this.socket.emit('kickPlayer', playerId);
  }
  addCustomPlaylistTrack(trackId: string): void {
    this.socket.emit('addCustomPlaylistTrack', trackId);
  }
  removeCustomPlaylistTrack(trackId: string): void {
    this.socket.emit('removeCustomPlaylistTrack', trackId);
  }

  private gameJoined(partyId: string, playerId: string): void {
    this.partyId.set(partyId);
    this.playerId.set(playerId);
    sessionStorage.setItem(PLAYER_ID_KEY, playerId);
    sessionStorage.setItem(PARTY_ID_KEY, partyId);
    this.router.select();
  }

  private clearSession(): void {
    sessionStorage.removeItem(PLAYER_ID_KEY);
    sessionStorage.removeItem(PARTY_ID_KEY);
  }

  private registerListeners(): void {
    this.socket.on('startHostingGame', (partyId: string, playerId: string) => this.gameJoined(partyId, playerId));
    this.socket.on('joinSuccess', (partyId: string, playerId: string) => this.gameJoined(partyId, playerId));
    this.socket.on('joinFailed', () => this.snackBar.message('Invalid join code!'));
    this.socket.on('partyLeft', () => {
      this.clearSession();
      this.router.launch();
    });
    this.socket.on('succesfullReconnect', () => {
      this.playerId.set(sessionStorage.getItem(PLAYER_ID_KEY) ?? '');
      this.partyId.set(sessionStorage.getItem(PARTY_ID_KEY) ?? '');
    });
    this.socket.on('reconnectFailed', () => {
      this.clearSession();
      this.router.launch();
      this.dialog.openConnectionLostDialog();
    });
    this.socket.on('updateParty', (players: PlayerData[]) => this.party.party.set(players));
    this.socket.on('evalParty', (players: PlayerData[]) => {
      this.party.party.set(players);
      this.game.roundOver();
    });
    this.socket.on('updatePlayer', (player: PlayerData) => this.party.player.set(player));
    this.socket.on('incomingProposal', (proposal: GameProposalData) => this.dialog.openAcceptDialog(proposal));
    this.socket.on('proposalDeclined', (playerName: string) =>
      this.snackBar.message(`${playerName} has declined the game! Pick a new playlist to start!`),
    );
    this.socket.on('proposalAlready', (playerName: string) =>
      this.snackBar.message(`${playerName} has already selected a playlist!`),
    );
    this.socket.on('gameStarts', (speed: number, maxRounds: number, vibeMode: boolean) =>
      this.game.gameStarts(speed, maxRounds, vibeMode),
    );
    this.socket.on('nextRound', (answers: string[], url: string, currentRound: number) =>
      this.game.nextRound(answers, url, currentRound),
    );
    this.socket.on('countdown', (remainingTime: number) => this.game.remainingTime.set(remainingTime));
    this.socket.on('gameOver', () => this.game.gameOver());
    this.socket.on('startFailed', (message: string) => this.snackBar.message(message));
    this.socket.on('playerKicked', (name: string) => this.snackBar.message(`${name} was removed from the party!`));
    this.socket.on('getKicked', () => this.router.launch());
    this.socket.on('updateCustomPlaylist', (songs: CustomPlaylistTrack[]) => this.party.setCustomPlaylist(songs));
    this.socket.on('addSongSucess', (song: CustomPlaylistTrack) =>
      this.snackBar.message(`${song.title} by ${song.artist} was added to the playlist!`),
    );
    this.socket.on('addSongFailed', (error: string) => this.snackBar.message(error));
  }
}
