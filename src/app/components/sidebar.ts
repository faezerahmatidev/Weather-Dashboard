import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppState } from '../core/app-state';
import { NOTIFICATIONS, DEFAULT_READ } from '../data/notifications';

interface NavItem {
  to: string;
  label: string;
  icon: string;
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
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar" [class.expanded]="expanded()" aria-label="Primary">
      <div class="side-top">
        <button
          class="icon-btn burger"
          (click)="toggle()"
          [attr.aria-expanded]="expanded()"
          aria-label="Toggle navigation menu"
          title="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
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
            <span aria-hidden="true">
              @switch (item.icon) {
                @case ('grid') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
                }
                @case ('map') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/></svg>
                }
                @case ('cal') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>
                }
                @case ('bell') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6zM10 20a2 2 0 0 0 4 0"/></svg>
                }
                @case ('gear') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></svg>
                }
              }
            </span>
            <span class="side-label">{{ item.label }}</span>
            @if (item.to === '/notifications' && unread() > 0) {
              <span class="nav-badge" [attr.aria-label]="unread() + ' unread notifications'">{{ unread() }}</span>
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.8.3-.9 1-.9 1.7M12 17h.01"/></svg>
          <span class="side-label">Help Center</span>
          <span class="side-tip" role="tooltip">Help Center</span>
        </a>
      </div>
    </nav>
  `,
})
export class SidebarComponent {
  private state = inject(AppState);
  readonly nav = NAV;
  readonly expanded = signal(false);
  readonly unread = computed(() => {
    const m = this.state.readMap();
    return NOTIFICATIONS.filter((n) => (n.id in m ? !m[n.id] : !DEFAULT_READ.has(n.id))).length;
  });

  toggle(): void {
    this.expanded.update((v) => !v);
  }
}
