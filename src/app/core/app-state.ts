import { Injectable, computed, effect, signal } from '@angular/core';

export type Theme = 'dark' | 'light';
export type Units = 'C' | 'F';

export interface NotifPrefs {
  severe: boolean;
  daily: boolean;
  locationBased: boolean;
}

export interface PrivacyPrefs {
  analytics: boolean;
  locationSharing: boolean;
  personalizedTips: boolean;
}

function readLS(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

@Injectable({ providedIn: 'root' })
export class AppState {
  readonly theme = signal<Theme>(readLS('wd-theme', 'dark') === 'light' ? 'light' : 'dark');
  readonly units = signal<Units>(readLS('wd-units', 'C') === 'F' ? 'F' : 'C');
  readonly cityId = signal<string>(readLS('wd-city', 'dhaka'));
  readonly notifPrefs = signal<NotifPrefs>(
    readJSON<NotifPrefs>('wd-notif-prefs', { severe: true, daily: true, locationBased: false }),
  );
  readonly language = signal<string>(readLS('wd-lang', 'en'));
  readonly privacy = signal<PrivacyPrefs>(
    readJSON<PrivacyPrefs>('wd-privacy', {
      analytics: false,
      locationSharing: true,
      personalizedTips: true,
    }),
  );
  readonly readMap = signal<Record<string, boolean>>(readJSON('wd-notif-read', {}));

  readonly unitSymbol = computed(() => (this.units() === 'C' ? '°C' : '°F'));

  constructor() {
    effect(() => {
      const t = this.theme();
      document.documentElement.setAttribute('data-theme', t);
      try {
        localStorage.setItem('wd-theme', t);
      } catch {
        /* ignore */
      }
    });
    effect(() => {
      try {
        localStorage.setItem('wd-units', this.units());
      } catch {
        /* ignore */
      }
    });
    effect(() => {
      try {
        localStorage.setItem('wd-city', this.cityId());
      } catch {
        /* ignore */
      }
    });
    effect(() => {
      try {
        localStorage.setItem('wd-notif-prefs', JSON.stringify(this.notifPrefs()));
      } catch {
        /* ignore */
      }
    });
    effect(() => {
      try {
        localStorage.setItem('wd-lang', this.language());
      } catch {
        /* ignore */
      }
    });
    effect(() => {
      try {
        localStorage.setItem('wd-privacy', JSON.stringify(this.privacy()));
      } catch {
        /* ignore */
      }
    });
    effect(() => {
      try {
        localStorage.setItem('wd-notif-read', JSON.stringify(this.readMap()));
      } catch {
        /* ignore */
      }
      // reduced-motion class (set once + on change)
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      document.documentElement.classList.toggle('reduce-motion', mq.matches);
    });
  }

  setTheme(t: Theme): void {
    this.theme.set(t);
  }

  toggleTheme(): void {
    this.theme.update((v) => (v === 'dark' ? 'light' : 'dark'));
  }

  setUnits(u: Units): void {
    this.units.set(u);
  }

  setCityId(id: string): void {
    this.cityId.set(id);
  }

  setNotifPrefs(p: NotifPrefs): void {
    this.notifPrefs.set(p);
  }

  setLanguage(l: string): void {
    this.language.set(l);
  }

  setPrivacy(p: PrivacyPrefs): void {
    this.privacy.set(p);
  }

  markRead(id: string): void {
    this.readMap.update((m) => ({ ...m, [id]: true }));
  }

  markUnread(id: string): void {
    this.readMap.update((m) => ({ ...m, [id]: false }));
  }

  markAllRead(ids: string[]): void {
    this.readMap.update((m) => {
      const next = { ...m };
      ids.forEach((id) => {
        next[id] = true;
      });
      return next;
    });
  }

  resetDefaults(): void {
    this.theme.set('dark');
    this.units.set('C');
    this.cityId.set('dhaka');
    this.notifPrefs.set({ severe: true, daily: true, locationBased: false });
    this.language.set('en');
    this.privacy.set({ analytics: false, locationSharing: true, personalizedTips: true });
  }

  toDisplayTemp(celsius: number): number {
    return this.units() === 'C' ? Math.round(celsius) : Math.round((celsius * 9) / 5 + 32);
  }

  formatTemp(celsius: number): string {
    return `${this.toDisplayTemp(celsius)}°${this.units()}`;
  }
}
