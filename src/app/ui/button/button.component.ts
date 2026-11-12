import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export type ButtonColor = 'red' | 'yellow' | 'orange' | 'green' | 'blue';

@Component({
  selector: 'rr-button',
  imports: [MatIcon],
  template: `
    <button [class]="color()">
      @if (icon()) {
        <mat-icon class="me-1">{{ icon() }}</mat-icon>
      }
      {{ text() }}
      <ng-content />
    </button>
  `,
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly icon = input('');
  readonly color = input<ButtonColor>('red');
  readonly text = input('');
}
