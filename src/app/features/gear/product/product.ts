import { Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CATALOG } from '../../../core/data/catalog';
import { REVIEWS } from '../../../core/data/reviews';
import { GearActions } from '../../../core/state/gear';
import { weightLabel } from '../../../core/utils/weight';
import { PageHeader } from '../../../shared/page-header/page-header';
import { PhotoSlot } from '../../../shared/photo-slot/photo-slot';
import { PillButton } from '../../../shared/pill-button/pill-button';

const pad = (n: number) => String(n).padStart(2, '0');

@Component({
  selector: 'app-product',
  imports: [PageHeader, PhotoSlot, PillButton],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  /** Paramètre de route `:id`. */
  readonly id = input.required<string>();

  protected readonly gear = inject(GearActions);
  private readonly router = inject(Router);

  protected readonly product = computed(() => CATALOG.find((x) => x.id === this.id()));
  protected readonly review = computed(() => REVIEWS[this.id()]);
  protected readonly index = computed(() => {
    const p = this.product();
    return p ? `${pad(CATALOG.indexOf(p) + 1)} / ${pad(CATALOG.length)}` : '';
  });
  protected readonly stats = computed(() => {
    const p = this.product()!;
    const rv = this.review();
    const w = weightLabel(p.w).toUpperCase();
    return rv ? [`TESTÉ ${rv.days} JOURS`, rv.trips, w] : [w, p.cat.toUpperCase()];
  });
  protected readonly inBag = computed(() => this.gear.isInBag(this.product()!));
  protected readonly cta = computed(() => {
    const p = this.product()!;
    if (p.isBag) return this.inBag() ? 'Votre sac actuel' : 'Choisir ce sac';
    return this.inBag() ? 'Retirer de mon sac' : 'Ajouter à mon sac';
  });

  constructor() {
    effect(() => {
      if (!this.product()) this.router.navigate(['/equipement'], { replaceUrl: true });
    });
  }
}
