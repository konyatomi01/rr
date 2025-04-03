import { AfterContentInit, Component, ContentChildren, Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[toggle-button]',
  standalone: false,
})
export class ToggleDirective<T> {
  @Input() value!: T;
  @HostBinding('class.selected') get active() {
    return this.parent.form.value === this.value;
  }
  @HostListener('click')
	onClick() {
		this.parent.form.setValue(this.value);
	}
  get width() {
    return this.el.nativeElement.offsetWidth;
  }
  get left() {
    return this.el.nativeElement.offsetLeft;
  }
  constructor( public parent: ToggleButtonComponent<T>, private el: ElementRef<HTMLButtonElement> ) {}
}

@Component({
  selector: 'rr-toggle-button',
  template: `
    <ng-content></ng-content>
    <div class="indicator" [style.transform]="'translateX(' + (left - 4) + 'px)'" [style.width.px]="width"></div>
  `,
})
export class ToggleButtonComponent<T> implements OnDestroy, AfterContentInit {
  @Input({ required: true }) form!: FormControl<T>;
  
  @ContentChildren(ToggleDirective, { descendants: true }) buttons!: QueryList<ToggleDirective<T>>;

  subscription?: Subscription;
  width: number = 0;
  left: number = 0;

ngAfterContentInit(): void {
  this.subscription = this.form.valueChanges.subscribe(() => {
      this.animate();
  });
  setTimeout(() => this.animate(), 0);
}

animate(): void {
  const button = this.buttons.find((button) => button.active);
  if (button) {
      this.width = button.width;
      this.left = button.left;
  }
}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}