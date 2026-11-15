import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { GameService } from '../../services/game.service';
import { PartyService } from '../../services/party.service';

/** "X wants to play…": accept or decline the pending game proposal. */
@Component({
  selector: 'rr-accept',
  imports: [MatButton, MatIcon, MatDialogTitle, MatDialogContent, MatDialogActions],
  templateUrl: './accept.component.html',
  styles: `
    .stat {
      width: 56px;
      height: 56px;
    }
    .cover {
      width: 50%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptComponent {
  private readonly party = inject(PartyService);
  private readonly dialogRef = inject<MatDialogRef<AcceptComponent>>(MatDialogRef);
  protected readonly game = inject(GameService);
  protected readonly proposal = this.party.proposal;

  static open(dialog: MatDialog): MatDialogRef<AcceptComponent> {
    return dialog.open(AcceptComponent, { disableClose: true, width: '340px' });
  }

  respond(accept: boolean): void {
    this.party.respondProposal(accept);
    this.dialogRef.close();
  }
}
