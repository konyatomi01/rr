import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { GameService } from '../services/game.service';
import { PartyService } from '../services/party.service';
import { ServerService } from '../services/server.sevice';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  @ViewChildren('answerButton', { read: ElementRef }) answerButtons!: QueryList<ElementRef>;

  constructor(
    readonly gameService: GameService,
    readonly party: PartyService,
    private server: ServerService
  ) {}

  ngAfterViewInit() {
    this.updateButtonClasses();
  }

  answer(event: Event): void {
    const button = event.target as HTMLButtonElement;
    if(this.party.player.lives > 0 && this.gameService.remainingTime > 0 && !this.gameService.answered) {
      this.gameService.answered = true;
      if(button.innerText === this.gameService.rightAnswer) {
        const answerTime = performance.now() - this.gameService.startTime;
        const points = Math.round((this.gameService.maxTime * 1000 - answerTime) * this.party.player.streak);
        this.server.answerRight(points);
      }
      else this.server.answerWrong();
    }
    this.updateButtonClasses();

  }
  buttonColor(): boolean {
    return this.gameService.answered || this.gameService.remainingTime === 0;
  }

  private updateButtonClasses() {
    this.answerButtons.forEach(button => {
      if (this.party.player.health === 0) {
        button.nativeElement.classList.add('disabled');
        button.nativeElement.setAttribute('disabled', 'true');
      } else {
        button.nativeElement.classList.remove('disabled');
        button.nativeElement.removeAttribute('disabled');
      }
      if (this.buttonColor()) {
        if (button.nativeElement.innerText === this.gameService.rightAnswer) {
          button.nativeElement.classList.add('right');
          button.nativeElement.classList.remove('wrong');
        } else {
          button.nativeElement.classList.add('wrong');
          button.nativeElement.classList.remove('right');
        }
      } else {
        button.nativeElement.classList.remove('right', 'wrong');
      }
    });
  }
}

