import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JournalEntry } from '../../../core/data/seed-journal';
import { JournalStore } from '../../../core/state/journal.store';
import { frDate } from '../../../core/utils/date';
import { PageHeader } from '../../../shared/page-header/page-header';
import { PhotoSlot } from '../../../shared/photo-slot/photo-slot';
import { PillButton } from '../../../shared/pill-button/pill-button';

const EXCERPT = 200;

function card(e: JournalEntry) {
  return {
    id: e.id,
    title: e.title || 'Fiche sans titre',
    date: frDate(e.date),
    stage: (e.stage || 'SANS ÉTAPE').toUpperCase(),
    excerpt: e.text
      ? e.text.length > EXCERPT
        ? e.text.slice(0, EXCERPT).trim() + '…'
        : e.text
      : 'Fiche vide. Touchez pour écrire.',
  };
}

@Component({
  selector: 'app-journal-list',
  imports: [RouterLink, PageHeader, PhotoSlot, PillButton],
  templateUrl: './journal-list.html',
  styleUrl: './journal-list.css',
})
export class JournalList {
  private readonly journal = inject(JournalStore);
  private readonly router = inject(Router);

  private readonly cards = computed(() => this.journal.sorted().map(card));
  /** Fiche la plus récente, mise en avant. */
  protected readonly feat = computed(() => this.cards()[0]);
  protected readonly rest = computed(() => this.cards().slice(1));
  protected readonly count = computed(() => String(this.cards().length).padStart(2, '0'));

  protected add(): void {
    this.router.navigate(['/carnet', this.journal.add()]);
  }
}
