import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
    constructor() {
        this.getState();
    }

    state: string = 'launch'

    launch() {
        this.state = 'launch';
        this.saveState();
    }
    select() {
        this.state = 'select';
        this.saveState();
    }
    game() {
        this.state = 'game';
        this.saveState();
    }
    gameover() {
        this.state = 'gameover';
        this.saveState();
    }
    roundover() {
        this.state = 'roundover';
        this.saveState();
    }

    saveState() {
        sessionStorage.setItem('routerState', this.state);
    }
    getState() {
        if(sessionStorage.getItem('routerState')) this.state = sessionStorage.getItem('routerState')!
    }



}