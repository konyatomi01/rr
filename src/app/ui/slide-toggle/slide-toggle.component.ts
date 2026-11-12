import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'rr-slide-toggle',
  template: `
    <button #off type="button"></button>
    <button #on type="button"></button>
    <div class="indicator" [style.transform]="'translateX(' + (left() - 3) + 'px)'" [style.width.px]="width()"></div>
  `,
  styleUrl: './slide-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.active]': 'active()',
    '(click)': 'setValue(!active())',
  },
})
export class SlideToggleComponent {
  readonly form = input.required<FormControl<boolean>>();

  private readonly offButton = viewChild.required<ElementRef<HTMLButtonElement>>('off');
  private readonly onButton = viewChild.required<ElementRef<HTMLButtonElement>>('on');

  protected readonly active = signal(false);
  protected readonly width = signal(0);
  protected readonly left = signal(0);

  constructor() {
    afterNextRender(() => this.setValue(false));
  }

  protected setValue(value: boolean): void {
    this.form().setValue(value);
    this.active.set(value);
    const button = (value ? this.onButton() : this.offButton()).nativeElement;
    this.width.set(button.offsetWidth);
    this.left.set(button.offsetLeft);
  }
}
