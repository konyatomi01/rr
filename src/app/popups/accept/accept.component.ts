import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServerService } from '../../services/server.service';
import { Settings } from '../settings/settings.component';

export interface AcceptDialogData {
  player: string;
  settings: Settings;
}

@Component({
  selector: 'app-accept',
  templateUrl: './accept.component.html',
  styleUrl: './accept.component.scss'
})
export class AcceptComponent {
  data?: AcceptDialogData;

  constructor(
    readonly server: ServerService,
    @Inject(MAT_DIALOG_DATA) public dialogData: { data: AcceptDialogData }
  ) {
    this.data = dialogData.data;
  }

  accept(): void {
    this.server.acceptProposal();
  }

  decline(): void {
    this.server.declineProposal();
  }  
}
