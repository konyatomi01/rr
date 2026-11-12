import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChildren,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { startWith, switchMap } from 'rxjs';

@Directive({
  selector: '[toggle-button]',
  host: {
    '[class.disabled]': 'disabled()',
    '[class.selected]': 'selected()',
    '(click)': 'select()',
  },
})
export class ToggleDirective<T> {
  private readonly parent = inject<ToggleButtonComponent<T>>(ToggleButtonComponent);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly value = input.required<T>();
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly selected = computed(() => this.parent.value() === this.value());

  get width(): number {
    return this.el.nativeElement.offsetWidth;
  }
  get left(): number {
    return this.el.nativeElement.offsetLeft;
  }

  protected select(): void {
    this.parent.form().setValue(this.value());
  }
}

@Component({
  selector: 'rr-toggle-button',
  template: `
    <ng-content />
    <div class="indicator" [style.transform]="'translateX(' + (left() - 4) + 'px)'" [style.width.px]="width()"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.red]': 'color() === "red"',
  },
})
export class ToggleButtonComponent<T> {
  readonly form = input.required<FormControl<T>>();
  readonly color = input<'orange' | 'red'>('orange');

  /** Current value of the bound form control, as a signal. */
  readonly value = toSignal(
    toObservable(this.form).pipe(switchMap(control => control.valueChanges.pipe(startWith(control.value)))),
  );

  private readonly buttons = contentChildren<ToggleDirective<T>>(ToggleDirective, { descendants: true });

  protected readonly width = signal(0);
  protected readonly left = signal(0);

  constructor() {
    // Move the indicator under the selected button once the DOM reflects the new selection.
    afterRenderEffect({
      read: () => {
        const selected = this.buttons().find(button => button.selected());
        if (selected) {
          this.width.set(selected.width);
          this.left.set(selected.left);
        }
      },
    });
  }
}
