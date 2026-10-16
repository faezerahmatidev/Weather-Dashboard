# Weather Dashboard (Angular)

Dark-mode, frontend-only, multi-page weather dashboard built with **Angular 20**
(standalone components, signals, lazy-loaded routes, Angular Router) + Leaflet.

**Live demo:** https://faezerahmatidev.github.io/Weather-Dashboard/
(deployed from `main` via the GitHub Pages workflow in `.github/workflows/`).

## Pages / routes

- Dashboard — `/dashboard`
- Weather Map — `/weather-map`
- Calendar — `/calendar`
- Notifications — `/notifications`
- Settings — `/settings`
- Help Center — `/help`

Unknown routes redirect to `/dashboard`.

## Prerequisites

- Node.js 20.19+, 22.12+ or 24 (developed with Node 24)
- npm 10+ (lockfile: `package-lock.json`)

## Run

```bash
npm install
npm start        # http://localhost:4200 (dev server with HMR-style reload)
npm run build    # production build -> dist/weather-dashboard/
npm run lint     # ESLint over src/**/*.ts and inline templates
```

No test runner is wired to CI: Karma/Jasmine dev dependencies exist from the
Angular scaffold, but no spec files are committed and the suite requires a
Chrome binary, which is not available in this environment.

## Architecture

- `src/app/app.routes.ts` — all feature routes are **lazy-loaded** via
  `loadComponent`; the Leaflet map bundle (~157KB) only loads on `/weather-map`.
- `src/app/core/app-state.ts` — root-provided signal store. Theme, units, city,
  notification/privacy preferences and read-state persist in `localStorage`
  (keys `wd-*`, non-sensitive UI preferences only). Also mirrors the OS
  `prefers-reduced-motion` setting onto `<html>`.
- `src/app/data/` — curated **sample data** (cities, notifications, help articles,
  deterministic calendar generator). No live API is connected.
- `src/app/components/` — shared shell: floating sidebar, topbar
  (search/theme/profile), gradient SVG weather illustrations.
- Client-side rendering only — no SSR, no prerendering, no backend.

## Production notes
- Initial bundle ≈ 311KB raw (≈ 85KB transfer); budget warnings at 600KB / error 1MB.
- `ng build` emits a known warning that `leaflet` is not ESM. This is an upstream
  packaging fact (leaflet 1.9 ships CJS); it is intentionally left visible rather
  than suppressed, and the library is isolated in the lazy map chunk.
- SPA fallback: any static host must rewrite unknown paths to `index.html` for
  deep links (e.g. `/calendar`) to work on refresh. On GitHub Pages this is
  handled by shipping a copy of `index.html` as `404.html` (see the deploy
  workflow) plus `--base-href=/Weather-Dashboard/.
- Demo deployment: pushes to `main` trigger `.github/workflows/deploy.yml`
  (lint → production build → GitHub Pages). Requires one-time repo setup:
  Settings → Pages → Source: **GitHub Actions**.
- Security headers (CSP, HSTS, framing, referrer) must be configured at the
  hosting/CDN layer — they cannot be enforced from inside the Angular bundle.
  The app itself renders no unsanitized HTML, embeds no secrets, and only contacts
  `tile.openstreetmap.org` (map tiles) and `i.pravatar.cc` (avatar image) over HTTPS.

## Known limitations

- All weather values are **sample data** — not live conditions.
- Map overlays are illustrative visualisations, clearly labelled — not live radar.
- No real push notifications, accounts, or backend of any kind.
- Only English is fully supported in the Settings language selector.
