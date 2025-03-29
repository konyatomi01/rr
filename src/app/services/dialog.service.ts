import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SettingsDialogData } from '../popups/settings/settings.component';
import { AcceptDialogData } from '../popups/accept/accept.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  public settingsState$ = new BehaviorSubject<{ visible: boolean; data?: SettingsDialogData }>({
    visible: false,
  });
  public acceptState$ = new BehaviorSubject<{ visible: boolean; data?: AcceptDialogData }>({
    visible: false,
  });

  openSettingsDialog(data: SettingsDialogData): void {
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