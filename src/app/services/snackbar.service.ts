import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  copyCode(): void {
    this.snackBar.open(`Code copied!`, undefined,
        {
          duration: 3000,
          verticalPosition: 'bottom'
        }
      );
  }
  notEnoughArtist(): void {
    this.snackBar.open("Only avaiable when there are at least 4 different artist in the playlist!", undefined,
        {
          duration: 3000,
          verticalPosition: 'bottom'
        }
      );
  }
  proposalDeclined(player_name: string): void {
    this.snackBar.open(`${player_name} has declined the game! Pick a new playlist to start!`, undefined,
        {
          duration: 3000,
          verticalPosition: 'bottom'
        }
      );
  }
  proposalAlready(player_name: string): void {
    this.snackBar.open(`${player_name} has already selected a playlist!`, undefined,
        {
          duration: 3000,
          verticalPosition: 'bottom'
        }
      );
  }

}