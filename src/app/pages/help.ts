import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TopbarComponent } from '../components/topbar';
import { HELP_ARTICLES, HELP_CATEGORIES, POPULAR_QUESTIONS } from '../data/help';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [TopbarComponent, FormsModule, RouterLink],
  template: `
    <div class="page">
      <app-topbar heading="Help Center" />
      <section class="card help-hero" aria-label="Help center intro">
        <h2>Help Center</h2>
        <p class="muted">Answers about forecasts, map layers, alerts and settings.</p>
        <div class="search-box full">
          <svg width="17" height="17" class="search-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input
            [ngModel]="q()"
            (ngModelChange)="q.set($event)"
            placeholder="Search for help articles…"
            aria-label="Search for help articles"
          />
        </div>
      </section>

      <section aria-label="Browse by category">
        <h3 class="sec-title">Browse by Category</h3>
        <div class="cat-grid">
          @for (c of categories; track c.id) {
            <button
              class="cat-card"
              [class.active]="cat() === c.id"
              (click)="cat.set(cat() === c.id ? null : c.id)"
              [attr.aria-pressed]="cat() === c.id"
              [attr.aria-label]="'Filter by ' + c.title"
            >
              <strong>{{ c.title }}</strong>
              <span class="muted small">{{ c.subtitle }}</span>
            </button>
          }
        </div>
      </section>

      <div class="help-cols">
        <section class="card" aria-label="Help articles">
          <h3>{{ catTitle() }} ({{ filtered().length }})</h3>
          @if (filtered().length === 0) {
            <div class="empty" role="status">
              <strong>No results for “{{ q() }}”</strong>
              <p class="muted">Try “location”, “map layers”, “units” or clear filters.</p>
              <button class="btn sm" (click)="clear()">Clear search</button>
            </div>
          } @else {
            <ul class="article-list">
              @for (a of filtered(); track a.id) {
                <li>
                  <button class="acc-head" [class.open]="open() === a.id" [attr.aria-expanded]="open() === a.id" (click)="open.set(open() === a.id ? null : a.id)">
                    <span>{{ a.title }}</span>
                    <span aria-hidden="true" [class.rot]="open() === a.id">?</span>
                  </button>
                  @if (open() === a.id) {
                    <p class="acc-body">{{ a.body }}</p>
                  }
                </li>
              }
            </ul>
          }
        </section>

        <div class="help-side">
          <section class="card" aria-label="Popular questions">
            <h3>Popular Questions</h3>
            <ul class="pop-list">
              @for (a of popular; track a.id) {
                <li>
                  <button (click)="goPopular(a.id)">{{ a.title }} <span aria-hidden="true">›</span></button>
                </li>
              }
            </ul>
          </section>

          <section class="card support-card" aria-label="Contact support">
            <strong>Need more help?</strong>
            <p class="muted small">Our support team is here for you.</p>
            @if (!sent()) {
              <form class="support-form" (ngSubmit)="submit()">
                <label>Name
                  <input [ngModel]="name()" (ngModelChange)="name.set($event)" name="name" required autocomplete="name" />
                </label>
                <label>Email
                  <input type="email" [ngModel]="email()" (ngModelChange)="email.set($event)" name="email" required autocomplete="email" />
                </label>
                <label>Message
                  <textarea [ngModel]="msg()" (ngModelChange)="msg.set($event)" name="msg" required rows="3"></textarea>
                </label>
                <button type="submit" class="btn primary sm">Contact Support</button>
                <p class="muted small">Demo form — messages are not sent anywhere and no live chat exists.</p>
              </form>
            } @else {
              <div class="sent" role="status">
                <strong>Thanks, {{ firstName() }}!</strong>
                <p class="muted small">Your message was recorded locally (demo). We'll reply to {{ email() }} in a real deployment.</p>
                <button class="btn sm" (click)="reset()">Send another</button>
              </div>
            }
            <a routerLink="/settings" class="muted small">Check Settings first — most answers are there.</a>
          </section>
        </div>
      </div>
    </div>
  `,
})
export class HelpComponent {
  readonly q = signal('');
  readonly cat = signal<string | null>(null);
  readonly open = signal<string | null>(POPULAR_QUESTIONS[0]);
  readonly sent = signal(false);
  readonly name = signal('');
  readonly email = signal('');
  readonly msg = signal('');

  readonly categories = HELP_CATEGORIES;
  readonly popular = HELP_ARTICLES.filter((a) => POPULAR_QUESTIONS.includes(a.id));

  readonly filtered = computed(() => {
    const needle = this.q().trim().toLowerCase();
    const cat = this.cat();
    return HELP_ARTICLES.filter((a) => {
      const matchCat = cat ? a.categoryId === cat : true;
      const matchQ =
        needle.length === 0 ||
        a.title.toLowerCase().includes(needle) ||
        a.body.toLowerCase().includes(needle) ||
        a.tags.some((t) => t.includes(needle));
      return matchCat && matchQ;
    });
  });

  readonly catTitle = computed(() => {
    const c = this.cat();
    if (!c) return 'All articles';
    return HELP_CATEGORIES.find((x) => x.id === c)?.title ?? 'Articles';
  });

  firstName(): string {
    return this.name().split(' ')[0] || 'there';
  }

  clear(): void {
    this.q.set('');
    this.cat.set(null);
  }

  goPopular(id: string): void {
    this.cat.set(null);
    this.q.set('');
    this.open.set(id);
  }

  submit(): void {
    if (!this.name().trim() || !this.email().trim() || !this.msg().trim()) return;
    this.sent.set(true);
  }

  reset(): void {
    this.sent.set(false);
    this.name.set('');
    this.email.set('');
    this.msg.set('');
  }
}

