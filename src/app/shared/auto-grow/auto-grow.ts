import { afterRenderEffect, Directive, ElementRef, inject } from '@angular/core';

/** Textarea qui grandit avec son contenu (repli pour les navigateurs sans `field-sizing`). */
@Directive({
  selector: 'textarea[appAutoGrow]',
  host: { '(input)': 'fit()' },
})
export class AutoGrow {
  private readonly el = inject<ElementRef<HTMLTextAreaElement>>(ElementRef).nativeElement;

  constructor() {
    afterRenderEffect(() => this.fit());
  }

  protected fit(): void {
    if (CSS.supports('field-sizing', 'content')) return;
    this.el.style.height = 'auto';
    this.el.style.height = this.el.scrollHeight + 'px';
  }
}
