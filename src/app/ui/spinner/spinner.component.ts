import { Component, Input } from '@angular/core';

@Component({
  selector: 'rr-spinner',
  template: `
    <div class="spinner" [style.width.px]="diameter" [style.height.px]="diameter"></div>
  `,
  styleUrl: './spinner.component.scss'
})
export class ProgressSpinnerComponent {
  @Input() diameter: number = 50;
}
