import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServerService } from '../../services/server.service';
import { SnackbarService } from '../../services/snackbar.service';

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
	selector: 'rr-settings',
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss'
})
export class SettingsComponent {

	form = new FormGroup({
		rounds: new FormControl<number>(3, [Validators.required, Validators.min(1), Validators.max(30)]),
		mode: new FormControl<GameModes>(GameModes.title, Validators.required),
		speed: new FormControl<GameSpeeds>(GameSpeeds.slow, Validators.required),
		lives: new FormControl<number>(3, Validators.required),
	});
	data?: PlaylistToPlay;

	constructor(
		readonly server: ServerService,
		private snackBar: SnackbarService,
		@Inject(MAT_DIALOG_DATA) public dialogData: { data: PlaylistToPlay }
	) {
		this.data = dialogData.data;
	}

	get enoughArtist(): boolean {
		return this.countDistinctPropertyValues(this.data!.tracks, "artist") > 3;
	}

	countDistinctPropertyValues(arr: AnyObject[], propertyName: string): number {
		const distinctValues = new Set<any>();
		arr.forEach(obj => distinctValues.add(obj[propertyName]));
		return distinctValues.size;
	}

	public gameModes = GameModes;

	setMode(): void {
		if (!this.enoughArtist) {
			this.snackBar.message("Only available when there are at least 4 different artists in the playlist!");
			this.form.controls.mode.setValue(GameModes.title);
		}
	}

	plusRounds(): void {
		if (this.form.controls.rounds.value! + 1 <= this.data!.tracks.length) {
			this.form.controls.rounds.setValue(this.form.controls.rounds.value! + 1);
		}
	}

	minusRounds(): void {
		if (this.form.controls.rounds.value! - 1 >= 1) {
			this.form.controls.rounds.setValue(this.form.controls.rounds.value! - 1);
		}
	}

	public gameSpeeds = GameSpeeds;

	start(): void {

		const settings: Settings = { 
			rounds: this.form.controls.rounds.value!,
			gameMode: this.form.controls.mode.value!,
			speed: this.form.controls.speed.value!,
			health: this.form.controls.lives.value!,
			playlist: this.data!
		}
		this.server.startGame(settings);
	}
}