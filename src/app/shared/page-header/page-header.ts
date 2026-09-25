import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Ligne d'en-tête d'écran : libellé (ou lien retour ←) et repère à droite. */
@Component({
  selector: 'app-page-header',
  imports: [RouterLink],
  template: `
    @if (back(); as link) {
      <a [routerLink]="link">←&nbsp;&nbsp;{{ label() }}</a>
    } @else {
      <span>{{ label() }}</span>
    }
    <span class="aside"><ng-content /></span>
  `,
  styles: `
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      font: 600 11px var(--sans);
      letter-spacing: 0.18em;
    }
    a {
      color: var(--ink);
      text-decoration: none;
    }
    a:hover {
      color: var(--copper);
    }
    .aside {
      font-weight: 400;
      color: var(--muted);
      white-space: nowrap;
    }
  `,
})
export class PageHeader {
  readonly label = input.required<string>();
  readonly back = input<string>();
}
