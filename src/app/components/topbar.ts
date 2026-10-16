import { Component, ElementRef, Input, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppState } from '../core/app-state';
import { UiIconComponent } from '../shared/components/ui-icon/ui-icon';
import { CITIES } from '../data/weather';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [FormsModule, RouterLink, UiIconComponent],
  template: `
    <header class="topbar">
      <div class="top-greet">
        <span class="hi">Hi, Kajal</span>
        <h1>{{ title() }}</h1>
      </div>

      <div class="top-actions">
        <div class="search-wrap">
          <div class="search-box">
            <app-ui-icon name="search" [size]="17" class="search-ic" />
            <input
              [(ngModel)]="q"
              (ngModelChange)="dropOpen.set(true)"
              (focus)="dropOpen.set(true)"
              (blur)="onBlur()"
              (keydown.escape)="closeSearch()"
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
                    <app-ui-icon name="pin" [size]="15" />
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
            <app-ui-icon name="sun" [size]="16" />
          </span>
          <span class="tt-opt" [class.on]="state.theme() === 'dark'">
            <app-ui-icon name="moon" [size]="16" />
          </span>
        </button>

        <div class="avatar-wrap" tabindex="-1" (focusout)="onWrapFocusOut($event)" (keydown.escape)="closeProfile()">
          <button
            class="avatar-btn"
            (click)="toggleProfile()"
            aria-haspopup="menu"
            [attr.aria-expanded]="profileOpen()"
            aria-label="Open profile menu"
          >
            <img src="https://i.pravatar.cc/64?img=47" alt="Kajal profile" width="40" height="40" referrerpolicy="no-referrer" />
            <app-ui-icon name="chevron-down" [size]="14" />
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
  private host = inject(ElementRef<HTMLElement>);
  @Input() heading = '';

  readonly q = signal('');
  readonly dropOpen = signal(false);
  readonly profileOpen = signal(false);

  readonly results = computed(() => {
    const needle = this.q().trim().toLowerCase();
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

  closeSearch(): void {
    this.dropOpen.set(false);
  }

  closeProfile(): void {
    this.profileOpen.set(false);
  }

  /**
   * Closes the profile menu only when focus truly leaves the menu container,
   * so keyboard users can Tab through menu items without it closing early.
   */
  onWrapFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!next || !this.host.nativeElement.contains(next)) {
      this.profileOpen.set(false);
    }
  }
}
