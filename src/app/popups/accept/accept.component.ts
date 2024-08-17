import { Component, Inject } from '@angular/core';
import { ServerService } from '../../services/server.sevice';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-accept',
  templateUrl: './accept.component.html',
  styleUrl: './accept.component.scss'
})
export class AcceptComponent {

  constructor(
    public dialogRef: MatDialogRef<AcceptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    readonly server: ServerService
  ) {}

  accept() {
    this.server.acceptProposal();
    this.dialogRef.close();
  }
  decline() {
    this.server.declineProposal();
    this.dialogRef.close();
  }  
}
