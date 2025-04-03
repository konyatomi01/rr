import { Component, Input } from '@angular/core';

@Component({
  selector: 'rr-button',
  template: `
    <button [ngClass]="color">
        <mat-icon *ngIf="icon" class="me-1">{{icon}}</mat-icon>
        {{text}}
        <ng-content />
    </button>
  `,
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() icon: string = '';
  @Input() color: 'red' | 'yellow'| 'orange' | 'green' | 'blue' = 'red';
  @Input() text: string = '';
}