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
  {
    path: 'sac',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'liste' },
      {
        path: 'preparer',
        title: 'Préparation · Travel Field Manual',
        loadComponent: () => import('./features/pack/prep/prep').then((m) => m.Prep),
      },
      {
        path: 'liste',
        title: 'Ma liste · Travel Field Manual',
        loadComponent: () => import('./features/pack/list/checklist').then((m) => m.Checklist),
      },
      {
        path: 'repartition',
        title: 'Mon sac · Travel Field Manual',
        loadComponent: () => import('./features/pack/bag/bag').then((m) => m.BagPage),
      },
      {
        path: 'comparer',
        title: 'Comparer · Travel Field Manual',
        loadComponent: () => import('./features/pack/compare/compare').then((m) => m.Compare),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
