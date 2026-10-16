import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { TopbarComponent } from '../components/topbar';
import { WeatherIconComponent } from '../components/weather-icon';
import { UiIconComponent } from '../shared/components/ui-icon/ui-icon';
import { TempPipe } from '../shared/pipes/temp.pipe';
import { AppState } from '../core/app-state';
import { CITIES, hourlyFor } from '../data/weather';

type LayerKey = 'rain' | 'clouds' | 'wind' | 'temp';

const LAYER_INFO: Record<LayerKey, string> = {
  rain: 'Sample precipitation visualisation - not live radar.',
  clouds: 'Sample cloud-cover visualisation - not live satellite.',
  wind: 'Sample wind-field visualisation - not live observations.',
  temp: 'Sample temperature heat visualisation - not live analysis.',
};

const LAYER_LABEL: Record<LayerKey, string> = {
  rain: 'Rain',
  clouds: 'Clouds',
  wind: 'Wind',
  temp: 'Temperature',
};

function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

@Component({
  selector: 'app-weather-map',
  standalone: true,
  imports: [TopbarComponent, WeatherIconComponent, UiIconComponent, TempPipe, FormsModule],
  template: `
    <div class="page">
      <app-topbar heading="Weather Map" />
      <div class="map-layout">
        <section class="card map-card" aria-label="Interactive weather map">
          <div class="layer-bar" role="group" aria-label="Map layers">
            @for (l of layers; track l) {
              <button [attr.aria-pressed]="layer() === l" class="layer-btn" [class.active]="layer() === l" (click)="layer.set(l)">
                {{ labels[l] }}
              </button>
            }
          </div>

          <div class="map-wrap">
            <div #mapEl class="leaflet-host" role="application" [attr.aria-label]="'Map centered on ' + city().label"></div>
            @if (loading()) {
              <div class="map-loading" role="status" aria-live="polite">
                <span class="spinner" aria-hidden="true"></span>
                Loading map tiles...
              </div>
            }
            <div class="map-controls">
              <button (click)="zoom(1)" aria-label="Zoom in" class="map-btn"><app-ui-icon name="plus" [size]="16" [stroke]="2.2" /></button>
              <button (click)="zoom(-1)" aria-label="Zoom out" class="map-btn"><app-ui-icon name="minus" [size]="16" [stroke]="2.2" /></button>
              <button (click)="recenter()" aria-label="Return to selected location" class="map-btn"><app-ui-icon name="crosshair" [size]="16" /></button>
            </div>
            <div class="map-legend" aria-label="Layer legend">
              <strong>{{ labels[layer()] }}</strong>
              <span>{{ info[layer()] }}</span>
            </div>
          </div>

          <div class="city-select-row">
            <label for="map-city">Location</label>
            <select id="map-city" [ngModel]="state.cityId()" (ngModelChange)="state.setCityId($event)" aria-label="Select city for map">
              @for (c of cities; track c.id) {
                <option [value]="c.id">{{ c.label }}</option>
              }
            </select>
          </div>
        </section>

        <aside class="map-side">
          <section class="card place-card" aria-label="Selected location weather">
            <span class="loc-pill sm">{{ city().label }}</span>
            <div class="place-row">
              <div>
                <app-weather-icon [condition]="city().condition" [size]="56" />
                <div class="cond sm">{{ city().conditionLabel }}</div>
                <div class="muted small">Feels like {{ city().feelsC | appTemp }}</div>
              </div>
              <div class="place-temp">
                <strong>{{ city().tempC | appTemp }}</strong>
                <span class="muted">/{{ city().minC | appTemp }}</span>
              </div>
            </div>
            <dl class="mini-stats">
              <div><dt>Wind</dt><dd>{{ city().windKmh }} km/h</dd></div>
              <div><dt>Humidity</dt><dd>{{ city().humidity }}%</dd></div>
              <div><dt>UV Index</dt><dd>{{ city().uv }}</dd></div>
            </dl>
          </section>

          <section class="card hours-card" aria-label="Upcoming hours">
            <h3>Next Hours</h3>
            <div class="hours-grid">
              @for (h of hours(); track h.time) {
                <div class="hour-cell" tabindex="0" [attr.aria-label]="h.time + ' ' + (h.tempC | appTemp)">
                  <span class="muted small">{{ h.time }}</span>
                  <app-weather-icon [condition]="h.condition" [size]="30" />
                  <strong>{{ h.tempC | appTemp }}</strong>
                </div>
              }
            </div>
          </section>
        </aside>
      </div>
    </div>
  `,
})
export class WeatherMapComponent implements AfterViewInit, OnDestroy {
  state = inject(AppState);
  readonly cities = CITIES;
  readonly layers: LayerKey[] = ['rain', 'clouds', 'wind', 'temp'];
  readonly labels = LAYER_LABEL;
  readonly info = LAYER_INFO;
  readonly layer = signal<LayerKey>('rain');
  readonly loading = signal(true);

  readonly city = this.state.currentCity;
  readonly hours = computed(() => hourlyFor(this.state.cityId()).slice(0, 4));

  @ViewChild('mapEl', { static: true }) mapEl!: ElementRef<HTMLDivElement>;
  private map: L.Map | null = null;
  private overlay: L.LayerGroup | null = null;
  private marker: L.Marker | null = null;

  constructor() {
    effect(() => {
      const city = this.city();
      if (this.map) this.moveTo(city.lat, city.lon, city.name);
    });
    effect(() => {
      const layer = this.layer();
      const city = this.city();
      if (this.map && this.overlay) this.drawOverlay(layer, city.lat, city.lon);
    });
  }

  ngAfterViewInit(): void {
    const city = this.city();
    const map = L.map(this.mapEl.nativeElement, {
      zoomControl: false,
      scrollWheelZoom: true,
    }).setView([city.lat, city.lon], 9);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    this.overlay = L.layerGroup().addTo(map);
    this.map = map;
    this.moveTo(city.lat, city.lon, city.name);
    this.drawOverlay(this.layer(), city.lat, city.lon);
    setTimeout(() => this.loading.set(false), 600);
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }

  private moveTo(lat: number, lon: number, name: string): void {
    const map = this.map;
    if (!map) return;
    map.flyTo([lat, lon], 9, { duration: 0.8 });
    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }
    const icon = L.divIcon({
      className: 'city-pin',
      html: `<div class="pin-dot"></div><div class="pin-label">${name}</div>`,
      iconSize: [90, 40],
      iconAnchor: [45, 20],
    });
    this.marker = L.marker([lat, lon], { icon }).addTo(map);
  }

  private drawOverlay(layer: LayerKey, lat: number, lon: number): void {
    const group = this.overlay;
    if (!group) return;
    group.clearLayers();
    const rand = seededRand(Math.round(lat * 100 + lon * 100 + layer.length * 777));
    const palettes: Record<LayerKey, string[]> = {
      rain: ['#22c55e', '#84cc16', '#eab308'],
      clouds: ['#94a3b8', '#cbd5e1', '#64748b'],
      wind: ['#38bdf8', '#0ea5e9', '#0284c7'],
      temp: ['#fbbf24', '#f97316', '#ef4444'],
    };
    const pal = palettes[layer];
    for (let i = 0; i < 26; i++) {
      const dLat = (rand() - 0.5) * 1.6;
      const dLon = (rand() - 0.5) * 1.6;
      const c = pal[Math.floor(rand() * pal.length)];
      if (layer === 'wind') {
        const arrow = rand() > 0.5 ? '?' : '?';
        const icon = L.divIcon({
          className: 'wind-arrow',
          html: `<span style="color:${c}">${arrow}</span>`,
          iconSize: [22, 22],
        });
        L.marker([lat + dLat, lon + dLon], { icon, interactive: false }).addTo(group);
      } else {
        L.circle([lat + dLat, lon + dLon], {
          radius: 8000 + rand() * 26000,
          color: c,
          weight: 0,
          fillColor: c,
          fillOpacity: layer === 'rain' ? 0.45 : 0.35,
          interactive: false,
        }).addTo(group);
      }
    }
    L.circle([lat, lon], {
      radius: 12000,
      color: '#3b82f6',
      weight: 2,
      dashArray: '6 6',
      fillOpacity: 0.06,
      interactive: false,
    }).addTo(group);
  }

  zoom(dir: 1 | -1): void {
    if (!this.map) return;
    if (dir === 1) this.map.zoomIn();
    else this.map.zoomOut();
  }

  recenter(): void {
    const c = this.city();
    this.map?.flyTo([c.lat, c.lon], 9, { duration: 0.8 });
  }
}

