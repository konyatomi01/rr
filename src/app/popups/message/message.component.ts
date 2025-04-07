import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface MessageDialogData {
  text: string;
  cancel: boolean;
}

@Component({
  selector: 'rr-message',
  templateUrl: './message.component.html',
})
export class MessageComponent {
  data?: MessageDialogData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: { data: MessageDialogData }
  ) {
    this.data = dialogData.data;
    console.log(this.data);
  } 
}
