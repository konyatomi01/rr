import { Component, ElementRef, HostBinding, HostListener, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'rr-slide-toggle',
  template: `
    <button #false></button>
    <button #true></button>
    <div class="indicator" [style.transform]="'translateX(' + (left - 3) + 'px)'" [style.width.px]="width"></div>
    
  `,
  styleUrls: ['./slide-toggle.component.scss'],
})
export class SlideToggleComponent {
  @Input({ required: true }) form!: FormControl<boolean>;

  @ViewChild('false', { static: true }) falseButton!: ElementRef<HTMLButtonElement>;
	@ViewChild('true', { static: true }) trueButton!: ElementRef<HTMLButtonElement>;

  @HostListener('click')
  toggleValue(): void {
    this.setValue(!this.form.value);
  }

  @HostBinding('class.active') get active() {
      return this.form.value;
    }
  width: number = 0;
  left: number = 0;

ngAfterContentInit(): void {
  this.setValue(false);
}

setValue(value: boolean): void {
  this.form.setValue(value);
  const button = value ? this.trueButton.nativeElement : this.falseButton.nativeElement;
  this.width = button.offsetWidth;
  this.left = button.offsetLeft;
}
}