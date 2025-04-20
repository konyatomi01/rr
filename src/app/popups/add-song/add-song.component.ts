import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DisplayService } from '../../services/display.service';
import { MusicService } from '../../services/music.service';
import { CustomPlaylistTrack, PartyService } from '../../services/party.service';
import { ServerService } from '../../services/server.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
	selector: 'rr-add-song',
	templateUrl: './add-song.component.html',
	styleUrl: './add-song.component.scss'
})
export class AddSongComponent implements OnInit, OnDestroy {
	search = new FormControl<string>('', { validators: [Validators.required] });
	songs: CustomPlaylistTrack[] = [];
	subscription?: Subscription;
	isLoading: boolean = false;
	
	  constructor(
		private music: MusicService,
		readonly display: DisplayService,
		readonly server: ServerService,
		readonly snackBar: SnackbarService,
		readonly party: PartyService
	  ) {
		this.subscription = this.search.valueChanges.subscribe(async value => {
		  if(value) await this.fetchSongs(value);
		});
	  }
	  async fetchSongs(term: string) {
		this.isLoading = true;
		const songs = await this.music.getSongsBySearch(term);
		if (songs.length) this.songs = songs;
		this.isLoading = false;
	  }
	
	  async reset(): Promise<void> {
		this.search.setValue('');
		this.search.markAsPristine();
		await this.fetchSongs('abba');
	  }

	ngOnInit(): void {
		this.reset();
	}
	
	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}

	addSong(song: CustomPlaylistTrack): void {
		this.server.addCustomPlaylistTrack({ ...song, player: this.party.player });
	}
	
}