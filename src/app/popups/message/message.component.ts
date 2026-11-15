import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

export interface MessageDialogData {
  text: string;
  confirmText?: string;
  /** Shows a cancel button (closing with `false`) when set. */
  cancelText?: string;
}

@Component({
  selector: 'rr-message',
  imports: [MatButton, MatDialogContent, MatDialogActions, MatDialogClose],
  template: `
    <mat-dialog-content class="text-center message">{{ data.text }}</mat-dialog-content>
    <mat-dialog-actions class="gap-3">
      @if (data.cancelText) {
        <button matButton="elevated" class="rr-orange" [mat-dialog-close]="false">{{ data.cancelText }}</button>
      }
      <button matButton="elevated" class="rr-blue" [mat-dialog-close]="true">{{ data.confirmText ?? 'Ok' }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .message {
      min-width: 240px;
      padding-top: 36px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  protected readonly data = inject<MessageDialogData>(MAT_DIALOG_DATA);
}
