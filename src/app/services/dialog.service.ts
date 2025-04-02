import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AcceptDialogData } from '../popups/accept/accept.component';
import { Playlist } from './music.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  public settingsState$ = new BehaviorSubject<{ visible: boolean; data?: Playlist }>({
    visible: false,
  });
  public acceptState$ = new BehaviorSubject<{ visible: boolean; data?: AcceptDialogData }>({
    visible: false,
  });

  openSettingsDialog(data: Playlist): void {
    this.settingsState$.next({ visible: true, data });
  }
  openAcceptDialog(data: AcceptDialogData): void {
    this.acceptState$.next({ visible: true, data });
  }

  closeSettingDialog(): void {
    this.settingsState$.next({ visible: false });
  }
  closeAcceptDialog(): void {
    this.acceptState$.next({ visible: false });
  }
}