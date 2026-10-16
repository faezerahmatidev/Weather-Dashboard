import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Condition } from '../data/weather';

@Component({
  selector: 'app-weather-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="w-icon w-{{ condition }}" [style.width.px]="size" [style.height.px]="size" aria-hidden="true" [ngSwitch]="condition">
      <svg *ngSwitchCase="'sunny'" [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.9" stroke="none"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      <svg *ngSwitchCase="'partly-cloudy'" [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.85" stroke="none"/><path d="M8 2v1.5M2 8h1.5M4 4l1 1M12 4l-1 1M7 17.5A3.5 3.5 0 0 1 7.3 10.6 4.5 4.5 0 0 1 16 12a3 3 0 0 1-.5 5.9H7z" /></svg>
      <svg *ngSwitchCase="'cloudy'" [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 18.5A3.5 3.5 0 0 1 7.3 11.6 4.5 4.5 0 0 1 16 13a3 3 0 0 1-.5 5.9H7z"/></svg>
      <svg *ngSwitchCase="'light-rain'" [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 15.5A3.5 3.5 0 0 1 7.3 8.6 4.5 4.5 0 0 1 16 10a3 3 0 0 1-.5 5.9H7z"/><path d="M8 18v2M12 18v2M16 18v2"/></svg>
      <svg *ngSwitchCase="'heavy-rain'" [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 14.5A3.5 3.5 0 0 1 7.3 7.6 4.5 4.5 0 0 1 16 9a3 3 0 0 1-.5 5.9H7z"/><path d="M7 17v3M11 17v3M15 17v3M19 17v2"/></svg>
      <svg *ngSwitchCase="'storm'" [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 13.5A3.5 3.5 0 0 1 7.3 6.6 4.5 4.5 0 0 1 16 8a3 3 0 0 1-.5 5.9H7z"/><path d="M12 13l-2.5 4H12l-1 4 4.5-6H13l1.5-2z" fill="currentColor"/></svg>
      <svg *ngSwitchDefault [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 13.5A8 8 0 1 1 10.5 4 6.5 6.5 0 0 0 20 13.5z"/></svg>
    </span>
  `,
})
export class WeatherIconComponent {
  @Input() condition: Condition = 'cloudy';
  @Input() size = 40;
}
