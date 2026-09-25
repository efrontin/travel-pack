import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';

interface Tab {
  label: string;
  link: string;
  /** Préfixe d'URL qui rend l'onglet actif. */
  match: string;
  icon: [string, string];
}

const TABS: Tab[] = [
  { label: 'Accueil', link: '/', match: '/', icon: ['M3 10.5 12 3l9 7.5V21H3z', 'M9 21v-7h6v7'] },
  {
    label: 'Itinéraire',
    link: '/itineraire',
    match: '/itineraire',
    icon: [
      'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z',
      'M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    ],
  },
  {
    label: 'Mon sac',
    link: '/sac/liste',
    match: '/sac',
    icon: ['M4 8h16l-1 13H5z', 'M8.5 8V6a3.5 3.5 0 0 1 7 0v2'],
  },
  {
    label: 'Équipement',
    link: '/equipement',
    match: '/equipement',
    icon: ['M5 9a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v11H5z', 'M9 5V3h6v2M8 13h8'],
  },
  {
    label: 'Carnet',
    link: '/carnet',
    match: '/carnet',
    icon: ['M5 4h10a4 4 0 0 1 4 4v13H8a3 3 0 0 1-3-3z', 'M9 9h6M9 13h6'],
  },
];

@Component({
  selector: 'app-tab-bar',
  imports: [RouterLink],
  template: `
    <nav aria-label="Navigation principale">
      @for (tab of tabs; track tab.link) {
        <a
          [routerLink]="tab.link"
          [class.on]="tab === active()"
          [attr.aria-current]="tab === active() ? 'page' : null"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path [attr.d]="tab.icon[0]" />
            <path [attr.d]="tab.icon[1]" />
          </svg>
          <span>{{ tab.label }}</span>
          <i></i>
        </a>
      }
    </nav>
  `,
  styles: `
    nav {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      padding: 10px 4px calc(12px + env(safe-area-inset-bottom));
      background: var(--paper);
      border-top: 1px solid var(--rule-soft);
    }
    a {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      padding: 4px 0;
      color: var(--muted-2);
      font: 400 10px var(--sans);
      text-decoration: none;
    }
    a:hover {
      color: var(--ink);
    }
    a.on {
      color: var(--ink);
      font-weight: 600;
    }
    i {
      width: 16px;
      height: 2px;
    }
    a.on i {
      background: var(--copper);
    }
  `,
})
export class TabBar {
  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly tabs = TABS;
  protected readonly active = computed(() => {
    const path = this.url().split(/[?#]/)[0];
    return TABS.find((t) => (t.match === '/' ? path === '/' : path.startsWith(t.match)));
  });
}
