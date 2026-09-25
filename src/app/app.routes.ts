import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Travel Field Manual',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'itineraire',
    title: 'Itinéraire · Travel Field Manual',
    loadComponent: () => import('./features/route/route').then((m) => m.RoutePage),
  },
  {
    path: 'carnet',
    title: 'Carnet de voyage · Travel Field Manual',
    loadComponent: () => import('./features/journal/list/journal-list').then((m) => m.JournalList),
  },
  {
    path: 'carnet/:id',
    title: 'Fiche de voyage · Travel Field Manual',
    loadComponent: () =>
      import('./features/journal/entry/journal-entry').then((m) => m.JournalEntry),
  },
  { path: '**', redirectTo: '' },
];
