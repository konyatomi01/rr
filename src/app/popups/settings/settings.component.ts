import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../services/server.sevice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class SettingsComponent implements OnInit {
  @ViewChild('artistModeTooltip') artistModeTooltip!: MatTooltip;

  form!: FormGroup;
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
    private fb: FormBuilder,
    private snackBar: SnackbarService,
    private dialogService: DialogService
  ) {}


  ngOnInit(): void {
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
        this.form = this.fb.group({
          mode: [GameModes.title, Validators.required],
          rounds: [this.half(), Validators.required],
          lives: [3, Validators.required],
          speed: [GameSpeeds.slow, Validators.required]
        })
      },
      (error) => {
        console.error('Error loading playlist tracks:', error);
      }
    );
  }

  half(): number {
    return Math.floor(this.tracks.length / 2);
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
    this.form.get('mode')?.setValue(mode);
    
  }

  isModeSelected(mode: GameModes): boolean {
    return this.selectedMode === mode;
  }

  plusRounds(): void {
    if (this.form && this.form.get('rounds')) {
      const currentRounds = this.form.get('rounds')!.value;
      if (currentRounds + 1 <= this.tracks.length) {
        this.form.get('rounds')!.setValue(currentRounds + 1);
      }
    }
  }

  minusRounds(): void {
    if (this.form && this.form.get('rounds')) {
      let currentRounds = this.form.get('rounds')!.value;
      if (currentRounds - 1 >= 1) {
        this.form.get('rounds')!.setValue(currentRounds - 1);
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
      rounds: this.form.get('rounds')?.value,
      gameMode: this.form.get('mode')?.value,
      speed: this.form.get('speed')?.value,
      health: this.form.get('lives')?.value,
      playlist: playlist
    }
    this.server.startGame(settings);
    this.display = false;
  }
 
}
