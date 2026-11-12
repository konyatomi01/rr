import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { GameProposalData } from '../../../shared/models';
import { ServerService } from '../../services/server.service';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'rr-accept',
  imports: [ButtonComponent, MatDialogClose],
  templateUrl: './accept.component.html',
  styleUrl: './accept.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptComponent {
  private readonly server = inject(ServerService);
  protected readonly data = inject<GameProposalData>(MAT_DIALOG_DATA);

  accept(): void {
    this.server.acceptProposal();
  }

  decline(): void {
    this.server.declineProposal();
  }
}
