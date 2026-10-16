import { Component, computed, inject } from '@angular/core';
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
            <span class="unit-pill" [attr.aria-label]="unitLabel()">
              �{{ state.units() }}
            </span>
          </div>
          <h2 class="hero-day">{{ dayName }}</h2>
          <p class="muted">{{ dateStr }}</p>
          <div class="hero-mid">
            <div class="hero-cloud" aria-hidden="true">
              <app-weather-icon [condition]="city().condition" [size]="110" />
            </div>
            <div class="hero-temp">
              <div class="big-temp">{{ fmt(city().tempC) }}</div>
              <div class="small-temp">/{{ fmt(city().minC) }}</div>
              <div class="cond">{{ city().conditionLabel }}</div>
              <div class="muted small">Feels like {{ fmt(city().feelsC) }}</div>
            </div>
          </div>
          <p class="sample-note">Sample data � no live API connected.</p>
        </section>

        <section class="card highlights" aria-label="Today's highlight">
          <h2>Today's Highlight</h2>
          <div class="hl-grid">
            <div class="hl">
              <span class="hl-label">Wind Status</span>
              <strong>{{ city().windKmh.toFixed(2) }} <small>km/h</small></strong>
              <span class="muted small">{{ city().updatedAt }}</span>
            </div>
            <div class="hl">
              <span class="hl-label">Humidity</span>
              <strong>{{ city().humidity }} <small>%</small></strong>
              <span class="muted small">Humidity is good</span>
            </div>
            <div class="hl wide">
              <span class="hl-sun-t">
                <span class="muted small">Sunrise</span>
                <strong>{{ city().sunrise }}</strong>
              </span>
            </div>
            <div class="hl">
              <span class="hl-label">UV Index</span>
              <strong>{{ city().uv }} <small>UV</small></strong>
              <span class="muted small">Moderate UV</span>
            </div>
            <div class="hl">
              <span class="hl-label">Visibility</span>
              <strong>{{ city().visibilityKm }} <small>km</small></strong>
              <span class="muted small">{{ city().updatedAt }}</span>
            </div>
            <div class="hl wide">
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
            <a routerLink="/weather-map" class="see-all">See All</a>
          </div>
          @for (c of others(); track c.id) {
            <div class="other-row">
              <div>
                <div class="muted small">{{ c.country }}</div>
                <strong>{{ c.name }}</strong>
                <div class="muted small">{{ c.conditionLabel }}</div>
              </div>
              <app-weather-icon [condition]="c.condition" [size]="44" />
              <strong class="other-temp">{{ disp(c.tempC) }}�<small>/{{ disp(c.minC) }}�</small></strong>
            </div>
          }
        </section>

        <section class="card forecast" aria-label="10 day forecast">
          <h2>10 Day Forecast</h2>
          <div class="fc-strip" role="list">
            @for (d of first5(); track $index) {
              <div class="fc-item" role="listitem" tabindex="0" [attr.aria-label]="d.day + ' ' + fmt(d.tempC)">
                <span class="muted small">{{ d.day }}</span>
                <span class="fc-line" aria-hidden="true"></span>
                <app-weather-icon [condition]="d.condition" [size]="40" />
                <strong>{{ fmt(d.tempC) }}</strong>
              </div>
            }
          </div>
          <div class="fc-strip second" role="list" aria-label="Extended forecast">
            @for (d of last5(); track $index) {
              <div class="fc-item" role="listitem" tabindex="0" [attr.aria-label]="d.day + ' ' + fmt(d.tempC)">
                <span class="muted small">{{ d.day }}</span>
                <span class="fc-line" aria-hidden="true"></span>
                <app-weather-icon [condition]="d.condition" [size]="40" />
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
  readonly first5 = computed(() => TEN_DAY.slice(0, 5));
  readonly last5 = computed(() => TEN_DAY.slice(5));

  readonly dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  readonly dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  fmt(c: number): string {
    return this.state.formatTemp(c);
  }
  unitLabel(): string {
    return this.state.units() === 'C' ? 'Temperature unit Celsius' : 'Temperature unit Fahrenheit';
  }
  disp(c: number): number {
    return this.state.toDisplayTemp(c);
  }
}

