export type Condition =
  | 'heavy-rain'
  | 'light-rain'
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'storm'
  | 'clear-night';

export interface City {
  id: string;
  name: string;
  country: string;
  label: string;
  lat: number;
  lon: number;
  tempC: number;
  feelsC: number;
  minC: number;
  condition: Condition;
  conditionLabel: string;
  humidity: number;
  windKmh: number;
  uv: number;
  visibilityKm: number;
  sunrise: string;
  sunset: string;
  precipChance: number;
  updatedAt: string;
}

export interface HourlyPoint {
  time: string;
  tempC: number;
  condition: Condition;
}

export interface DayForecast {
  day: string;
  tempC: number;
  condition: Condition;
}

export const CITIES: City[] = [
  {
    id: 'dhaka',
    name: 'Dhaka',
    country: 'Bangladesh',
    label: 'Dhaka, Bangladesh',
    lat: 23.8103,
    lon: 90.4125,
    tempC: 28,
    feelsC: 31,
    minC: 24,
    condition: 'heavy-rain',
    conditionLabel: 'Heavy Rain',
    humidity: 85,
    windKmh: 7.9,
    uv: 4,
    visibilityKm: 5,
    sunrise: '4:50 AM',
    sunset: '6:45 PM',
    precipChance: 82,
    updatedAt: '9:00 AM',
  },
  {
    id: 'canberra',
    name: 'Canberra',
    country: 'Australia',
    label: 'Canberra, Australia',
    lat: -35.2809,
    lon: 149.13,
    tempC: 32,
    feelsC: 33,
    minC: 24,
    condition: 'sunny',
    conditionLabel: 'Sunny',
    humidity: 38,
    windKmh: 12.4,
    uv: 8,
    visibilityKm: 12,
    sunrise: '6:05 AM',
    sunset: '8:10 PM',
    precipChance: 4,
    updatedAt: '9:00 AM',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    label: 'Tokyo, Japan',
    lat: 35.6762,
    lon: 139.6503,
    tempC: 30,
    feelsC: 32,
    minC: 19,
    condition: 'partly-cloudy',
    conditionLabel: 'Mostly Sunny',
    humidity: 55,
    windKmh: 9.6,
    uv: 6,
    visibilityKm: 10,
    sunrise: '5:28 AM',
    sunset: '6:32 PM',
    precipChance: 12,
    updatedAt: '9:00 AM',
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    label: 'London, United Kingdom',
    lat: 51.5074,
    lon: -0.1278,
    tempC: 18,
    feelsC: 17,
    minC: 13,
    condition: 'light-rain',
    conditionLabel: 'Light Rain',
    humidity: 78,
    windKmh: 14.2,
    uv: 2,
    visibilityKm: 7,
    sunrise: '6:42 AM',
    sunset: '7:35 PM',
    precipChance: 64,
    updatedAt: '9:00 AM',
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    label: 'New York, United States',
    lat: 40.7128,
    lon: -74.006,
    tempC: 26,
    feelsC: 28,
    minC: 21,
    condition: 'partly-cloudy',
    conditionLabel: 'Partly Cloudy',
    humidity: 62,
    windKmh: 11.1,
    uv: 5,
    visibilityKm: 11,
    sunrise: '6:15 AM',
    sunset: '7:28 PM',
    precipChance: 18,
    updatedAt: '9:00 AM',
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    label: 'Paris, France',
    lat: 48.8566,
    lon: 2.3522,
    tempC: 22,
    feelsC: 23,
    minC: 16,
    condition: 'sunny',
    conditionLabel: 'Sunny',
    humidity: 48,
    windKmh: 8.3,
    uv: 6,
    visibilityKm: 12,
    sunrise: '7:02 AM',
    sunset: '8:12 PM',
    precipChance: 6,
    updatedAt: '9:00 AM',
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    label: 'Sydney, Australia',
    lat: -33.8688,
    lon: 151.2093,
    tempC: 24,
    feelsC: 25,
    minC: 19,
    condition: 'cloudy',
    conditionLabel: 'Cloudy',
    humidity: 66,
    windKmh: 16.8,
    uv: 4,
    visibilityKm: 9,
    sunrise: '6:32 AM',
    sunset: '5:48 PM',
    precipChance: 28,
    updatedAt: '9:00 AM',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    label: 'Dubai, UAE',
    lat: 25.2048,
    lon: 55.2708,
    tempC: 38,
    feelsC: 41,
    minC: 31,
    condition: 'sunny',
    conditionLabel: 'Sunny',
    humidity: 30,
    windKmh: 18.5,
    uv: 10,
    visibilityKm: 8,
    sunrise: '5:55 AM',
    sunset: '6:55 PM',
    precipChance: 0,
    updatedAt: '9:00 AM',
  },
];

export function getCity(id: string): City {
  return CITIES.find((c) => c.id === id) ?? CITIES[0];
}

export const HOURLY_BY_CITY: Record<string, HourlyPoint[]> = {
  dhaka: [
    { time: '3 PM', tempC: 28, condition: 'heavy-rain' },
    { time: '6 PM', tempC: 27, condition: 'light-rain' },
    { time: '9 PM', tempC: 26, condition: 'cloudy' },
    { time: '12 AM', tempC: 25, condition: 'partly-cloudy' },
    { time: '3 AM', tempC: 25, condition: 'cloudy' },
    { time: '6 AM', tempC: 26, condition: 'partly-cloudy' },
  ],
  default: [
    { time: '3 PM', tempC: 27, condition: 'partly-cloudy' },
    { time: '6 PM', tempC: 25, condition: 'cloudy' },
    { time: '9 PM', tempC: 23, condition: 'cloudy' },
    { time: '12 AM', tempC: 21, condition: 'clear-night' },
    { time: '3 AM', tempC: 20, condition: 'clear-night' },
    { time: '6 AM', tempC: 21, condition: 'partly-cloudy' },
  ],
};

export function hourlyFor(cityId: string): HourlyPoint[] {
  return HOURLY_BY_CITY[cityId] ?? HOURLY_BY_CITY['default'];
}

export const TEN_DAY: DayForecast[] = [
  { day: 'Today', tempC: 28, condition: 'heavy-rain' },
  { day: 'Mon', tempC: 31, condition: 'partly-cloudy' },
  { day: 'Tue', tempC: 27, condition: 'heavy-rain' },
  { day: 'Wed', tempC: 29, condition: 'storm' },
  { day: 'Thu', tempC: 32, condition: 'partly-cloudy' },
  { day: 'Fri', tempC: 30, condition: 'sunny' },
  { day: 'Sat', tempC: 29, condition: 'light-rain' },
  { day: 'Sun', tempC: 28, condition: 'cloudy' },
  { day: 'Mon', tempC: 31, condition: 'sunny' },
  { day: 'Tue', tempC: 30, condition: 'partly-cloudy' },
];

export interface CalendarDay {
  dateISO: string;
  dayNum: number;
  inMonth: boolean;
  condition: Condition;
  maxC: number;
  minC: number;
  precip: number;
  windKmh: number;
  humidity: number;
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const CONDITIONS: Condition[] = ['sunny', 'partly-cloudy', 'cloudy', 'light-rain', 'heavy-rain', 'storm'];

export function buildMonth(year: number, monthIndex: number): CalendarDay[] {
  const first = new Date(year, monthIndex, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysPrevMonth = new Date(year, monthIndex, 0).getDate();
  const cells: CalendarDay[] = [];

  for (let i = 0; i < 42; i++) {
    const dayOffset = i - startDay + 1;
    let d: Date;
    let inMonth = true;
    if (dayOffset < 1) {
      d = new Date(year, monthIndex - 1, daysPrevMonth + dayOffset);
      inMonth = false;
    } else if (dayOffset > daysInMonth) {
      d = new Date(year, monthIndex + 1, dayOffset - daysInMonth);
      inMonth = false;
    } else {
      d = new Date(year, monthIndex, dayOffset);
    }
    const iso =
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0');
    const seed = hashSeed(iso);
    const cond = CONDITIONS[seed % CONDITIONS.length];
    const maxC = 24 + (seed % 12);
    const minC = maxC - 5 - (seed % 5);
    cells.push({
      dateISO: iso,
      dayNum: d.getDate(),
      inMonth,
      condition: cond,
      maxC,
      minC,
      precip: seed % 100,
      windKmh: Math.round(((seed % 220) / 10) * 10) / 10,
      humidity: 40 + (seed % 55),
    });
  }
  return cells;
}

export function conditionLabel(c: Condition): string {
  switch (c) {
    case 'heavy-rain':
      return 'Heavy Rain';
    case 'light-rain':
      return 'Light Rain';
    case 'sunny':
      return 'Sunny';
    case 'partly-cloudy':
      return 'Partly Cloudy';
    case 'cloudy':
      return 'Cloudy';
    case 'storm':
      return 'Thunderstorm';
    case 'clear-night':
      return 'Clear Night';
    default:
      return c;
  }
}
