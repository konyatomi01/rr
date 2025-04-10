import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  public show: boolean = false;
  public text: string = ''; 

  message(message: string): void {
    this.text = message;
    this.show = true;

    setTimeout(() => {
      this.show = false;
    }, 3000);
  }
}