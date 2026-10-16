import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICON_PATHS, type IconName } from './icons';

/**
 * Shared stroke icon. One registry, one component — use everywhere instead
 * of pasting inline SVGs into feature templates.
 *
 * Usage: <app-ui-icon name="search" [size]="17" />
 */
@Component({
  selector: 'app-ui-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg
    [attr.width]="size"
    [attr.height]="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    [attr.stroke-width]="stroke"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    [innerHTML]="paths"
  ></svg>`,
})
export class UiIconComponent {
  private sanitizer = inject(DomSanitizer);

  /** Registry key — constrained to IconName so only known icons render. */
  @Input() name: IconName = 'help';
  /** Pixel size (width + height). */
  @Input() size = 16;
  /** Stroke width. */
  @Input() stroke = 2;

  /**
   * Static registry content only — never user input (see icons.ts).
   * bypassSecurityTrustHtml is safe here for the same reason Angular
   * Material trusts its own static SVG icon sets: the strings are
   * compile-time constants owned by this codebase, and the key type
   * (IconName) makes arbitrary markup unreachable.
   */
  get paths(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICON_PATHS[this.name]);
  }
}
