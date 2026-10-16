import { Component, Input, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppState } from '../core/app-state';
import { CITIES } from '../data/weather';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <header class="topbar">
      <div class="top-greet">
        <span class="hi">Hi, Kajal</span>
        <h1>{{ title() }}</h1>
      </div>

      <div class="top-actions">
        <div class="search-wrap">
          <div class="search-box">
            <svg width="17" height="17" class="search-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input
              [(ngModel)]="q"
              (ngModelChange)="dropOpen.set(true)"
              (focus)="dropOpen.set(true)"
              (blur)="onBlur()"
              placeholder="Search your location"
              aria-label="Search your location"
              role="combobox"
              [attr.aria-expanded]="dropOpen() && results().length > 0"
              aria-controls="city-results"
            />
          </div>
          @if (dropOpen() && q().trim().length > 0) {
            <div class="search-drop" id="city-results" role="listbox" aria-label="Matching cities">
              @if (results().length === 0) {
                <div class="search-empty">No sample cities match “{{ q() }}”. Try Dhaka, Tokyo, London…</div>
              } @else {
                @for (c of results(); track c.id) {
                  <button
                    role="option"
                    [attr.aria-selected]="c.id === state.cityId()"
                    class="search-item"
                    [class.current]="c.id === state.cityId()"
                    (mousedown)="pick(c.id)"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                    <span>{{ c.label }}</span>
                    @if (c.id === state.cityId()) {
                      <span class="cur-dot" aria-label="Current location"></span>
                    }
                  </button>
                }
              }
            </div>
          }
        </div>

        <button
          class="theme-toggle"
          (click)="state.toggleTheme()"
          [attr.aria-label]="state.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          [title]="state.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <span class="tt-opt" [class.on]="state.theme() === 'light'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
          </span>
          <span class="tt-opt" [class.on]="state.theme() === 'dark'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 13.5A8 8 0 1 1 10.5 4 6.5 6.5 0 0 0 20 13.5z"/></svg>
          </span>
        </button>

        <div class="avatar-wrap">
          <button
            class="avatar-btn"
            (click)="toggleProfile()"
            (blur)="onProfBlur()"
            aria-haspopup="menu"
            [attr.aria-expanded]="profileOpen()"
            aria-label="Open profile menu"
          >
            <img src="https://i.pravatar.cc/64?img=47" alt="Kajal profile" />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          @if (profileOpen()) {
            <div class="profile-drop" role="menu" aria-label="Profile">
              <div class="prof-head">
                <strong>Kajal</strong>
                <span>kajal&#64;example.com</span>
              </div>
              <a routerLink="/settings" role="menuitem" (click)="profileOpen.set(false)">Profile settings</a>
              <a routerLink="/help" role="menuitem" (click)="profileOpen.set(false)">Help Center</a>
              <button role="menuitem" (mousedown)="state.toggleTheme(); profileOpen.set(false)">Toggle theme</button>
              <a routerLink="/dashboard" role="menuitem" (click)="profileOpen.set(false)">Back to dashboard</a>
            </div>
          }
        </div>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  state = inject(AppState);
  @Input() heading = '';

  readonly q = signal('');
  readonly dropOpen = signal(false);
  readonly profileOpen = signal(false);

  readonly results = computed(() => {
    const needle = this.q().trim().toLowerCase();
    void this.state.cityId();
    if (!needle) return [];
    return CITIES.filter((c) => c.label.toLowerCase().includes(needle)).slice(0, 6);
  });

  title(): string {
    if (this.heading) return this.heading;
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  pick(id: string): void {
    this.state.setCityId(id);
    this.q.set('');
    this.dropOpen.set(false);
  }

  toggleProfile(): void {
    this.profileOpen.update((v) => !v);
  }

  onBlur(): void {
    setTimeout(() => this.dropOpen.set(false), 120);
  }

  onProfBlur(): void {
    setTimeout(() => this.profileOpen.set(false), 150);
  }
}
