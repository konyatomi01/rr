import { Injectable } from '@angular/core';
import { PartyService } from './party.service';
import { RoutingService } from './routing.service';
import { BehaviorSubject } from 'rxjs';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
    constructor(
        readonly party: PartyService,
        private router: RoutingService,
        readonly dialog: DialogService
    ) {
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    private audio: HTMLAudioElement = new Audio();
    maxTime: number = 0;
    currentRound: number = 0;
    maxRounds: number = 0;
    rightAnswer: string = '';
    answers: string[] = [];
    startTime: number = Date.now();
    showCountDown: boolean = true;
    url: string = '';
    vibeMode: boolean = false;

    answered: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    remainingTime = new BehaviorSubject<number>(6);

    private handleVisibilityChange() {
        if (document.visibilityState === 'visible' && this.url) {
            this.preloadAudio(this.url);
        }
    }

    preloadAudio(url: string) {
        this.audio.src = url;
        this.audio.preload = 'auto';
        this.audio.load();
        this.audio.oncanplaythrough = () => {
            console.log('Audio preloaded successfully');
        };
        this.audio.onerror = (error) => {
            console.error('Error preloading audio:', error);
        };
    }

    gameStarts(speed: number, maxRounds: number, vibeMode: boolean) {
        this.dialog.closeAllDialogs();
        this.vibeMode = vibeMode;
        this.maxTime = speed;
        this.currentRound = 0;
        this.maxRounds = maxRounds;
        this.remainingTime.next(this.maxTime);
        this.showCountDown = true;
        this.router.game();
    }

    nextRound(answers: string[], url: string, currentRound: number) {
        this.remainingTime.next(this.maxTime);
        this.audio.pause();
        this.showCountDown = false;
        this.currentRound = currentRound;
        this.rightAnswer = answers[0];
        this.answers = this.shuffleAnswers(answers);
        this.answered.next(false);
        this.router.game();

        this.url = url;
        this.audio.src = url;
        this.audio.preload = 'auto';

        this.audio.play().catch(error => {
            console.error('Audio playback failed:', error);
        });

        this.startTime = performance.now();
    }

    roundOver() {
        this.router.roundover();
        this.audio.pause();
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
        this.audio.pause();
        this.router.gameover();
    }
}
