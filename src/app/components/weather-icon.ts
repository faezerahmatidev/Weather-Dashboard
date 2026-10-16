import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Condition } from '../data/weather';

export type IconKind = Condition | 'sunrise' | 'sunset';

let uidCounter = 0;

/**
 * Rich gradient weather illustrations matching the Figma 3D icon style
 * (puffy clouds, glossy sun, rain drops, lightning, sun-path).
 * Vector-only: scales cleanly at any size.
 */
@Component({
  selector: 'app-weather-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="w-icon w-{{ condition }}" [style.width.px]="size" [style.height.px]="size" aria-hidden="true">
      @switch (condition) {
        @case ('sunny') {
          <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 64 64">
            <defs>
              <radialGradient [id]="gid + '-sun'" cx="50%" cy="42%" r="62%">
                <stop offset="0%" stop-color="#FFE9A8" />
                <stop offset="55%" stop-color="#FFC93C" />
                <stop offset="100%" stop-color="#FF9E2C" />
              </radialGradient>
            </defs>
            <g stroke="#FFB636" stroke-width="3.4" stroke-linecap="round">
              <line x1="32" y1="4" x2="32" y2="10" />
              <line x1="32" y1="54" x2="32" y2="60" />
              <line x1="4" y1="32" x2="10" y2="32" />
              <line x1="54" y1="32" x2="60" y2="32" />
              <line x1="12" y1="12" x2="16.2" y2="16.2" />
              <line x1="47.8" y1="47.8" x2="52" y2="52" />
              <line x1="52" y1="12" x2="47.8" y2="16.2" />
              <line x1="16.2" y1="47.8" x2="12" y2="52" />
            </g>
            <circle cx="32" cy="32" r="13.5" [attr.fill]="'url(#' + gid + '-sun)'" />
            <ellipse cx="27.5" cy="27.5" rx="4.5" ry="3" fill="#FFF7E0" opacity="0.7" />
          </svg>
        }
        @case ('partly-cloudy') {
          <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 64 64">
            <defs>
              <radialGradient [id]="gid + '-psun'" cx="50%" cy="42%" r="62%">
                <stop offset="0%" stop-color="#FFE9A8" />
                <stop offset="55%" stop-color="#FFC93C" />
                <stop offset="100%" stop-color="#FF9E2C" />
              </radialGradient>
              <linearGradient [id]="gid + '-pcloud'" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#FFFFFF" />
                <stop offset="100%" stop-color="#C3CEDF" />
              </linearGradient>
            </defs>
            <g stroke="#FFB636" stroke-width="3" stroke-linecap="round">
              <line x1="20" y1="5" x2="20" y2="10" />
              <line x1="6" y1="19" x2="10.5" y2="19" />
              <line x1="10" y1="9" x2="13" y2="12" />
              <line x1="30" y1="9" x2="27" y2="12" />
            </g>
            <circle cx="20" cy="21" r="10" [attr.fill]="'url(#' + gid + '-psun)'" />
            <g [attr.fill]="'url(#' + gid + '-pcloud)'">
              <ellipse cx="30" cy="43" rx="12" ry="8.5" />
              <ellipse cx="41" cy="38" rx="11" ry="10" />
              <ellipse cx="50" cy="44" rx="8.5" ry="7" />
              <rect x="20" y="40" width="36" height="10" rx="5" />
            </g>
            <ellipse cx="36" cy="47.5" rx="13" ry="3" fill="#9AA7BD" opacity="0.45" />
          </svg>
        }
        @case ('cloudy') {
          <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 64 64">
            <defs>
              <linearGradient [id]="gid + '-cloud'" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#FFFFFF" />
                <stop offset="100%" stop-color="#B7C2D6" />
              </linearGradient>
              <linearGradient [id]="gid + '-cloud2'" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#F1F5FA" />
                <stop offset="100%" stop-color="#9AA7BD" />
              </linearGradient>
            </defs>
            <g [attr.fill]="'url(#' + gid + '-cloud2)'" opacity="0.85">
              <ellipse cx="22" cy="24" rx="10" ry="7" />
              <ellipse cx="31" cy="20" rx="9" ry="8" />
            </g>
            <g [attr.fill]="'url(#' + gid + '-cloud)'">
              <ellipse cx="24" cy="42" rx="13" ry="9.5" />
              <ellipse cx="37" cy="36" rx="12.5" ry="11" />
              <ellipse cx="48" cy="43" rx="9.5" ry="7.5" />
              <rect x="13" y="39" width="42" height="11" rx="5.5" />
            </g>
            <ellipse cx="27" cy="32" rx="7" ry="4" fill="#FFFFFF" opacity="0.8" />
          </svg>
        }
        @case ('light-rain') {
          <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 64 64">
            <defs>
              <linearGradient [id]="gid + '-lcloud'" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#FFFFFF" />
                <stop offset="100%" stop-color="#B7C2D6" />
              </linearGradient>
              <linearGradient [id]="gid + '-ldrop'" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#9ADCFF" />
                <stop offset="100%" stop-color="#1D9BF0" />
              </linearGradient>
            </defs>
            <g [attr.fill]="'url(#' + gid + '-lcloud)'">
              <ellipse cx="24" cy="26" rx="12" ry="9" />
              <ellipse cx="36" cy="20" rx="12" ry="10.5" />
              <ellipse cx="47" cy="27" rx="9" ry="7" />
              <rect x="14" y="23" width="40" height="10" rx="5" />
            </g>
            <g [attr.fill]="'url(#' + gid + '-ldrop)'">
              <path d="M22 38c2.6 3.4 2.8 5.2 0 7.4-2.8-2.2-2.6-4 0-7.4z" />
              <path d="M32 38c2.6 3.4 2.8 5.2 0 7.4-2.8-2.2-2.6-4 0-7.4z" />
              <path d="M42 38c2.6 3.4 2.8 5.2 0 7.4-2.8-2.2-2.6-4 0-7.4z" />
              <path d="M27 48c2.2 2.9 2.4 4.4 0 6.3-2.4-1.9-2.2-3.4 0-6.3z" />
              <path d="M37 48c2.2 2.9 2.4 4.4 0 6.3-2.4-1.9-2.2-3.4 0-6.3z" />
            </g>
          </svg>
        }
        @case ('heavy-rain') {
          <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 64 64">
            <defs>
              <linearGradient [id]="gid + '-hcloud'" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#FFFFFF" />
                <stop offset="100%" stop-color="#AEB9CF" />
              </linearGradient>
              <linearGradient [id]="gid + '-hdrop'" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#8FD6FF" />
                <stop offset="100%" stop-color="#0B84D6" />
              </linearGradient>
            </defs>
            <g [attr.fill]="'url(#' + gid + '-hcloud)'">
              <ellipse cx="22" cy="22" rx="13" ry="10" />
              <ellipse cx="36" cy="16" rx="13" ry="11.5" />
              <ellipse cx="48" cy="23" rx="9.5" ry="7.5" />
              <rect x="11" y="19" width="44" height="11" rx="5.5" />
            </g>
            <ellipse cx="28" cy="14" rx="8" ry="4.5" fill="#FFFFFF" opacity="0.85" />
            <g [attr.fill]="'url(#' + gid + '-hdrop)'">
              <path d="M16 34c2.8 3.6 3 5.6 0 8-3-2.4-2.8-4.4 0-8z" />
              <path d="M26 34c2.8 3.6 3 5.6 0 8-3-2.4-2.8-4.4 0-8z" />
              <path d="M36 34c2.8 3.6 3 5.6 0 8-3-2.4-2.8-4.4 0-8z" />
              <path d="M46 34c2.8 3.6 3 5.6 0 8-3-2.4-2.8-4.4 0-8z" />
              <path d="M21 44c2.4 3.1 2.6 4.8 0 6.9-2.6-2.1-2.4-3.8 0-6.9z" />
              <path d="M31 44c2.4 3.1 2.6 4.8 0 6.9-2.6-2.1-2.4-3.8 0-6.9z" />
              <path d="M41 44c2.4 3.1 2.6 4.8 0 6.9-2.6-2.1-2.4-3.8 0-6.9z" />
              <path d="M26 53c2 2.6 2.2 4 0 5.8-2.2-1.8-2-3.2 0-5.8z" />
              <path d="M36 53c2 2.6 2.2 4 0 5.8-2.2-1.8-2-3.2 0-5.8z" />
            </g>
          </svg>
        }
        @case ('storm') {
          <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 64 64">
            <defs>
              <linearGradient [id]="gid + '-scloud'" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#FFFFFF" />
                <stop offset="100%" stop-color="#AEB9CF" />
              </linearGradient>
              <linearGradient [id]="gid + '-bolt'" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#FFE45C" />
                <stop offset="100%" stop-color="#FF9E2C" />
              </linearGradient>
              <linearGradient [id]="gid + '-sdrop'" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#8FD6FF" />
                <stop offset="100%" stop-color="#0B84D6" />
              </linearGradient>
            </defs>
            <g [attr.fill]="'url(#' + gid + '-scloud)'">
              <ellipse cx="22" cy="22" rx="13" ry="10" />
              <ellipse cx="36" cy="16" rx="13" ry="11.5" />
              <ellipse cx="48" cy="23" rx="9.5" ry="7.5" />
              <rect x="11" y="19" width="44" height="11" rx="5.5" />
            </g>
            <path
              d="M35 30 L26 44 H32 L29.5 56 L41 40 H34 L37.5 30 Z"
              [attr.fill]="'url(#' + gid + '-bolt)'"
              stroke="#B45309"
              stroke-width="1"
              stroke-linejoin="round"
            />
            <g [attr.fill]="'url(#' + gid + '-sdrop)'">
              <path d="M16 36c2.4 3.1 2.6 4.8 0 6.9-2.6-2.1-2.4-3.8 0-6.9z" />
              <path d="M48 36c2.4 3.1 2.6 4.8 0 6.9-2.6-2.1-2.4-3.8 0-6.9z" />
              <path d="M20 46c2 2.6 2.2 4 0 5.8-2.2-1.8-2-3.2 0-5.8z" />
              <path d="M44 46c2 2.6 2.2 4 0 5.8-2.2-1.8-2-3.2 0-5.8z" />
            </g>
          </svg>
        }
        @case ('clear-night') {
          <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 64 64">
            <defs>
              <linearGradient [id]="gid + '-moon'" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#FFFBEA" />
                <stop offset="100%" stop-color="#D8CF9F" />
              </linearGradient>
            </defs>
            <g fill="#FFF7D6">
              <circle cx="48" cy="12" r="1.6" />
              <circle cx="54" cy="26" r="1.2" />
              <circle cx="14" cy="52" r="1.4" />
            </g>
            <path
              d="M40 6 A23 23 0 1 0 58 34 A18 18 0 1 1 40 6 Z"
              [attr.fill]="'url(#' + gid + '-moon)'"
            />
          </svg>
        }
        @case ('sunrise') {
          <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 64 64">
            <defs>
              <radialGradient [id]="gid + '-rsun'" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stop-color="#FFE9A8" />
                <stop offset="55%" stop-color="#FFC93C" />
                <stop offset="100%" stop-color="#FF9E2C" />
              </radialGradient>
            </defs>
            <g stroke="#FFB636" stroke-width="2.6" stroke-linecap="round">
              <line x1="32" y1="6" x2="32" y2="11" />
              <line x1="14" y1="14" x2="17.5" y2="17.5" />
              <line x1="50" y1="14" x2="46.5" y2="17.5" />
              <line x1="8" y1="28" x2="13" y2="28" />
              <line x1="51" y1="28" x2="56" y2="28" />
            </g>
            <circle cx="32" cy="30" r="11" [attr.fill]="'url(#' + gid + '-rsun)'" />
            <g stroke="#38BDF8" stroke-width="2.6" stroke-linecap="round" fill="none">
              <line x1="14" y1="48" x2="26" y2="48" />
              <line x1="38" y1="48" x2="50" y2="48" />
              <line x1="20" y1="54" x2="44" y2="54" />
            </g>
            <g stroke="#0EA5E9" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none">
              <line x1="32" y1="40" x2="32" y2="24" />
              <path d="M26.5 29.5 L32 24 L37.5 29.5" />
            </g>
          </svg>
        }
        @case ('sunset') {
          <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 64 64">
            <defs>
              <radialGradient [id]="gid + '-ssun'" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stop-color="#FFE9A8" />
                <stop offset="55%" stop-color="#FFC93C" />
                <stop offset="100%" stop-color="#FF9E2C" />
              </radialGradient>
            </defs>
            <g stroke="#FFB636" stroke-width="2.6" stroke-linecap="round">
              <line x1="32" y1="6" x2="32" y2="11" />
              <line x1="14" y1="14" x2="17.5" y2="17.5" />
              <line x1="50" y1="14" x2="46.5" y2="17.5" />
              <line x1="8" y1="28" x2="13" y2="28" />
              <line x1="51" y1="28" x2="56" y2="28" />
            </g>
            <circle cx="32" cy="30" r="11" [attr.fill]="'url(#' + gid + '-ssun)'" />
            <g stroke="#38BDF8" stroke-width="2.6" stroke-linecap="round" fill="none">
              <line x1="14" y1="48" x2="26" y2="48" />
              <line x1="38" y1="48" x2="50" y2="48" />
              <line x1="20" y1="54" x2="44" y2="54" />
            </g>
            <g stroke="#0EA5E9" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none">
              <line x1="32" y1="24" x2="32" y2="40" />
              <path d="M26.5 34.5 L32 40 L37.5 34.5" />
            </g>
          </svg>
        }
        @default {
          <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 64 64">
            <defs>
              <linearGradient [id]="gid + '-dcloud'" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#FFFFFF" />
                <stop offset="100%" stop-color="#B7C2D6" />
              </linearGradient>
            </defs>
            <g [attr.fill]="'url(#' + gid + '-dcloud)'">
              <ellipse cx="24" cy="36" rx="13" ry="9.5" />
              <ellipse cx="37" cy="30" rx="12.5" ry="11" />
              <ellipse cx="48" cy="37" rx="9.5" ry="7.5" />
              <rect x="13" y="33" width="42" height="11" rx="5.5" />
            </g>
          </svg>
        }
      }
    </span>
  `,
})
export class WeatherIconComponent {
  @Input() condition: IconKind = 'cloudy';
  @Input() size = 40;
  readonly gid = `wi${++uidCounter}`;
}
