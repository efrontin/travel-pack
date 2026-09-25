import { booleanAttribute, Component, input } from '@angular/core';

/** Chip pilule ; actif = fond plein vert ou cuivre. */
@Component({
  selector: 'button[appChip]',
  template: '<ng-content />',
  host: {
    '[class.on]': 'active()',
    '[class.copper]': "tone() === 'copper'",
    '[attr.aria-pressed]': 'active()',
  },
  styles: `
    :host {
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--ink);
      font: 500 12px var(--sans);
      cursor: pointer;
    }
    :host(:not(.on):hover) {
      border-color: var(--forest);
      background: var(--paper-2);
    }
    :host(.on) {
      background: var(--forest);
      border-color: var(--forest);
      color: var(--on-dark);
    }
    :host(.on.copper) {
      background: var(--copper);
      border-color: var(--copper);
      color: #fff8ef;
    }
  `,
})
export class Chip {
  readonly active = input(false, { transform: booleanAttribute });
  readonly tone = input<'forest' | 'copper'>('forest');
}
