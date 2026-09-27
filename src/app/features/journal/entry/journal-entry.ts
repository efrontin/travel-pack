import { Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { JournalStore } from '../../../core/state/journal.store';
import { RouteStore } from '../../../core/state/route.store';
import { UiStore } from '../../../core/state/ui.store';
import { AutoGrow } from '../../../shared/auto-grow/auto-grow';
import { PageHeader } from '../../../shared/page-header/page-header';
import { PhotoSlot } from '../../../shared/photo-slot/photo-slot';

/** Fiche de voyage éditable, sauvegardée à chaque frappe. */
@Component({
  selector: 'app-journal-entry',
  imports: [PageHeader, PhotoSlot, AutoGrow],
  templateUrl: './journal-entry.html',
  styleUrl: './journal-entry.css',
})
export class JournalEntry {
  /** Paramètre de route `:id`. */
  readonly id = input.required<string>();

  private readonly journal = inject(JournalStore);
  private readonly route = inject(RouteStore);
  private readonly ui = inject(UiStore);
  private readonly router = inject(Router);

  protected readonly entry = computed(() => this.journal.get(this.id()));
  protected readonly words = computed(() => this.entry()?.text.trim().match(/\S+/g)?.length ?? 0);
  protected readonly stageOptions = computed(() => [
    ...new Set([this.entry()?.stage, ...this.route.placeNames(), 'Autre'].filter((s) => !!s)),
  ]);

  constructor() {
    effect(() => {
      if (!this.entry()) this.router.navigate(['/carnet'], { replaceUrl: true });
    });
  }

  protected set(field: 'title' | 'date' | 'stage' | 'text', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)
      .value;
    this.journal.update(this.id(), { [field]: value });
  }

  protected remove(): void {
    this.journal.remove(this.id());
    this.ui.flash('Fiche supprimée.');
  }
}
