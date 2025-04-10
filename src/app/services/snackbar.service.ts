import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  public show: boolean = false;
  public text: string = ''; 

  copyCode(): void {
    this.text = "Code copied!";
    this.show = true;

    setTimeout(() => {
      this.show = false;
    }, 3000);
  }

  invalidCode(): void {
    this.text = `Invalid join code!`;
    this.show = true;

    setTimeout(() => {
      this.show = false;
    }, 3000);
  }

  notEnoughArtist(): void {
    this.text = "Only available when there are at least 4 different artists in the playlist!";
    this.show = true;

    setTimeout(() => {
      this.show = false;
    }, 3000);
}

  proposalDeclined(player_name: string): void {
    this.text = `${player_name} has declined the game! Pick a new playlist to start!`;
    this.show = true;

    setTimeout(() => {
      this.show = false;
    }, 3000);
  }

  proposalAlready(player_name: string): void {
    this.text = `${player_name} has already selected a playlist!`;
    this.show = true;

    setTimeout(() => {
      this.show = false;
    }, 3000);
  }

  playerKicked(player_name: string): void {
    this.text = `${player_name} was removed from the party!`;
    this.show = true;

    setTimeout(() => {
      this.show = false;
    }, 3000);
  }
}