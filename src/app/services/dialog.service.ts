import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SettingsComponent } from '../popups/settings/settings.component';
import { AcceptComponent } from '../popups/accept/accept.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openSettingsDialog(data: any): Observable<any> {
    const config: MatDialogConfig = {
        data: data,
        position: {top: '0px'},
        hasBackdrop: true,
    };
      
    const dialogRef = this.dialog.open(SettingsComponent, config);

    return dialogRef.afterClosed();
  }

  openAcceptDialog(data: any): Observable<any> {
    const config: MatDialogConfig = {
      data: data,
      position: {top: '0px'},
      hasBackdrop: true,
  };
    
  const dialogRef = this.dialog.open(AcceptComponent, config);

  return dialogRef.afterClosed();
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}