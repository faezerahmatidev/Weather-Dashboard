export type NotifCategory = 'alert' | 'warning' | 'info';

export interface NotificationItem {
  id: string;
  category: NotifCategory;
  severity: 'severe' | 'warning' | 'info';
  severityLabel: string;
  title: string;
  message: string;
  detail: string;
  timeAgo: string;
  timestamp: string;
  location: string;
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    category: 'alert',
    severity: 'severe',
    severityLabel: 'Severe',
    title: 'Severe Weather Alert',
    message: 'Heavy rain expected in your area tomorrow.',
    detail:
      'The meteorological service has issued a severe weather alert for Dhaka and surrounding districts. Expect 40–70mm of rainfall between 12:00 PM and 6:00 PM tomorrow, with possible waterlogging in low-lying areas. Avoid unnecessary travel and secure outdoor items.',
    timeAgo: '2h ago',
    timestamp: 'Today, 10:24 AM',
    location: 'Dhaka, Bangladesh',
  },
  {
    id: 'n2',
    category: 'warning',
    severity: 'warning',
    severityLabel: 'Warning',
    title: 'Wind Advisory',
    message: 'Strong winds (40–60 km/h) expected this evening.',
    detail:
      'A wind advisory is in effect from 6:00 PM to 11:00 PM. Gusts of 40–60 km/h may affect high-rise areas and river crossings. Secure loose objects on balconies and be cautious when driving.',
    timeAgo: '4h ago',
    timestamp: 'Today, 8:10 AM',
    location: 'Dhaka, Bangladesh',
  },
  {
    id: 'n3',
    category: 'info',
    severity: 'info',
    severityLabel: 'Info',
    title: 'Weather Update',
    message: 'Temperature will drop by 6°C this weekend.',
    detail:
      'A cooler air mass will move in over the weekend. Daytime highs will fall from 32°C to around 26°C with increased cloud cover. No severe conditions are expected — sample forecast data.',
    timeAgo: '8h ago',
    timestamp: 'Today, 4:02 AM',
    location: 'Dhaka, Bangladesh',
  },
  {
    id: 'n4',
    category: 'warning',
    severity: 'warning',
    severityLabel: 'Warning',
    title: 'Rain Alert',
    message: 'Moderate rain expected in your area later today.',
    detail:
      'Moderate rain (5–15mm) is expected between 3:00 PM and 7:00 PM. Carry an umbrella and allow extra travel time. Drainage systems should cope under normal conditions.',
    timeAgo: '12h ago',
    timestamp: 'Yesterday, 11:48 PM',
    location: 'Dhaka, Bangladesh',
  },
  {
    id: 'n5',
    category: 'info',
    severity: 'info',
    severityLabel: 'Info',
    title: 'New Forecast Available',
    message: 'Updated hourly forecast for your location.',
    detail:
      'The 10-day outlook for your saved locations has been refreshed with sample data. No live radar feed is connected — values shown are illustrative for UI demonstration.',
    timeAgo: '1d ago',
    timestamp: 'Yesterday, 9:15 AM',
    location: 'All saved locations',
  },
  {
    id: 'n6',
    category: 'alert',
    severity: 'severe',
    severityLabel: 'Severe',
    title: 'Thunderstorm Watch',
    message: 'Isolated thunderstorms possible Wednesday afternoon.',
    detail:
      'Atmospheric instability may trigger isolated thunderstorms on Wednesday between 2:00 PM and 6:00 PM with lightning and brief heavy downpours. Unplug sensitive electronics during active cells.',
    timeAgo: '2d ago',
    timestamp: '2 days ago, 3:40 PM',
    location: 'Dhaka region',
  },
  {
    id: 'n7',
    category: 'info',
    severity: 'info',
    severityLabel: 'Info',
    title: 'Daily Forecast Summary',
    message: 'Today: Heavy rain, high 28°C, low 24°C.',
    detail:
      'Sample daily summary: expect heavy rain early, easing to cloud in the evening. Humidity 85%, wind 7.9 km/h, UV index 4 (moderate). Sunrise 4:50 AM, sunset 6:45 PM.',
    timeAgo: '2d ago',
    timestamp: '2 days ago, 7:00 AM',
    location: 'Dhaka, Bangladesh',
  },
];

export const DEFAULT_READ = new Set<string>(['n5', 'n7']);
