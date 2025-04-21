import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameService } from '../services/game.service';
import { PartyService } from '../services/party.service';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'rr-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  constructor(
    readonly gameService: GameService,
    readonly party: PartyService,
    private server: ServerService,
  ) {}

  get isLowTime(): boolean {
    const remainingTime = this.gameService.remainingTime.getValue();
    return remainingTime < 6;
  }
  get answered(): boolean {
    return this.gameService.answered.getValue() || this.gameService.remainingTime.getValue() === 0;
  }

  answerButtonClicked(answer: string): void {
    if(this.party.player!.lives > 0 && this.gameService.remainingTime.getValue() > 0 && !this.gameService.answered.getValue()) {
          (this.gameService.answered as BehaviorSubject<boolean>).next(true);
          if(answer === this.gameService.rightAnswer) {
            const answerTime = performance.now() - this.gameService.startTime;
            const points = Math.round((this.gameService.maxTime * 1000 - answerTime) * this.party.player!.streak);
            this.server.answerRight(points);
          } else {
            this.server.answerWrong();
          }
        }
  }
}

