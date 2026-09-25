import { booleanAttribute, Component, input } from '@angular/core';

/**
 * Bouton pilule : libellé à gauche, marque (→, +, ✓) à droite.
 * `primary` = fond vert, `outline` = filet vert, `compact` = libellé centré, plus petit.
 */
@Component({
  selector: 'button[appPill], a[appPill]',
  template: '<ng-content />',
  host: {
    '[class.outline]': "variant() === 'outline'",
    '[class.compact]': 'compact()',
  },
  styles: `
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: var(--forest);
      color: var(--on-dark);
      border: 1px solid var(--forest);
      border-radius: 999px;
      font: 500 14px var(--sans);
      text-decoration: none;
      cursor: pointer;
      transition: background 0.15s;
    }
    :host:hover {
      background: var(--forest-hover);
      color: var(--on-dark);
    }
    :host(.outline) {
      background: transparent;
      color: var(--forest);
    }
    :host(.outline:hover) {
      background: var(--paper-2);
      color: var(--forest);
    }
    :host(.compact) {
      justify-content: center;
      padding: 14px 6px;
      font-size: 13px;
    }
  `,
})
export class PillButton {
  readonly variant = input<'primary' | 'outline'>('primary');
  readonly compact = input(false, { transform: booleanAttribute });
}
