import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiStore } from '../../core/state/ui.store';
import { Logo } from '../../shared/logo/logo';
import { BackupPanel } from './backup-panel';

const ENTRIES = [
  { label: 'ACCUEIL', link: '/' },
  { label: 'ITINÉRAIRE', link: '/itineraire' },
  { label: 'CARNET DE VOYAGE', link: '/carnet' },
  { label: 'PRÉPARER', link: '/sac/preparer' },
  { label: 'MA LISTE', link: '/sac/liste' },
  { label: 'ÉQUIPEMENT', link: '/equipement' },
  { label: 'MON SAC', link: '/sac/repartition' },
  { label: 'COMPARER', link: '/sac/comparer' },
];

/** Menu plein écran (overlay, pas une route). */
@Component({
  selector: 'app-menu',
  imports: [RouterLink, Logo, BackupPanel],
  template: `
    <div class="top">
      <app-logo />
      <button
        type="button"
        class="close"
        aria-label="Fermer le menu"
        (click)="ui.menuOpen.set(false)"
      >
        ×
      </button>
    </div>
    <nav aria-label="Menu">
      @for (entry of entries; track entry.link) {
        <a [routerLink]="entry.link" (click)="ui.menuOpen.set(false)">
          <span>{{ entry.label }}</span
          ><span aria-hidden="true">›</span>
        </a>
      }
    </nav>
    <app-backup-panel />
    <footer>
      <span>NE VOYAGEZ PAS SEULEMENT.<br />SACHEZ CE QUE VOUS PORTEZ.</span>
      <i></i>
    </footer>
  `,
  host: {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Menu',
    '(document:keydown.escape)': 'ui.menuOpen.set(false)',
  },
  styles: `
    :host {
      position: absolute;
      inset: 0;
      z-index: 20;
      display: flex;
      flex-direction: column;
      padding: 24px 28px 40px;
      background: var(--forest-deep);
      color: var(--on-dark);
      animation: fm-in 0.2s ease;
      overflow-y: auto;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .close {
      padding: 4px;
      border: 0;
      background: none;
      color: var(--on-dark);
      font: 300 26px/1 var(--sans);
    }
    nav {
      display: flex;
      flex-direction: column;
      margin-top: 44px;
    }
    a {
      display: flex;
      justify-content: space-between;
      padding: 14px 0;
      border-bottom: 1px solid rgba(245, 240, 230, 0.18);
      color: var(--on-dark);
      font: 500 15px var(--sans);
      letter-spacing: 0.16em;
      text-decoration: none;
    }
    a:hover {
      color: var(--copper-light);
    }
    footer {
      margin-top: auto;
      padding-top: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 18px;
      font: 500 12px/1.7 var(--sans);
      letter-spacing: 0.16em;
      text-align: center;
    }
    i {
      width: 40px;
      height: 2px;
      background: var(--copper);
    }
  `,
})
export class Menu {
  protected readonly ui = inject(UiStore);
  protected readonly entries = ENTRIES;
}
