import { Component, computed, inject, signal } from '@angular/core';
import { TopbarComponent } from '../components/topbar';
import { WeatherIconComponent } from '../components/weather-icon';
import { AppState } from '../core/app-state';
import { buildMonth, conditionLabel } from '../data/weather';

const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function isoOf(d: Date): string {
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export function fmtISO(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [TopbarComponent, WeatherIconComponent],
  template: `
    <div class="page">
      <app-topbar heading="Calendar" />
      <div class="cal-layout">
        <section class="card cal-card" aria-label="Monthly weather calendar">
          <div class="cal-head">
            <button (click)="prev()" aria-label="Previous month" class="icon-btn">‹</button>
            <h2 aria-live="polite">{{ monthName() }} {{ year() }}</h2>
            <button (click)="next()" aria-label="Next month" class="icon-btn">›</button>
          </div>
          <div class="cal-week" role="row">
            @for (w of week; track w) {
              <span role="columnheader">{{ w }}</span>
            }
          </div>
          <div class="cal-grid" role="grid" [attr.aria-label]="monthName() + ' ' + year() + ' weather calendar'">
            @for (c of cells(); track c.dateISO) {
              <button
                role="gridcell"
                [attr.aria-selected]="c.dateISO === selected()"
                [attr.aria-label]="c.dateISO + ' ' + label(c.condition) + ' ' + disp(c.maxC) + ' degrees max ' + disp(c.minC) + ' min'"
                class="cal-cell"
                [class.out]="!c.inMonth"
                [class.sel]="c.dateISO === selected()"
                [class.today]="c.dateISO === todayISO"
                (click)="selected.set(c.dateISO)"
                (keydown.arrowRight)="step($event, c.dateISO, 1)"
                (keydown.arrowLeft)="step($event, c.dateISO, -1)"
                [id]="'cal-' + c.dateISO"
              >
                <span class="cell-day">{{ c.dayNum }}</span>
                <app-weather-icon [condition]="c.condition" [size]="20" />
                <span class="cell-t">{{ disp(c.maxC) }}°/{{ disp(c.minC) }}°</span>
              </button>
            }
          </div>
          <p class="sample-note">Monthly outlook uses deterministic sample data.</p>
        </section>

        <aside class="cal-side">
          <section class="card day-card" aria-live="polite" aria-label="Selected day details">
            @if (active(); as a) {
              <h3>{{ fmtDate(a.dateISO) }}</h3>
              <div class="day-top">
                <app-weather-icon [condition]="a.condition" [size]="52" />
                <div>
                  <strong class="day-temp">{{ fmt(a.maxC) }}/{{ fmt(a.minC) }}</strong>
                  <div class="muted">{{ label(a.condition) }}</div>
                </div>
              </div>
              <dl class="day-stats">
                <div><dt>Wind</dt><dd>{{ a.windKmh }} km/h</dd></div>
                <div><dt>Humidity</dt><dd>{{ a.humidity }}%</dd></div>
                <div><dt>Precipitation</dt><dd>{{ a.precip }}%</dd></div>
              </dl>
            } @else {
              <p class="muted">Select a date to see details.</p>
            }
          </section>

          <section class="card events-card" aria-label="Upcoming weather events">
            <h3>Upcoming Weather Events</h3>
            @if (upcoming().length === 0) {
              <p class="muted">No severe events in the visible range (sample data).</p>
            } @else {
              @for (e of upcoming(); track e.dateISO) {
                <div class="event-row" tabindex="0">
                  <span class="muted small">{{ e.tag }}</span>
                  <app-weather-icon [condition]="e.condition" [size]="28" />
                  <span>
                    <strong>{{ e.title }}</strong>
                    <span class="muted small block">{{ e.precip }}% chance · {{ e.windKmh }} km/h</span>
                  </span>
                </div>
              }
            }
          </section>
        </aside>
      </div>
    </div>
  `,
})
export class CalendarComponent {
  state = inject(AppState);
  readonly week = WEEK;
  readonly year = signal(new Date().getFullYear());
  readonly month = signal(new Date().getMonth());
  readonly selected = signal(isoOf(new Date()));
  readonly todayISO = isoOf(new Date());

  readonly cells = computed(() => buildMonth(this.year(), this.month()));
  readonly monthName = computed(() => MONTHS[this.month()]);

  readonly active = computed(() => {
    const sel = this.selected();
    const inView = this.cells().find((c) => c.dateISO === sel);
    if (inView) return inView;
    const [yy, mm] = sel.split('-').map(Number);
    return buildMonth(yy, mm - 1).find((c) => c.dateISO === sel) ?? null;
  });

  readonly upcoming = computed(() => {
    const sel = this.selected();
    return this.cells()
      .filter((c) => c.inMonth && c.dateISO > sel && (c.precip > 60 || c.condition === 'storm'))
      .slice(0, 3)
      .map((c) => {
        const [, mm, dd] = c.dateISO.split('-').map(Number);
        const shortMon = new Date(2000, mm - 1, 1).toLocaleDateString('en-US', { month: 'short' });
        return {
          ...c,
          tag: `${shortMon} ${dd}`,
          title: c.precip > 75 ? 'Heavy Rain' : c.condition === 'storm' ? 'Thunderstorm' : 'Rain Likely',
        };
      });
  });

  prev(): void {
    if (this.month() === 0) {
      this.month.set(11);
      this.year.update((y) => y - 1);
    } else {
      this.month.update((m) => m - 1);
    }
  }

  next(): void {
    if (this.month() === 11) {
      this.month.set(0);
      this.year.update((y) => y + 1);
    } else {
      this.month.update((m) => m + 1);
    }
  }

  step(e: Event, iso: string, dir: 1 | -1): void {
    e.preventDefault();
    const cells = this.cells();
    const idx = cells.findIndex((c) => c.dateISO === iso);
    const n = cells[idx + dir];
    if (n) {
      this.selected.set(n.dateISO);
      document.getElementById('cal-' + n.dateISO)?.focus();
    }
  }

  label(c: Parameters<typeof conditionLabel>[0]): string {
    return conditionLabel(c);
  }
  fmt(c: number): string {
    return this.state.formatTemp(c);
  }
  disp(c: number): number {
    return this.state.toDisplayTemp(c);
  }
  fmtDate(iso: string): string {
    return fmtISO(iso);
  }
}

