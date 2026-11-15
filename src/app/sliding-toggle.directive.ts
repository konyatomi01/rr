import { DestroyRef, Directive, ElementRef, Renderer2, afterEveryRender, inject } from '@angular/core';

/**
 * Adds the sliding pill indicator under the selected toggle of a `mat-button-toggle-group.rr-toggle`.
 * Material handles selection, keyboard and ARIA; this only moves a decorative element.
 */
@Directive({ selector: 'mat-button-toggle-group[rrSlidingToggle]' })
export class SlidingToggleDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly indicator: HTMLElement;

  constructor() {
    const renderer = inject(Renderer2);
    this.indicator = renderer.createElement('span');
    renderer.addClass(this.indicator, 'rr-toggle-indicator');
    renderer.setAttribute(this.indicator, 'aria-hidden', 'true');
    renderer.insertBefore(this.host, this.indicator, this.host.firstChild);

    afterEveryRender({ read: () => this.update() });
    // Layout changes (web font loaded, viewport resized) move the toggles without a render.
    const observer = new ResizeObserver(() => this.update());
    observer.observe(this.host);
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }

  private update(): void {
    const selected = this.host.querySelector<HTMLElement>('.mat-button-toggle-checked');
    this.indicator.style.opacity = selected ? '1' : '0';
    if (!selected) return;
    this.indicator.style.width = `${selected.offsetWidth}px`;
    this.indicator.style.transform = `translateX(${selected.offsetLeft}px)`;
  }
}
