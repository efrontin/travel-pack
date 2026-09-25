import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATALOG, CATALOG_TABS } from '../../../core/data/catalog';
import { GearActions } from '../../../core/state/gear';
import { weightLabel } from '../../../core/utils/weight';
import { PhotoSlot } from '../../../shared/photo-slot/photo-slot';

@Component({
  selector: 'app-catalog',
  imports: [RouterLink, PhotoSlot],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  protected readonly gear = inject(GearActions);
  protected readonly tabs = CATALOG_TABS;
  protected readonly tab = signal<(typeof CATALOG_TABS)[number]>('Tout');
  protected readonly weight = weightLabel;
  protected readonly entries = computed(() =>
    CATALOG.filter((x) => this.tab() === 'Tout' || x.cat === this.tab()),
  );
}
