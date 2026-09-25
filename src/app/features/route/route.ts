import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PLACES } from '../../core/data/places';
import { JournalStore } from '../../core/state/journal.store';
import { RouteStore } from '../../core/state/route.store';
import { TripStore } from '../../core/state/trip.store';
import { UiStore } from '../../core/state/ui.store';
import { haversine } from '../../core/utils/geo';
import { Chip } from '../../shared/chip/chip';
import { PageHeader } from '../../shared/page-header/page-header';
import { PillButton } from '../../shared/pill-button/pill-button';
import { Stepper } from '../../shared/stepper/stepper';
import { RouteMap } from './route-map';

@Component({
  selector: 'app-route',
  imports: [PageHeader, RouteMap, Stepper, Chip, PillButton],
  templateUrl: './route.html',
  styleUrl: './route.css',
})
export class RoutePage {
  protected readonly route = inject(RouteStore);
  private readonly journal = inject(JournalStore);
  private readonly trip = inject(TripStore);
  private readonly ui = inject(UiStore);
  private readonly router = inject(Router);

  protected readonly count = computed(() => String(this.route.stages().length).padStart(2, '0'));
  protected readonly km = computed(() => Math.round(this.route.km()).toLocaleString('fr-FR'));
  protected readonly rows = computed(() =>
    this.route.stages().map((s, i, all) => {
      const place = PLACES[s.place];
      const prev = i ? PLACES[all[i - 1].place] : null;
      return {
        ...s,
        n: i + 1,
        name: place.name,
        sub: prev
          ? `${Math.round(haversine(prev, place))} km depuis ${prev.name}`
          : 'Point de départ',
      };
    }),
  );

  protected write(stage: string): void {
    const id = this.journal.add(stage);
    this.router.navigate(['/carnet', id]);
  }

  protected useDays(): void {
    this.trip.setDays(this.route.totalDays());
    this.router.navigate(['/sac/liste']);
    this.ui.flash(`Sac ajusté pour ${this.trip.days()} jours.`);
  }
}
