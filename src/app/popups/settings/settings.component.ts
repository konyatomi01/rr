import { Component, ViewChild } from '@angular/core';
import { ServerService } from '../../services/server.sevice';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SpotifyService } from '../../services/spotify.service';
import { MatTooltip } from '@angular/material/tooltip';
import { SnackbarService } from '../../services/snackbar.service';
import { Subscription } from 'rxjs';
import { DialogService } from '../../services/dialog.service';

interface AnyObject {
  [key: string]: any;
}

export enum GameModes {
  title = 'title',
  artist = 'artist'
}
export enum GameSpeeds {
  slow = 30,
  normal = 10,
  fast = 5
}
export interface Playlist {
  title: string,
  cover: string,
  tracks: any[]
}
export interface Track {
  url: string,
  title: string,
  artist: string
}

export interface Settings {
  rounds: number,
  gameMode: GameModes,
  speed: GameSpeeds,
  health: number,
  playlist: Playlist

}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  @ViewChild('artistModeTooltip') artistModeTooltip!: MatTooltip;

  form = new FormGroup({
    rounds: new FormControl<number>(3, [Validators.required, Validators.min(1), Validators.max(30)]),
    mode: new FormControl<GameModes>(GameModes.title, Validators.required),
    speed: new FormControl<GameSpeeds>(GameSpeeds.slow, Validators.required),
    lives: new FormControl<number>(3, Validators.required),
  });
  tracks: Track[] = [];
  enoughArtist: boolean = true;
  selectedMode: GameModes = GameModes.title;
  selectedSpeed: GameSpeeds = GameSpeeds.slow;
  lives: number = 3;
  data: any;
  display: boolean = false;
  dialogSubscription: Subscription | null = null;

  constructor(
    readonly server: ServerService,
    readonly spotify: SpotifyService,
    private snackBar: SnackbarService,
    private dialogService: DialogService
  ) {
    this.dialogSubscription = this.dialogService.settingsState$.subscribe((state) => {
      this.display = state.visible;
      if(state.data) {
        this.data = state.data;
        this.loadData(this.data.id);
      }
    });
  }

  loadData(playlistId: string) {
    this.spotify.getTracksFromPlaylist(playlistId).subscribe(
      (tracks: any[]) => {
        this.tracks = tracks.filter((item: any) => item.preview_url !== null)
        .map(item => ({
          url: item.preview_url,
          title: item.name,
          artist: item.artists[0].name
        }));
        this.enoughArtist = (this.countDistinctPropertyValues(this.tracks, "artist") > 3)
      },
      (error) => {
        console.error('Error loading playlist tracks:', error);
      }
    );
  }

countDistinctPropertyValues(arr: AnyObject[], propertyName: string): number {
    const distinctValues = new Set<any>();

    arr.forEach(obj => {
        distinctValues.add(obj[propertyName]);
    });

    return distinctValues.size;
  }

  public gameModes = GameModes;

  setMode(mode: GameModes): void {
    if(mode === GameModes.artist && !this.enoughArtist) {
      this.snackBar.notEnoughArtist();
      this.selectedMode = GameModes.title
    }
    else this.selectedMode = mode;
    this.form.controls.mode.setValue(mode);
    
  }

  isModeSelected(mode: GameModes): boolean {
    return this.selectedMode === mode;
  }

  plusRounds(): void {
    if (this.form && this.form.controls.rounds.value) {
      if (this.form.controls.rounds.value + 1 <= this.tracks.length) {
        this.form.controls.rounds.setValue(this.form.controls.rounds.value + 1);
      }
    }
  }

  minusRounds(): void {
    if (this.form && this.form.controls.rounds.value) {
      if (this.form.controls.rounds.value - 1 >= 1) {
        this.form.controls.rounds.setValue(this.form.controls.rounds.value - 1);
      }
    }
  }

  public gameSpeeds = GameSpeeds;

  setSpeed(speed: GameSpeeds): void {
    this.selectedSpeed = speed;
    this.form.get('speed')?.setValue(speed);
    
    if (this.artistModeTooltip) {
      this.artistModeTooltip.hide();
    }
  }

  isSpeedSelected(speed: GameSpeeds): boolean {
    return this.selectedSpeed === speed;
  }

  setLives(value: number): void {
    this.lives = value;
    this.form.get('lives')?.setValue(value);
  }


  start(): void {
    const playlist: Playlist = { 
      title: this.data.name,
      cover: this.data.images[0].url,
      tracks: this.tracks };

    const settings: Settings = { 
      rounds: this.form.controls.rounds.value!,
      gameMode: this.form.controls.mode.value!,
      speed: this.form.controls.speed.value!,
      health: this.form.controls.lives.value!,
      playlist: playlist
    }
    this.server.startGame(settings);
    this.close();
  }

  close(): void {
    this.display = false;
    this.data = undefined;
  }
 
}
