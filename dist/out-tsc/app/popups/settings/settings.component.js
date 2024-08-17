"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsComponent = exports.GameSpeeds = exports.GameModes = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const dialog_1 = require("@angular/material/dialog");
const forms_1 = require("@angular/forms");
var GameModes;
(function (GameModes) {
    GameModes["title"] = "title";
    GameModes["artist"] = "artist";
})(GameModes || (exports.GameModes = GameModes = {}));
var GameSpeeds;
(function (GameSpeeds) {
    GameSpeeds[GameSpeeds["slow"] = 30] = "slow";
    GameSpeeds[GameSpeeds["normal"] = 10] = "normal";
    GameSpeeds[GameSpeeds["fast"] = 5] = "fast";
})(GameSpeeds || (exports.GameSpeeds = GameSpeeds = {}));
let SettingsComponent = class SettingsComponent {
    constructor(dialogRef, data, server, spotify, fb) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.server = server;
        this.spotify = spotify;
        this.fb = fb;
        this.tracks = [];
        this.enoughArtist = true;
        this.selectedMode = GameModes.title;
        this.selectedSpeed = GameSpeeds.slow;
        this.lives = 3;
        this.gameModes = GameModes;
        this.gameSpeeds = GameSpeeds;
    }
    onNoClick() {
        this.dialogRef.close();
    }
    ngOnInit() {
        this.loadData(this.data.id);
    }
    loadData(playlistId) {
        this.spotify.getTracksFromPlaylist(playlistId).subscribe((tracks) => {
            this.tracks = tracks.filter((item) => item.preview_url !== null)
                .map(item => ({
                url: item.preview_url,
                title: item.name,
                artist: item.artists[0].name
            }));
            this.enoughArtist = (this.countDistinctPropertyValues(this.tracks, "artist") > 3);
            this.form = this.fb.group({
                mode: [GameModes.title, forms_1.Validators.required],
                rounds: [this.half(), forms_1.Validators.required],
                lives: [3, forms_1.Validators.required],
                speed: [GameSpeeds.slow, forms_1.Validators.required]
            });
        }, (error) => {
            console.error('Error loading playlist tracks:', error);
        });
    }
    half() {
        return Math.floor(this.tracks.length / 2);
    }
    countDistinctPropertyValues(arr, propertyName) {
        const distinctValues = new Set();
        arr.forEach(obj => {
            distinctValues.add(obj[propertyName]);
        });
        return distinctValues.size;
    }
    setMode(mode) {
        this.selectedMode = mode;
        this.form.get('mode')?.setValue(mode);
        if (this.artistModeTooltip) {
            this.artistModeTooltip.hide();
        }
    }
    isModeSelected(mode) {
        return this.selectedMode === mode;
    }
    plusRounds() {
        if (this.form && this.form.get('rounds')) {
            const currentRounds = this.form.get('rounds').value;
            if (currentRounds + 1 <= this.tracks.length) {
                this.form.get('rounds').setValue(currentRounds + 1);
            }
        }
    }
    minusRounds() {
        if (this.form && this.form.get('rounds')) {
            let currentRounds = this.form.get('rounds').value;
            if (currentRounds - 1 >= 1) {
                this.form.get('rounds').setValue(currentRounds - 1);
            }
        }
    }
    setSpeed(speed) {
        this.selectedSpeed = speed;
        this.form.get('speed')?.setValue(speed);
        if (this.artistModeTooltip) {
            this.artistModeTooltip.hide();
        }
    }
    isSpeedSelected(speed) {
        return this.selectedSpeed === speed;
    }
    setLives(value) {
        this.lives = value;
        this.form.get('lives')?.setValue(value);
    }
    start() {
        const playlist = {
            title: this.data.name,
            cover: this.data.images[0].url,
            tracks: this.tracks
        };
        const settings = {
            rounds: this.form.get('rounds')?.value,
            gameMode: this.form.get('mode')?.value,
            speed: this.form.get('speed')?.value,
            health: this.form.get('lives')?.value,
            playlist: playlist
        };
        this.server.startGame(settings);
        this.dialogRef.close();
    }
};
exports.SettingsComponent = SettingsComponent;
tslib_1.__decorate([
    (0, core_1.ViewChild)('artistModeTooltip')
], SettingsComponent.prototype, "artistModeTooltip", void 0);
exports.SettingsComponent = SettingsComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-settings',
        templateUrl: './settings.component.html',
        styleUrl: './settings.component.scss'
    }),
    tslib_1.__param(1, (0, core_1.Inject)(dialog_1.MAT_DIALOG_DATA))
], SettingsComponent);
//# sourceMappingURL=settings.component.js.map