import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppState } from '../core/app-state';
import { UiIconComponent } from '../shared/components/ui-icon/ui-icon';
import type { IconName } from '../shared/components/ui-icon/icons';

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
}

const NAV: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: 'grid' },
  { to: '/weather-map', label: 'Weather Map', icon: 'map' },
  { to: '/calendar', label: 'Calendar', icon: 'cal' },
  { to: '/notifications', label: 'Notifications', icon: 'bell' },
  { to: '/settings', label: 'Settings', icon: 'gear' },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UiIconComponent],
  template: `
    <nav class="sidebar" [class.expanded]="expanded()" aria-label="Primary">
      <div class="side-top">
        <button
          class="icon-btn burger"
          (click)="toggle()"
          [attr.aria-expanded]="expanded()"
          [attr.aria-label]="expanded() ? 'Close navigation menu' : 'Open navigation menu'"
          title="Menu"
        >
          <span class="burger-ic" [class.open]="expanded()" aria-hidden="true">
            <svg class="ic-burger" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
            <svg class="ic-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
          </span>
        </button>
      </div>
      <div class="side-sep" aria-hidden="true"></div>
      <div class="side-nav">
        @for (item of nav; track item.to) {
          <a
            [routerLink]="item.to"
            routerLinkActive="active"
            [title]="item.label"
            [attr.aria-label]="item.label"
            class="side-link"
          >
            <app-ui-icon [name]="item.icon" [size]="20" [stroke]="1.9" />
            <span class="side-label">{{ item.label }}</span>
            @if (item.to === '/notifications' && state.unreadNotifications() > 0) {
              <span class="nav-badge" [attr.aria-label]="state.unreadNotifications() + ' unread notifications'">{{ state.unreadNotifications() }}</span>
            }
            <span class="side-tip" role="tooltip">{{ item.label }}</span>
          </a>
        }
      </div>
      <div class="side-bottom">
        <a
          routerLink="/help"
          routerLinkActive="active"
          title="Help Center"
          aria-label="Help Center"
          class="side-link"
        >
          <app-ui-icon name="help" [size]="20" [stroke]="1.9" />
          <span class="side-label">Help Center</span>
          <span class="side-tip" role="tooltip">Help Center</span>
        </a>
      </div>
    </nav>
  `,
})
export class SidebarComponent {
  readonly state = inject(AppState);
  readonly nav = NAV;
  readonly expanded = signal(false);

  toggle(): void {
    this.expanded.update((v) => !v);
  }
}
