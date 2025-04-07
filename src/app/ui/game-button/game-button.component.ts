import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { GameService } from '../../services/game.service';
import { PartyService } from '../../services/party.service';
import { ServerService } from '../../services/server.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'game-button',
  template: `
    <button #button (click)="answer()">{{text}}</button>
  `,
  styleUrls: ['./game-button.component.scss']
})
export class GameButtonComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('button') button!: ElementRef;
  text: string = '';
  @Input({ required: true }) id: number = 0;

  private answeredSubscription: Subscription;
  private timeSubscription: Subscription;

  constructor(
    readonly gameService: GameService,
    readonly party: PartyService,
    private server: ServerService,
    private cdr: ChangeDetectorRef
  ) {
    this.answeredSubscription = this.gameService.answered.subscribe(() => {
      this.updateButton();
    });
    this.timeSubscription = this.gameService.remainingTime.subscribe(() => {
      this.updateButton();
    });
  }

  ngAfterViewInit(): void {
    this.updateButton();
    this.cdr.detectChanges();
    
  }

  ngOnDestroy(): void {
    this.answeredSubscription.unsubscribe();
    this.timeSubscription.unsubscribe();
  }

  answer(): void {
    if(this.party.player!.lives > 0 && this.gameService.remainingTime.getValue() > 0 && !this.gameService.answered.getValue()) {
      (this.gameService.answered as BehaviorSubject<boolean>).next(true);
      if(this.text === this.gameService.rightAnswer) {
        const answerTime = performance.now() - this.gameService.startTime;
        const points = Math.round((this.gameService.maxTime * 1000 - answerTime) * this.party.player!.streak);
        this.server.answerRight(points);
      } else {
        this.server.answerWrong();
      }
    }
  }

  private updateButton() {
    if (!this.button) return;
    this.button.nativeElement.classList.remove('disabled', 'wrong', 'right');
    this.button.nativeElement.removeAttribute('disabled');
    this.text = this.gameService.answers[this.id];
    
    if (this.party.player!.lives === 0) {
      this.button.nativeElement.classList.add('disabled');
      this.button.nativeElement.setAttribute('disabled', 'true');
    }
    
    if (this.gameService.answered.getValue() || this.gameService.remainingTime.getValue() === 0) {
      if (this.text === this.gameService.rightAnswer) {
        this.button.nativeElement.classList.add('right');
      } else {
        this.button.nativeElement.classList.add('wrong');
      }
    }
  }
}
