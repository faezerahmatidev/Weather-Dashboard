import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopbarComponent } from '../components/topbar';
import { WeatherIconComponent } from '../components/weather-icon';
import { UiIconComponent } from '../shared/components/ui-icon/ui-icon';
import { TempPipe } from '../shared/pipes/temp.pipe';
import { AppState } from '../core/app-state';
import { CITIES, TEN_DAY } from '../data/weather';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TopbarComponent, WeatherIconComponent, UiIconComponent, TempPipe, RouterLink],
  template: `
    <div class="page">
      <app-topbar />
      <div class="dash-grid">
        <section class="card hero" aria-label="Current weather">
          <div class="hero-top">
            <span class="loc-pill">
              <app-ui-icon name="pin" [size]="14" />
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
                &deg;{{ state.units() }}
                <app-ui-icon name="chevron-down" [size]="12" [stroke]="2.4" />
              </button>
              @if (unitOpen()) {
                <div class="unit-menu" role="listbox" aria-label="Temperature unit">
                  <button role="option" [attr.aria-selected]="state.units() === 'C'" (mousedown)="setUnit('C')">&deg;C - Celsius</button>
                  <button role="option" [attr.aria-selected]="state.units() === 'F'" (mousedown)="setUnit('F')">&deg;F - Fahrenheit</button>
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
              <div class="big-temp">{{ city().tempC | appTemp }}</div>
              <div class="small-temp">/{{ city().minC | appTemp }}</div>
              <div class="cond">{{ city().conditionLabel }}</div>
              <div class="muted small">Feels like {{ city().feelsC | appTemp }}</div>
            </div>
          </div>
        </section>

        <section class="card highlights" aria-label="Today's highlight">
          <h2>Today's Highlight</h2>
          <div class="hl-grid">
            <div class="hl">
              <span class="hl-label">
                <app-ui-icon name="wind" [size]="15" [stroke]="1.8" />
                Wind Status
              </span>
              <strong>{{ city().windKmh.toFixed(2) }} <small>km/h</small></strong>
              <span class="muted small">{{ city().updatedAt }}</span>
            </div>
            <div class="hl">
              <span class="hl-label">
                <app-ui-icon name="drop" [size]="15" [stroke]="1.8" />
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
                <app-ui-icon name="sun" [size]="15" [stroke]="1.8" />
                UV Index
              </span>
              <strong>{{ city().uv }} <small>UV</small></strong>
              <span class="muted small">Moderate UV</span>
            </div>
            <div class="hl">
              <span class="hl-label">
                <app-ui-icon name="eye" [size]="15" [stroke]="1.8" />
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
              <app-ui-icon name="chevron-down" [size]="13" [stroke]="2.2" />
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
              <strong class="other-temp">{{ c.tempC | appTemp:'number' }}&deg;<small>/{{ c.minC | appTemp:'number' }}&deg;</small></strong>
            </div>
          }
        </section>

        <section class="card forecast" aria-label="10 day forecast">
          <h2>10 Day Forecast</h2>
          <div class="fc-strip" role="list">
            @for (d of days(); track $index) {
              <div class="fc-item" role="listitem" tabindex="0" [attr.aria-label]="d.day + ' ' + (d.tempC | appTemp)">
                <span class="muted small">{{ d.day }}</span>
                <span class="fc-line" aria-hidden="true"></span>
                <app-weather-icon [condition]="d.condition" [size]="56" />
                <strong>{{ d.tempC | appTemp }}</strong>
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
  /** Alias to the store's current-city signal (single source of truth). */
  readonly city = this.state.currentCity;
  readonly others = computed(() => CITIES.filter((c) => c.id !== this.state.cityId()).slice(0, 2));
  readonly days = computed(() => TEN_DAY);
  readonly unitOpen = signal(false);

  readonly dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  readonly dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

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

