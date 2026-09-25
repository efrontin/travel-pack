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
  { path: '**', redirectTo: '' },
];
