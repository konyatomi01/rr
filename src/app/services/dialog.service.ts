import { DOCUMENT, Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { GameProposalData, PlaylistDetails } from '../../shared/models';
import { AcceptComponent } from '../popups/accept/accept.component';
import { AddSongComponent } from '../popups/add-song/add-song.component';
import { MessageComponent, MessageDialogData } from '../popups/message/message.component';
import { SettingsComponent } from '../popups/settings/settings.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly dialog = inject(MatDialog);
  private readonly document = inject(DOCUMENT);

  openSettingsDialog(data: PlaylistDetails): void {
    this.blurActiveElement();
    this.dialog.open(SettingsComponent, {
      autoFocus: true,
      restoreFocus: true,
      data,
    });
  }

  openAcceptDialog(data: GameProposalData): void {
    this.dialog.closeAll();
    this.blurActiveElement();
    this.dialog.open(AcceptComponent, {
      disableClose: true,
      data,
    });
  }

  openConnectionLostDialog(): void {
    this.blurActiveElement();
    this.dialog.open<MessageComponent, MessageDialogData>(MessageComponent, {
      disableClose: true,
      minWidth: '300px',
      data: { text: 'Connection lost!', cancel: false },
    });
  }

  openAddToPlaylistDialog(): void {
    this.blurActiveElement();
    this.dialog.open(AddSongComponent, {
      autoFocus: true,
      restoreFocus: true,
    });
  }

  async openKickPlayerDialog(playerName: string): Promise<boolean> {
    this.blurActiveElement();
    const dialogRef = this.dialog.open<MessageComponent, MessageDialogData, boolean>(MessageComponent, {
      disableClose: true,
      minWidth: '300px',
      data: { text: `Are you sure you want to kick ${playerName}?`, cancel: true },
    });
    return (await firstValueFrom(dialogRef.afterClosed())) ?? false;
  }

  closeAllDialogs(): void {
    this.dialog.closeAll();
  }

  private blurActiveElement(): void {
    (this.document.activeElement as HTMLElement | null)?.blur();
  }
}
