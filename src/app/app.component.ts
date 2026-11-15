import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { AcceptComponent } from './popups/accept/accept.component';
import { PartyService } from './services/party.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'rr-root',
  imports: [RouterOutlet, MatProgressSpinner],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly socket = inject(SocketService);
  protected readonly party = inject(PartyService);
  private readonly dialog = inject(MatDialog);
  private acceptDialog: MatDialogRef<AcceptComponent> | null = null;

  constructor() {
    // Everyone who has not accepted a pending proposal gets the accept dialog, wherever they are.
    effect(() => {
      const proposal = this.party.proposal();
      const self = this.party.self();
      const pending = this.party.phase() === 'proposal' && !!proposal && !!self && !self.accepted;
      untracked(() => {
        if (pending && !this.acceptDialog) {
          this.dialog.closeAll();
          this.acceptDialog = AcceptComponent.open(this.dialog);
          this.acceptDialog.afterClosed().subscribe(() => (this.acceptDialog = null));
        } else if (!pending && this.acceptDialog) {
          this.acceptDialog.close();
        }
      });
    });
  }
}
