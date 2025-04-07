import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AcceptComponent, AcceptDialogData } from '../popups/accept/accept.component';
import { SettingsComponent } from '../popups/settings/settings.component';
import { Playlist } from './music.service';
import { MessageComponent, MessageDialogData } from '../popups/message/message.component';

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

  closeAllDialogs(): void {
    this.dialog.closeAll();
  }
}