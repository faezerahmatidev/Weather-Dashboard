import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard';
import { WeatherMapComponent } from './pages/weather-map';
import { CalendarComponent } from './pages/calendar';
import { NotificationsComponent } from './pages/notifications';
import { SettingsComponent } from './pages/settings';
import { HelpComponent } from './pages/help';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard — Weather Dashboard' },
  { path: 'weather-map', component: WeatherMapComponent, title: 'Weather Map — Weather Dashboard' },
  { path: 'calendar', component: CalendarComponent, title: 'Calendar — Weather Dashboard' },
  { path: 'notifications', component: NotificationsComponent, title: 'Notifications — Weather Dashboard' },
  { path: 'settings', component: SettingsComponent, title: 'Settings — Weather Dashboard' },
  { path: 'help', component: HelpComponent, title: 'Help Center — Weather Dashboard' },
  { path: '**', redirectTo: 'dashboard' },
];
