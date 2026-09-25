import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompartmentId, COMPS } from '../../../core/data/items';
import { TripStore } from '../../../core/state/trip.store';
import { UiStore } from '../../../core/state/ui.store';
import { itemLabel, itemsWeight, kgf, qty } from '../../../core/utils/weight';
import { PageHeader } from '../../../shared/page-header/page-header';
import { PhotoSlot } from '../../../shared/photo-slot/photo-slot';
import { PillButton } from '../../../shared/pill-button/pill-button';

@Component({
  selector: 'app-bag',
  imports: [RouterLink, PageHeader, PhotoSlot, PillButton],
  templateUrl: './bag.html',
  styleUrl: './bag.css',
})
export class BagPage {
  protected readonly trip = inject(TripStore);
  private readonly ui = inject(UiStore);

  /** Compartiment déplié dans l'accordéon. */
  protected readonly open = signal<CompartmentId | null>('main');

  protected readonly kg = computed(() => kgf(this.trip.load().total));
  protected readonly vol = computed(() => this.trip.load().vol.toFixed(0));
  protected readonly limitPct = computed(() =>
    Math.min(100, (this.trip.load().total / (this.trip.cabinLimitKg * 1000)) * 100),
  );
  protected readonly note = computed(() => {
    const margin = this.trip.cabinLimitKg * 1000 - this.trip.load().total;
    return this.trip.over()
      ? `Dépassement de ${kgf(-margin)} kg : retirez un objet ou changez de sac.`
      : `Il reste ${kgf(margin)} kg de marge.`;
  });
  protected readonly comps = computed(() => {
    const days = this.trip.days();
    const content = this.trip.load().content;
    return (Object.entries(COMPS) as [CompartmentId, string][])
      .map(([id, name]) => {
        const items = this.trip.items().filter((i) => i.comp === id);
        const g = itemsWeight(items, days);
        return {
          id,
          name,
          n: items.length,
          kg: kgf(g),
          pct: content ? (g / content) * 100 : 0,
          items: items.map((i) => ({ id: i.id, label: itemLabel(i, days), g: i.w * qty(i, days) })),
        };
      })
      .filter((c) => c.n);
  });

  protected toggle(id: CompartmentId): void {
    this.open.update((cur) => (cur === id ? null : id));
  }

  protected async share(): Promise<void> {
    const days = this.trip.days();
    const text =
      `Mon sac — ${this.trip.dest().name}, ${days} jours (${this.kg()} kg)\n` +
      this.trip
        .items()
        .map((i) => '☐ ' + itemLabel(i, days))
        .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      this.ui.flash(`Liste copiée : ${this.trip.count()} objets, prête à coller.`);
    } catch {
      this.ui.flash('Copie impossible dans ce navigateur.');
    }
  }

  protected print(): void {
    window.print();
  }
}
