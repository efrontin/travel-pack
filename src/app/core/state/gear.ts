import { inject, Injectable } from '@angular/core';
import { CatalogEntry } from '../data/catalog';
import { TripStore } from './trip.store';
import { UiStore } from './ui.store';

/** Ajout / retrait d'un article du catalogue (un sac se choisit, un objet se coche). */
@Injectable({ providedIn: 'root' })
export class GearActions {
  private readonly trip = inject(TripStore);
  private readonly ui = inject(UiStore);

  isInBag(x: CatalogEntry): boolean {
    return x.isBag ? this.trip.bagId() === x.id : this.trip.isIncluded(x.id);
  }

  toggle(x: CatalogEntry, notify = true): void {
    if (x.isBag) {
      this.trip.setBag(x.id);
      if (notify) this.ui.flash(`${x.name} choisi comme sac.`);
      return;
    }
    const was = this.trip.isIncluded(x.id);
    this.trip.toggleIncluded(x.id);
    if (notify) this.ui.flash(`${x.name} ${was ? 'retiré du' : 'ajouté au'} sac.`);
  }
}
