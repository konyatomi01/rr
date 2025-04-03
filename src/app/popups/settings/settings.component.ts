import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MusicService, Playlist } from '../../services/music.service';
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
export interface PlaylistToPlay {
  title: string,
  cover: string,
  tracks: Track[]
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
  playlist: PlaylistToPlay

}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnDestroy {

  form = new FormGroup({
    rounds: new FormControl<number>(3, [Validators.required, Validators.min(1), Validators.max(30)]),
    mode: new FormControl<GameModes>(GameModes.title, Validators.required),
    speed: new FormControl<GameSpeeds>(GameSpeeds.slow, Validators.required),
    lives: new FormControl<number>(3, Validators.required),
  });
  tracks: Track[] = [];
  data?: Playlist;
  display: boolean = false;
  dialogSubscription?: Subscription;

  constructor(
    readonly server: ServerService,
    readonly music: MusicService,
    private snackBar: SnackbarService,
    private dialogService: DialogService
  ) {
    this.dialogSubscription = this.dialogService.settingsState$.subscribe(async state => {
      this.display = state.visible;
      if(state.data) {
        this.data = state.data;
        this.tracks = await this.music.getTracksFromPlaylist(this.data.id);
      }
    });
  }

  get enoughArtist(): boolean {
    return this.countDistinctPropertyValues(this.tracks, "artist") > 3;
  }

countDistinctPropertyValues(arr: AnyObject[], propertyName: string): number {
    const distinctValues = new Set<any>();

    arr.forEach(obj => {
        distinctValues.add(obj[propertyName]);
    });

    return distinctValues.size;
  }

  public gameModes = GameModes;

  setMode(): void {
    if (!this.enoughArtist) {
      this.snackBar.notEnoughArtist();
    }
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

  start(): void {
    const playlist: PlaylistToPlay = { 
      title: this.data!.name,
      cover: this.data!.image,
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
    this.dialogService.closeSettingDialog();
    this.data = undefined;
  }

  ngOnDestroy() {
    this.dialogSubscription?.unsubscribe();
  }
 
}
