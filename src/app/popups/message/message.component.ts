import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { ButtonComponent } from '../../ui/button/button.component';

export interface MessageDialogData {
  text: string;
  cancel: boolean;
}

@Component({
  selector: 'rr-message',
  imports: [ButtonComponent, MatDialogClose],
  templateUrl: './message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  protected readonly data = inject<MessageDialogData>(MAT_DIALOG_DATA);
}
