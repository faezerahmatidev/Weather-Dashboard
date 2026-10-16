import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopbarComponent } from '../components/topbar';
import { AppState } from '../core/app-state';
import { NOTIFICATIONS, DEFAULT_READ, type NotifCategory } from '../data/notifications';

type Filter = 'all' | NotifCategory;

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [TopbarComponent, RouterLink],
  template: `
    <div class="page">
      <app-topbar heading="Notifications" />
      <section class="card notif-head" aria-label="Notifications header">
        <h2>Notifications <span class="count-pill" [attr.aria-label]="unreadCount() + ' unread'">{{ unreadCount() }}</span></h2>
        <button class="link-btn" (click)="markAll()" [disabled]="unreadCount() === 0">Mark all as read</button>
      </section>

      <div class="notif-layout">
        <section class="card notif-list-card" aria-label="Notification list">
          <div class="tabs" role="tablist" aria-label="Filter notifications">
            @for (t of tabs; track t.key) {
              <button role="tab" [attr.aria-selected]="filter() === t.key" class="tab" [class.active]="filter() === t.key" (click)="filter.set(t.key)">
                {{ t.label }} <span class="tab-n">{{ countFor(t.key) }}</span>
              </button>
            }
          </div>

          @if (list().length === 0) {
            <div class="empty" role="status">
              <strong>No new notifications</strong>
              <p class="muted">You're all caught up!</p>
              <button class="btn" (click)="filter.set('all')">Show all</button>
            </div>
          } @else {
            <ul class="notif-list">
              @for (n of list(); track n.id) {
                <li class="notif" [class.read]="isRead(n.id)" [class.open]="openId() === n.id">
                  <button
                    class="notif-main"
                    (click)="toggle(n.id)"
                    [attr.aria-expanded]="openId() === n.id"
                    [attr.aria-label]="n.title + ', ' + n.severityLabel + ', ' + n.timeAgo + (isRead(n.id) ? ', read' : ', unread')"
                  >
                    <span class="sev sev-{{ n.severity }}" aria-hidden="true">{{ n.severity === 'info' ? 'i' : '!' }}</span>
                    <span class="notif-txt">
                      <strong>{{ n.title }} @if (!isRead(n.id)) { <span class="dot" aria-hidden="true"></span> }</strong>
                      <span class="muted small">{{ n.message }}</span>
                      <span class="sev-tag">
                        <span class="pill pill-{{ n.severity }}">{{ n.severityLabel }}</span>
                        <span class="muted small">{{ n.timeAgo }}</span>
                      </span>
                    </span>
                  </button>
                  @if (openId() === n.id) {
                    <div class="notif-detail">
                      <p>{{ n.detail }}</p>
                      <p class="muted small">{{ n.timestamp }} · {{ n.location }}</p>
                      <div class="notif-actions">
                        <button class="btn sm" (click)="isRead(n.id) ? state.markUnread(n.id) : state.markRead(n.id)" [attr.aria-label]="(isRead(n.id) ? 'Mark ' + n.title + ' as unread' : 'Mark ' + n.title + ' as read')">
                          {{ isRead(n.id) ? 'Mark as unread' : 'Mark as read' }}
                        </button>
                      </div>
                    </div>
                  }
                </li>
              }
            </ul>
          }
          <p class="sample-note">Sample alerts — no real-time push source is configured.</p>
        </section>

        <aside class="card notif-side" aria-label="Notification status">
          @if (unreadCount() === 0) {
            <strong>No new notifications</strong>
            <p class="muted small">You're all caught up!</p>
          } @else {
            <strong>{{ unreadCount() }} unread notification{{ unreadCount() > 1 ? 's' : '' }}</strong>
            <p class="muted small">Select a notification to view details. Severity is shown with both icon and text label.</p>
          }
          <a routerLink="/settings" class="btn sm">Manage alerts</a>
        </aside>
      </div>
    </div>
  `,
})
export class NotificationsComponent {
  state = inject(AppState);
  readonly filter = signal<Filter>('all');
  readonly openId = signal<string | null>(null);

  readonly tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'alert', label: 'Alerts' },
    { key: 'warning', label: 'Warnings' },
    { key: 'info', label: 'Info' },
  ];

  readonly unreadCount = computed(() => {
    const m = this.state.readMap();
    return NOTIFICATIONS.filter((n) => (n.id in m ? !m[n.id] : !DEFAULT_READ.has(n.id))).length;
  });

  readonly list = computed(() => {
    const f = this.filter();
    return NOTIFICATIONS.filter((n) => (f === 'all' ? true : n.category === f));
  });

  countFor(key: Filter): number {
    return key === 'all'
      ? NOTIFICATIONS.length
      : NOTIFICATIONS.filter((n) => n.category === key).length;
  }

  isRead(id: string): boolean {
    const m = this.state.readMap();
    if (id in m) return m[id] === true;
    return DEFAULT_READ.has(id);
  }

  toggle(id: string): void {
    const willOpen = this.openId() !== id;
    this.openId.set(willOpen ? id : null);
    if (willOpen) this.state.markRead(id);
  }

  markAll(): void {
    this.state.markAllRead(NOTIFICATIONS.map((n) => n.id));
  }
}

