import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BAGS } from '../../../core/data/bags';
import { CLIMATES } from '../../../core/data/items';
import { DestinationId, DESTS } from '../../../core/data/places';
import { TripStore } from '../../../core/state/trip.store';
import { kgf } from '../../../core/utils/weight';
import { Chip } from '../../../shared/chip/chip';
import { PageHeader } from '../../../shared/page-header/page-header';
import { PillButton } from '../../../shared/pill-button/pill-button';

@Component({
  selector: 'app-prep',
  imports: [PageHeader, Chip, PillButton],
  templateUrl: './prep.html',
  styleUrl: './prep.css',
})
export class Prep {
  protected readonly trip = inject(TripStore);
  private readonly router = inject(Router);

  protected readonly dests = Object.entries(DESTS).map(([id, d]) => ({
    id: id as DestinationId,
    ...d,
  }));
  protected readonly climates = CLIMATES.map((c) => ({
    id: c,
    label: c[0].toUpperCase() + c.slice(1),
  }));
  protected readonly bags = BAGS.map((b) => ({ ...b, spec: `${b.cap} L · ${kgf(b.w)} kg à vide` }));
  protected readonly preview = computed(
    () => `${this.trip.suggestion().length} objets · ~${kgf(this.trip.suggestionWeight())} kg`,
  );

  protected onDays(event: Event): void {
    this.trip.setDays(+(event.target as HTMLInputElement).value);
  }

  protected generate(): void {
    this.trip.generate();
    this.router.navigate(['/sac/liste']);
  }
}
