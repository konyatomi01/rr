import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { GameService } from '../../services/game.service';
import { PartyService } from '../../services/party.service';
import { ServerService } from '../../services/server.sevice';

@Component({
  selector: 'game-button',
  template: `
    <button (click)="answer()">{{text}}</button>
  `,
  styleUrl: './game-button.component.scss'
})
export class GameButtonComponent {

  @ViewChild('button') button!: ElementRef
  text: string = '';
  @Input() id: number = 0;

  constructor(
    readonly gameService: GameService,
    readonly party: PartyService,
    private server: ServerService
  ) {}

  disable(): void {
    this.button.nativeElement.classList.add('disabled');
    this.button.nativeElement.setAttribute('disabled', 'true');
  }
  right(): void {
    this.button.nativeElement.classList.add('right');
  }
  wrong(): void {
    this.button.nativeElement.classList.add('wrong');
  }
  clear(): void {
    this.button.nativeElement.classList.remove('disabled', 'wrong', 'right');
    this.button.nativeElement.removeAttribute('disabled');
  }

  answer(): void {
    if(this.party.player.lives > 0 && this.gameService.remainingTime > 0 && !this.gameService.answered) {
      this.gameService.answered = true;
      if(this.text === this.gameService.rightAnswer) {
        const answerTime = performance.now() - this.gameService.startTime;
        const points = Math.round((this.gameService.maxTime * 1000 - answerTime) * this.party.player.streak);
        this.server.answerRight(points);
      }
      else this.server.answerWrong();
    }
  }

  private updateButton() {
    this.clear();
    this.text = this.gameService.answers[this.id];
    if (this.party.player.health === 0) {
      this.disable();
    }
    if (this.gameService.answered || this.gameService.remainingTime === 0) {
      if (this.text === this.gameService.rightAnswer) {
        this.button.nativeElement.classList.add('right');
      } else {
        this.button.nativeElement.classList.add('wrong');
      }
    }
  }
}