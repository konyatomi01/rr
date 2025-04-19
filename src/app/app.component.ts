import { Component } from '@angular/core';
import { RoutingService } from './services/routing.service';
import { SnackbarService } from './services/snackbar.service';

@Component({
  selector: 'rr-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    readonly route: RoutingService,
    readonly snackBar: SnackbarService
  ) {}
}
