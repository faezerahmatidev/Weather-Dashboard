import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopbarComponent } from '../components/topbar';
import { WeatherIconComponent } from '../components/weather-icon';
import { AppState } from '../core/app-state';
import { CITIES, getCity, TEN_DAY } from '../data/weather';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TopbarComponent, WeatherIconComponent, RouterLink],
  template: `
    <div class="page">
      <app-topbar />
      <div class="dash-grid">
        <section class="card hero" aria-label="Current weather">
          <div class="hero-top">
            <span class="loc-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
              {{ city().label }}
            </span>
            <div class="unit-menu-wrap">
              <button
                class="unit-pill"
                (click)="toggleUnit()"
                (blur)="closeUnit()"
                aria-haspopup="listbox"
                [attr.aria-expanded]="unitOpen()"
                [attr.aria-label]="'Temperature unit, currently ' + unitLabel()"
              >
                �{{ state.units() }}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              @if (unitOpen()) {
                <div class="unit-menu" role="listbox" aria-label="Temperature unit">
                  <button role="option" [attr.aria-selected]="state.units() === 'C'" (mousedown)="setUnit('C')">�C � Celsius</button>
                  <button role="option" [attr.aria-selected]="state.units() === 'F'" (mousedown)="setUnit('F')">�F � Fahrenheit</button>
                </div>
              }
            </div>
          </div>
          <h2 class="hero-day">{{ dayName }}</h2>
          <p class="muted hero-date">{{ dateStr }}</p>
          <div class="hero-mid">
            <div class="hero-cloud" aria-hidden="true">
              <app-weather-icon [condition]="city().condition" [size]="148" />
            </div>
            <div class="hero-temp">
              <div class="big-temp">{{ fmt(city().tempC) }}</div>
              <div class="small-temp">/{{ fmt(city().minC) }}</div>
              <div class="cond">{{ city().conditionLabel }}</div>
              <div class="muted small">Feels like {{ fmt(city().feelsC) }}</div>
            </div>
          </div>
        </section>

        <section class="card highlights" aria-label="Today's highlight">
          <h2>Today's Highlight</h2>
          <div class="hl-grid">
            <div class="hl">
              <span class="hl-label">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 8h9a3 3 0 1 0-3-3M3 12h13a3 3 0 1 1-3 3M3 16h6"/></svg>
                Wind Status
              </span>
              <strong>{{ city().windKmh.toFixed(2) }} <small>km/h</small></strong>
              <span class="muted small">{{ city().updatedAt }}</span>
            </div>
            <div class="hl">
              <span class="hl-label">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3c3.5 4.5 6 7.8 6 11a6 6 0 0 1-12 0c0-3.2 2.5-6.5 6-11z"/></svg>
                Humidity
              </span>
              <strong>{{ city().humidity }} <small>%</small></strong>
              <span class="muted small">Humidity is good</span>
            </div>
            <div class="hl wide">
              <app-weather-icon condition="sunrise" [size]="64" />
              <span class="hl-sun-t">
                <span class="muted small">Sunrise</span>
                <strong>{{ city().sunrise }}</strong>
              </span>
            </div>
            <div class="hl">
              <span class="hl-label">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
                UV Index
              </span>
              <strong>{{ city().uv }} <small>UV</small></strong>
              <span class="muted small">Moderate UV</span>
            </div>
            <div class="hl">
              <span class="hl-label">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.5"/></svg>
                Visibility
              </span>
              <strong>{{ city().visibilityKm }} <small>km</small></strong>
              <span class="muted small">{{ city().updatedAt }}</span>
            </div>
            <div class="hl wide">
              <app-weather-icon condition="sunset" [size]="64" />
              <span class="hl-sun-t">
                <span class="muted small">Sunset</span>
                <strong>{{ city().sunset }}</strong>
              </span>
            </div>
          </div>
        </section>

        <section class="card others" aria-label="Other countries">
          <div class="row-between">
            <h2>Others Countries</h2>
            <a routerLink="/weather-map" class="see-all">
              See All
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
            </a>
          </div>
          @for (c of others(); track c.id) {
            <div class="other-row">
              <div>
                <div class="muted small">{{ c.country }}</div>
                <strong>{{ c.name }}</strong>
                <div class="muted small">{{ c.conditionLabel }}</div>
              </div>
              <app-weather-icon [condition]="c.condition" [size]="56" />
              <strong class="other-temp">{{ disp(c.tempC) }}�<small>/{{ disp(c.minC) }}�</small></strong>
            </div>
          }
        </section>

        <section class="card forecast" aria-label="10 day forecast">
          <h2>10 Day Forecast</h2>
          <div class="fc-strip" role="list">
            @for (d of days(); track $index) {
              <div class="fc-item" role="listitem" tabindex="0" [attr.aria-label]="d.day + ' ' + fmt(d.tempC)">
                <span class="muted small">{{ d.day }}</span>
                <span class="fc-line" aria-hidden="true"></span>
                <app-weather-icon [condition]="d.condition" [size]="56" />
                <strong>{{ fmt(d.tempC) }}</strong>
              </div>
            }
          </div>
          <p class="sample-note">10-day outlook uses sample data.</p>
        </section>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  state = inject(AppState);
  readonly city = computed(() => getCity(this.state.cityId()));
  readonly others = computed(() => CITIES.filter((c) => c.id !== this.state.cityId()).slice(0, 2));
  readonly days = computed(() => TEN_DAY);
  readonly unitOpen = signal(false);

  readonly dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  readonly dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  fmt(c: number): string {
    return this.state.formatTemp(c);
  }
  disp(c: number): number {
    return this.state.toDisplayTemp(c);
  }
  unitLabel(): string {
    return this.state.units() === 'C' ? 'Celsius' : 'Fahrenheit';
  }
  setUnit(u: 'C' | 'F'): void {
    this.state.setUnits(u);
    this.unitOpen.set(false);
  }
  toggleUnit(): void {
    this.unitOpen.update((v) => !v);
  }
  closeUnit(): void {
    setTimeout(() => this.unitOpen.set(false), 120);
  }
}

