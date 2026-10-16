import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard').then((m) => m.DashboardComponent),
    title: 'Dashboard — Weather Dashboard',
  },
  {
    path: 'weather-map',
    loadComponent: () => import('./pages/weather-map').then((m) => m.WeatherMapComponent),
    title: 'Weather Map — Weather Dashboard',
  },
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar').then((m) => m.CalendarComponent),
    title: 'Calendar — Weather Dashboard',
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications').then((m) => m.NotificationsComponent),
    title: 'Notifications — Weather Dashboard',
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings').then((m) => m.SettingsComponent),
    title: 'Settings — Weather Dashboard',
  },
  {
    path: 'help',
    loadComponent: () => import('./pages/help').then((m) => m.HelpComponent),
    title: 'Help Center — Weather Dashboard',
  },
  { path: '**', redirectTo: 'dashboard' },
];
