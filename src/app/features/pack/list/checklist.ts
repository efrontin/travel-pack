import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ITEM_CATEGORIES } from '../../../core/data/items';
import { TripStore } from '../../../core/state/trip.store';
import { itemLabel, itemsWeight, kgf, qty } from '../../../core/utils/weight';
import { PageHeader } from '../../../shared/page-header/page-header';
import { PillButton } from '../../../shared/pill-button/pill-button';

@Component({
  selector: 'app-checklist',
  imports: [RouterLink, PageHeader, PillButton],
  templateUrl: './checklist.html',
  styleUrl: './checklist.css',
})
export class Checklist {
  protected readonly trip = inject(TripStore);

  protected readonly kg = computed(() => kgf(this.trip.load().total));
  protected readonly progress = computed(() => {
    const n = this.trip.count();
    return n ? (this.trip.checkedCount() / n) * 100 : 0;
  });
  protected readonly groups = computed(() => {
    const days = this.trip.days();
    const checked = this.trip.checked();
    return ITEM_CATEGORIES.map((cat) => {
      const items = this.trip.items().filter((i) => i.cat === cat);
      return {
        name: cat.toUpperCase(),
        kg: kgf(itemsWeight(items, days)),
        items: items.map((i) => ({
          id: i.id,
          label: itemLabel(i, days),
          g: i.w * qty(i, days),
          on: checked.includes(i.id),
        })),
      };
    }).filter((g) => g.items.length);
  });
}
