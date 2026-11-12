import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'rr-spinner',
  template: `<div class="spinner" [style.width.px]="diameter()" [style.height.px]="diameter()"></div>`,
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressSpinnerComponent {
  readonly diameter = input(50);
}
