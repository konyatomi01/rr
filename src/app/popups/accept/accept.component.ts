import { Component } from '@angular/core';
import { ServerService } from '../../services/server.sevice';
import { Subscription } from 'rxjs';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-accept',
  templateUrl: './accept.component.html',
  styleUrl: './accept.component.scss'
})
export class AcceptComponent {
  data: any;
  display: boolean = false;
  dialogSubscription: Subscription | null = null;

  constructor(
    private dialogService: DialogService,
    readonly server: ServerService
  ) {}

  ngOnInit(): void {
    this.dialogSubscription = this.dialogService.acceptState$.subscribe((state) => {
      this.display = state.visible;
      if(state.data) {
        this.data = state.data;
      }
    });
  }

  accept() {
    this.server.acceptProposal();
    this.display = false;
  }
  decline() {
    this.server.declineProposal();
    this.display = false;
  }  
}
