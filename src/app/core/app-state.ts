import { Injectable, computed, effect, signal } from '@angular/core';
import { getCity } from '../data/weather';
import { DEFAULT_READ, NOTIFICATIONS } from '../data/notifications';

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

  /** Currently selected city — single source of truth for all pages. */
  readonly currentCity = computed(() => getCity(this.cityId()));

  /** Number of unread sample notifications (single source of truth). */
  readonly unreadNotifications = computed(
    () => NOTIFICATIONS.filter((n) => !this.isNotificationRead(n.id)).length,
  );

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
    });
    this.initReducedMotion();
  }

  /**
   * Mirrors the OS reduced-motion preference onto <html>.
   * Runs once (not inside a reactive effect) and follows live changes.
   * CSR-only: this app has no SSR/prerendering by design.
   */
  private initReducedMotion(): void {
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const apply = (): void => {
        document.documentElement.classList.toggle('reduce-motion', mq.matches);
      };
      apply();
      mq.addEventListener('change', apply);
    } catch {
      /* ignore: non-browser or restricted environment */
    }
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

  /**
   * Whether a notification counts as read. Ids absent from readMap fall back
   * to the curated DEFAULT_READ set so the badge and the list page agree.
   */
  isNotificationRead(id: string): boolean {
    const m = this.readMap();
    if (id in m) return m[id] === true;
    return DEFAULT_READ.has(id);
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
