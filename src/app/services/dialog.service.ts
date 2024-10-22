import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  public settingsState$ = new BehaviorSubject<{ visible: boolean; data?: any }>({
    visible: false,
  });
  public acceptState$ = new BehaviorSubject<{ visible: boolean; data?: any }>({
    visible: false,
  });

  openSettingsDialog(data: any): void {
    this.settingsState$.next({ visible: true, data });
  }

  openAcceptDialog(data: any): void {
    this.acceptState$.next({ visible: true, data });
  }
}