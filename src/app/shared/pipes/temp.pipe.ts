import { Pipe, PipeTransform, inject } from '@angular/core';
import { AppState } from '../../core/app-state';

/**
 * Shared temperature pipe — single source of truth for unit-aware display.
 * Replaces per-component fmt()/disp() wrappers.
 *
 * Usage: {{ city.tempC | appTemp }}        -> "28°C" / "82°F"
 *        {{ city.tempC | appTemp:'number' }}&deg; -> "28°" (for composed layouts)
 *
 * Impure by design: output depends on the global units preference in AppState,
 * not only on the numeric argument, so it must re-evaluate on every check.
 * Cost is one arithmetic op + string concat per usage — negligible.
 */
@Pipe({ name: 'appTemp', standalone: true, pure: false })
export class TempPipe implements PipeTransform {
  private state = inject(AppState);

  transform(celsius: number, style: 'full' | 'number' = 'full'): string | number {
    return style === 'full' ? this.state.formatTemp(celsius) : this.state.toDisplayTemp(celsius);
  }
}
