import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MessageComponent, MessageDialogData } from '../popups/message/message.component';

/** Generic message and confirmation dialogs. Feature dialogs have their own static `open()`. */
@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly dialog = inject(MatDialog);

  message(text: string): void {
    this.dialog.open<MessageComponent, MessageDialogData>(MessageComponent, { data: { text } });
  }

  async confirm(text: string, confirmText = 'Ok', cancelText = 'Cancel'): Promise<boolean> {
    const ref = this.dialog.open<MessageComponent, MessageDialogData, boolean>(MessageComponent, {
      data: { text, confirmText, cancelText },
    });
    return (await firstValueFrom(ref.afterClosed())) ?? false;
  }

  closeAll(): void {
    this.dialog.closeAll();
  }
}
