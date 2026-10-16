export interface HelpCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export interface HelpArticle {
  id: string;
  categoryId: string;
  title: string;
  body: string;
  tags: string[];
}

export const HELP_CATEGORIES: HelpCategory[] = [
  { id: 'getting-started', title: 'Getting Started', subtitle: 'Basics and setup', icon: 'rocket' },
  { id: 'forecasts', title: 'Weather & Forecasts', subtitle: 'Understanding forecasts', icon: 'cloud' },
  { id: 'map', title: 'Map & Layers', subtitle: 'Using the weather map', icon: 'map' },
  { id: 'notifications', title: 'Notifications', subtitle: 'Alerts and updates', icon: 'bell' },
  { id: 'settings', title: 'Settings', subtitle: 'Preferences and account', icon: 'settings' },
  { id: 'troubleshooting', title: 'Troubleshooting', subtitle: 'Common issues', icon: 'wrench' },
];

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: 'a1',
    categoryId: 'getting-started',
    title: 'How to change my location?',
    body: 'Use the search box in the top navigation to find a city, or go to Settings → Location to set a new default city. Your choice is saved in this browser (localStorage) and applied across Dashboard, Map and Calendar.',
    tags: ['location', 'search', 'city', 'default'],
  },
  {
    id: 'a2',
    categoryId: 'forecasts',
    title: 'What do the different weather icons mean?',
    body: 'Sunny means clear skies (UV may still be high). Partly cloudy is sun with intermittent cloud. Light rain is <2.5mm/hr, heavy rain is >7.5mm/hr, and thunderstorm includes lightning risk. Temperatures shown respect your °C/°F setting.',
    tags: ['icons', 'conditions', 'forecast'],
  },
  {
    id: 'a3',
    categoryId: 'settings',
    title: 'How to enable notifications?',
    body: 'Go to Settings → Notifications and toggle Severe weather alerts, Daily forecast summary, or Location-based alerts. Toggles are stored locally. This demo does not send real push notifications — the Notifications page shows sample alerts.',
    tags: ['notifications', 'alerts', 'enable'],
  },
  {
    id: 'a4',
    categoryId: 'forecasts',
    title: 'Why is the temperature different from my real location?',
    body: 'This frontend-only demo uses curated sample data rather than a live weather API, so values are illustrative and may differ from actual conditions. To connect live data, configure a weather provider (e.g. OpenWeatherMap) in the documented integration boundary without committing API keys.',
    tags: ['temperature', 'accuracy', 'sample', 'api'],
  },
  {
    id: 'a5',
    categoryId: 'map',
    title: 'How do map layers work?',
    body: 'Open Weather Map and choose Rain, Clouds, Wind or Temperature. The base map uses OpenStreetMap tiles (no key required). Overlays in this build are illustrative sample visualisations — e.g. rain blobs, wind arrows, temperature heat — so layer buttons visibly change the map without claiming live radar.',
    tags: ['map', 'layers', 'rain', 'wind', 'temperature'],
  },
  {
    id: 'a6',
    categoryId: 'map',
    title: 'The map is blank — what should I check?',
    body: 'Map tiles need network access to tile.openstreetmap.org. If offline, the info panel and hourly forecast still work. Try zoom controls or the recenter button, and disable aggressive ad-blockers for tile hosts.',
    tags: ['map', 'blank', 'tiles', 'offline'],
  },
  {
    id: 'a7',
    categoryId: 'notifications',
    title: 'How do I mark notifications as read?',
    body: 'Open Notifications, click a card to expand details (marks it read), or use the per-item toggle. "Mark all as read" clears the unread badge. Read state persists in localStorage.',
    tags: ['notifications', 'read', 'unread'],
  },
  {
    id: 'a8',
    categoryId: 'settings',
    title: 'How do units and themes work?',
    body: 'Settings → Units switches Celsius/Fahrenheit and updates every temperature display. Appearance switches dark/light theme across all pages. Both persist locally and can be reset to defaults.',
    tags: ['units', 'celsius', 'fahrenheit', 'theme', 'dark', 'light'],
  },
  {
    id: 'a9',
    categoryId: 'getting-started',
    title: 'Is my data sent to a server?',
    body: 'No. This is a frontend-only app. Preferences stay in your browser localStorage. Privacy & Data settings let you disable analytics-style flags; there is no backend account system in this build.',
    tags: ['privacy', 'data', 'localstorage'],
  },
  {
    id: 'a10',
    categoryId: 'troubleshooting',
    title: 'Layout looks broken on mobile — what to do?',
    body: 'The app is responsive: sidebar becomes a bottom bar under 900px and grids collapse to one column. If you see horizontal overflow, hard-refresh to clear cached CSS, and ensure viewport meta is present (it is in index.html).',
    tags: ['responsive', 'mobile', 'layout'],
  },
  {
    id: 'a11',
    categoryId: 'troubleshooting',
    title: 'Search shows no results',
    body: 'Search matches the 8 built-in sample cities (Dhaka, Canberra, Tokyo, London, New York, Paris, Sydney, Dubai). Other cities are not in the sample dataset — this is expected without a live geocoding API.',
    tags: ['search', 'no results', 'cities'],
  },
  {
    id: 'a12',
    categoryId: 'forecasts',
    title: 'What is chance of precipitation?',
    body: 'Chance of precipitation (PoP) is the likelihood of ≥0.2mm rain in the period. Calendar day details show PoP alongside wind and humidity from the sample generator.',
    tags: ['precipitation', 'chance', 'rain'],
  },
];

export const POPULAR_QUESTIONS: string[] = ['a1', 'a2', 'a3', 'a4'];
