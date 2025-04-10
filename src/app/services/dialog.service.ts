import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { AcceptComponent, AcceptDialogData } from '../popups/accept/accept.component';
import { MessageComponent, MessageDialogData } from '../popups/message/message.component';
import { SettingsComponent } from '../popups/settings/settings.component';
import { Playlist } from './music.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {}

  openSettingsDialog(data: Playlist): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    this.dialog.open(SettingsComponent, {
      autoFocus: true,
      restoreFocus: true,
      data: { data }
    });
  }

  openAcceptDialog(data: AcceptDialogData): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    this.dialog.open(AcceptComponent, {
      disableClose: true,
      data: { data }
    });
  }

  openConnectionLostDialog(): void {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const data: MessageDialogData = {
      text: 'Connection lost!',
      cancel: false
    };
    this.dialog.open(MessageComponent, {
      disableClose: true,
      minWidth: '300px',
      data: { data }
    });
  }

  async openKickPlayerDialog(playerName: string): Promise<boolean> {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const data: MessageDialogData = {
      text: `Are you sure you want to kick ${playerName}?`,
      cancel: true
    };
    const dialogRef = this.dialog.open(MessageComponent, {
      disableClose: true,
      minWidth: '300px',
      data: { data }
    });
    const result = await lastValueFrom(dialogRef.afterClosed());
    return result;
  }

  closeAllDialogs(): void {
    this.dialog.closeAll();
  }
}