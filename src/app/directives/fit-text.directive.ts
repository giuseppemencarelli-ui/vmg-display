// directives/fit-text.directive.ts
import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, output } from '@angular/core';

@Directive({
  selector: '[fitText]',
  standalone: true
})
export class FitTextDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private ro!: ResizeObserver;

  fitted = output<number>(); // emette la dimensione calcolata

  ngAfterViewInit() {
    this.ro = new ResizeObserver(() => this.fit());
    this.ro.observe(this.el.nativeElement.parentElement);
    this.ro.observe(this.el.nativeElement);
    this.fit();
  }

  applySize(size: number) {
    this.el.nativeElement.style.fontSize = size + 'px';
  }

  recalculate(): void {
    this.fit();
  }

  private fit(): number {
    const parent = this.el.nativeElement.parentElement;
    const el = this.el.nativeElement;

    el.style.whiteSpace = 'nowrap';
    el.style.lineHeight = '1';
    el.style.display = 'inline-block'; // fondamentale per scrollWidth corretto

    let min = 10;
    let max = 500;

    while (min < max) {
      const mid = Math.floor((min + max) / 2);
      el.style.fontSize = mid + 'px';

      if (
        el.scrollWidth <= parent.clientWidth &&
        el.scrollHeight <= parent.clientHeight
      ) {
        min = mid + 1;
      } else {
        max = mid;
      }
    }

    const size = min - 1;
    el.style.fontSize = size + 'px';
    this.fitted.emit(size);
    return size;
  }

  ngOnDestroy() {
    this.ro?.disconnect();
  }
}