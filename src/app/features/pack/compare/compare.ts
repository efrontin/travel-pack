import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BAGS } from '../../../core/data/bags';
import { TripStore } from '../../../core/state/trip.store';
import { UiStore } from '../../../core/state/ui.store';
import { kgf, Load } from '../../../core/utils/weight';
import { Chip } from '../../../shared/chip/chip';
import { PageHeader } from '../../../shared/page-header/page-header';
import { PillButton } from '../../../shared/pill-button/pill-button';

interface RowDef {
  label: string;
  value: (l: Load, limitG: number) => number;
  format: (v: number, l: Load) => string;
  /** La plus petite valeur gagne. */
  lower: boolean;
}

const ROWS: RowDef[] = [
  { label: 'POIDS À VIDE', value: (l) => l.bag.w, format: (v) => `${kgf(v)} kg`, lower: true },
  { label: 'POIDS CHARGÉ', value: (l) => l.total, format: (v) => `${kgf(v)} kg`, lower: true },
  { label: 'CAPACITÉ', value: (l) => l.bag.cap, format: (v) => `${v} L`, lower: false },
  {
    label: 'REMPLISSAGE',
    value: (l) => l.vol / l.bag.cap,
    format: (v) => `${Math.round(v * 100)} %`,
    lower: true,
  },
  {
    label: 'MARGE CABINE',
    value: (l, limit) => limit - l.total,
    format: (v) => `${kgf(v)} kg`,
    lower: false,
  },
];

@Component({
  selector: 'app-compare',
  imports: [PageHeader, Chip, PillButton],
  templateUrl: './compare.html',
  styleUrl: './compare.css',
})
export class Compare {
  protected readonly trip = inject(TripStore);
  private readonly ui = inject(UiStore);
  private readonly router = inject(Router);

  protected readonly options = computed(() => BAGS.filter((b) => b.id !== this.trip.bagId()));
  protected readonly rows = computed(() => {
    const a = this.trip.load();
    const b = this.trip.cmpLoad();
    const limit = this.trip.cabinLimitKg * 1000;
    return ROWS.map((r) => {
      const va = r.value(a, limit);
      const vb = r.value(b, limit);
      const aWins = r.lower ? va <= vb : va >= vb;
      return {
        label: r.label,
        cells: [
          { v: r.format(va, a), best: aWins },
          { v: r.format(vb, b), best: !aWins },
        ],
      };
    });
  });

  protected swap(): void {
    const name = this.trip.cmpBag().name;
    this.trip.swapBags();
    this.router.navigate(['/sac/repartition']);
    this.ui.flash(`Sac changé : ${name}.`);
  }
}
