import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TopbarComponent } from '../components/topbar';
import { AppState } from '../core/app-state';
import { CITIES } from '../data/weather';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [TopbarComponent, FormsModule],
  template: `
    <div class="page">
      <app-topbar heading="Settings" />
      <div class="set-grid">
        <section class="card" aria-label="Temperature units">
          <h3>Units</h3>
          <p class="muted small">Choose your preferred measurement units</p>
          <div class="seg" role="radiogroup" aria-label="Temperature units">
            <button role="radio" [attr.aria-checked]="state.units() === 'C'" class="seg-btn" [class.active]="state.units() === 'C'" (click)="state.setUnits('C')">&deg;C (Celsius)</button>
            <button role="radio" [attr.aria-checked]="state.units() === 'F'" class="seg-btn" [class.active]="state.units() === 'F'" (click)="state.setUnits('F')">&deg;F (Fahrenheit)</button>
          </div>
        </section>

        <section class="card" aria-label="Location settings">
          <h3>Location</h3>
          <p class="muted small">Default location for weather data</p>
          <div class="loc-current">{{ state.currentCity().label }}</div>
          <label class="fld">
            <span>Change location</span>
            <select [ngModel]="state.cityId()" (ngModelChange)="state.setCityId($event)" aria-label="Default city">
              @for (c of cities; track c.id) {
                <option [value]="c.id">{{ c.label }}</option>
              }
            </select>
          </label>
          <p class="muted small">Current: {{ state.currentCity().name }} - applied to Dashboard, Map and Calendar.</p>
        </section>

        <section class="card" aria-label="Appearance">
          <h3>Appearance</h3>
          <p class="muted small">Choose your theme</p>
          <div class="seg" role="radiogroup" aria-label="Appearance">
            <button role="radio" [attr.aria-checked]="state.theme() === 'dark'" class="seg-btn" [class.active]="state.theme() === 'dark'" (click)="state.setTheme('dark')">Dark</button>
            <button role="radio" [attr.aria-checked]="state.theme() === 'light'" class="seg-btn" [class.active]="state.theme() === 'light'" (click)="state.setTheme('light')">Light</button>
          </div>
        </section>

        <section class="card" aria-label="Notification preferences">
          <h3>Notifications</h3>
          <p class="muted small">Get alerts for weather changes</p>
          <div class="toggle-row">
            <span>Severe weather alerts</span>
            <button role="switch" [attr.aria-checked]="state.notifPrefs().severe" [attr.aria-label]="'Severe weather alerts'" class="switch" [class.on]="state.notifPrefs().severe" (click)="toggleNotif('severe')"><span class="knob" aria-hidden="true"></span></button>
          </div>
          <div class="toggle-row">
            <span>Daily forecast summary</span>
            <button role="switch" [attr.aria-checked]="state.notifPrefs().daily" [attr.aria-label]="'Daily forecast summary'" class="switch" [class.on]="state.notifPrefs().daily" (click)="toggleNotif('daily')"><span class="knob" aria-hidden="true"></span></button>
          </div>
          <div class="toggle-row">
            <span>Location-based alerts</span>
            <button role="switch" [attr.aria-checked]="state.notifPrefs().locationBased" [attr.aria-label]="'Location-based alerts'" class="switch" [class.on]="state.notifPrefs().locationBased" (click)="toggleNotif('locationBased')"><span class="knob" aria-hidden="true"></span></button>
          </div>
          <p class="muted small">Demo only ? no real push notifications are sent.</p>
        </section>

        <section class="card" aria-label="Language">
          <h3>Language</h3>
          <p class="muted small">Select your preferred language</p>
          <label class="fld">
            <span>Language</span>
            <select [ngModel]="state.language()" (ngModelChange)="state.setLanguage($event)" aria-label="Language">
              <option value="en">English</option>
              <option value="en-demo" disabled>More languages coming soon</option>
            </select>
          </label>
          <p class="muted small">Only English is fully supported in this build.</p>
        </section>

        <section class="card" aria-label="Privacy and data">
          <h3>Privacy &amp; Data</h3>
          <p class="muted small">Manage your data and privacy settings</p>
          <div class="toggle-row">
            <span>Share anonymous usage analytics</span>
            <button role="switch" [attr.aria-checked]="state.privacy().analytics" aria-label="Share anonymous usage analytics" class="switch" [class.on]="state.privacy().analytics" (click)="togglePrivacy('analytics')"><span class="knob" aria-hidden="true"></span></button>
          </div>
          <div class="toggle-row">
            <span>Allow location sharing</span>
            <button role="switch" [attr.aria-checked]="state.privacy().locationSharing" aria-label="Allow location sharing" class="switch" [class.on]="state.privacy().locationSharing" (click)="togglePrivacy('locationSharing')"><span class="knob" aria-hidden="true"></span></button>
          </div>
          <div class="toggle-row">
            <span>Personalized weather tips</span>
            <button role="switch" [attr.aria-checked]="state.privacy().personalizedTips" aria-label="Personalized weather tips" class="switch" [class.on]="state.privacy().personalizedTips" (click)="togglePrivacy('personalizedTips')"><span class="knob" aria-hidden="true"></span></button>
          </div>
          <p class="muted small">Frontend-only: preferences stay in this browser. No backend account exists.</p>
        </section>
      </div>

      <div class="reset-row">
        <button class="btn" (click)="state.resetDefaults()">Restore defaults</button>
      </div>
    </div>
  `,
})
export class SettingsComponent {
  state = inject(AppState);
  readonly cities = CITIES;

  toggleNotif(key: 'severe' | 'daily' | 'locationBased'): void {
    const p = this.state.notifPrefs();
    this.state.setNotifPrefs({ ...p, [key]: !p[key] });
  }

  togglePrivacy(key: 'analytics' | 'locationSharing' | 'personalizedTips'): void {
    const p = this.state.privacy();
    this.state.setPrivacy({ ...p, [key]: !p[key] });
  }
}


