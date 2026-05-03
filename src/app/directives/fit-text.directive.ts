// directives/fit-text.directive.ts
import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';

@Directive({
  selector: '[fitText]',
  standalone: true
})
export class FitTextDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private ro!: ResizeObserver;

  ngAfterViewInit() {
    this.ro = new ResizeObserver(() => this.fit());
    this.ro.observe(this.el.nativeElement.parentElement);
    this.fit();
  }

  private fit() {
    const parent = this.el.nativeElement.parentElement;
    const el = this.el.nativeElement;

    let size = 10;
    el.style.fontSize = size + 'px';
    el.style.whiteSpace = 'nowrap';
    el.style.lineHeight = '1';

    while (
      el.scrollWidth <= parent.clientWidth &&
      el.scrollHeight <= parent.clientHeight &&
      size < 500
    ) {
      size++;
      el.style.fontSize = size + 'px';
    }

    el.style.fontSize = (size - 1) + 'px';
  }

  ngOnDestroy() {
    this.ro?.disconnect();
  }
}
