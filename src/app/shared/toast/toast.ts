import { Component, inject } from '@angular/core';
import { UiStore } from '../../core/state/ui.store';

@Component({
  selector: 'app-toast',
  template: `
    @if (ui.toast(); as message) {
      <div role="status">{{ message }}</div>
    }
  `,
  styles: `
    :host {
      position: absolute;
      left: 24px;
      right: 24px;
      bottom: calc(84px + env(safe-area-inset-bottom));
      z-index: 25;
      pointer-events: none;
    }
    div {
      padding: 14px 16px;
      background: var(--ink);
      color: var(--on-dark);
      border-radius: 6px;
      font: 400 13px var(--sans);
      animation: fm-in 0.2s ease;
    }
  `,
})
export class Toast {
  protected readonly ui = inject(UiStore);
}
