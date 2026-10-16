# Weather Dashboard (Angular)

Dark-mode, frontend-only, multi-page weather dashboard built with **Angular 20**
(standalone components, signals, Angular Router) + Leaflet.

## Pages / routes

- Dashboard — `/dashboard`
- Weather Map — `/weather-map`
- Calendar — `/calendar`
- Notifications — `/notifications`
- Settings — `/settings`
- Help Center — `/help`

## Run

```bash
npm install
npm start        # http://localhost:4200
npm run build    # production build -> dist/
```

## Notes

- All weather values are **curated sample data** (`src/app/data/`). No live API is connected.
- Map base tiles: OpenStreetMap (no key). Layer overlays (rain/clouds/wind/temp)
  are **illustrative sample visualisations**, clearly labelled in the legend — not live radar.
- Preferences (theme, units, city, notification prefs, privacy, read state)
  persist in `localStorage` (keys `wd-*`) via the `AppState` signal store.
- No backend, no secrets in source.
