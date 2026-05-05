import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'setrotta',
    loadComponent: () => import('./features/setrotta/setrotta.page').then((m) => m.SetrottaPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
