import { Injectable } from '@angular/core';
import { PartyService } from './party.service';
import { RoutingService } from './routing.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
    constructor(
        readonly party: PartyService,
        private router: RoutingService,
    ) {}

    private audio: HTMLAudioElement | null = null;
    maxTime: number = 0;
    currentRound: number = 0;
    maxRounds: number = 0;
    remainingTime = 6;
    rightAnswer: string = '';
    answers: string[] = [];
    answered: boolean = false;
    startTime: number = Date.now();
    showCountDown: boolean = true;
    url: string = '';

    gameStarts(speed: number, maxRounds: number) {
        this.maxTime = speed;
        this.currentRound = 0;
        this.maxRounds = maxRounds;
        this.remainingTime = this.maxTime;
        this.showCountDown = true;
        this.router.game();

    }
    nextRound(answers: string[], url: string, currentRound: number) {
        this.remainingTime = this.maxTime;
        this.audio?.pause();
        this.showCountDown = false;
        this.currentRound = currentRound;
        this.rightAnswer = answers[0];
        this.answers = this.shuffleAnswers(answers);
        this.answered = false;
        this.router.game();
        this.audio = new Audio(url);
        this.audio.play();
        this.startTime = performance.now();
    }

    roundOver() {
        this.router.roundover();
        this.audio?.pause();
    }

    shuffleAnswers<T>(array: T[]): T[] {
        const shuffledArray = array.slice();
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
    
        return shuffledArray;
    }
    gameOver() {
        this.audio?.pause();
        this.router.gameover();
    }

}