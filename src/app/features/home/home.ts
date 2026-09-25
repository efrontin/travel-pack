import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACES } from '../../core/data/places';
import { RouteStore } from '../../core/state/route.store';
import { TripStore } from '../../core/state/trip.store';
import { UiStore } from '../../core/state/ui.store';
import { kgf } from '../../core/utils/weight';
import { Logo } from '../../shared/logo/logo';
import { PhotoSlot } from '../../shared/photo-slot/photo-slot';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Logo, PhotoSlot],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly trip = inject(TripStore);
  protected readonly ui = inject(UiStore);
  private readonly route = inject(RouteStore);

  protected readonly kg = computed(() => kgf(this.trip.load().total));
  protected readonly routeLine = computed(() => {
    const stages = this.route.stages();
    return stages.length
      ? stages
          .slice(0, 3)
          .map((s) => PLACES[s.place].name.toUpperCase())
          .join(' → ')
      : this.trip.dest().route;
  });

  protected readonly steps = [
    { n: '01', title: 'Le départ', desc: 'Destination, durée, climat', link: '/sac/preparer' },
    { n: '02', title: 'La liste', desc: 'Cochez ce qui entre dans le sac', link: '/sac/liste' },
    {
      n: '03',
      title: 'La répartition',
      desc: 'Poids et place, poche par poche',
      link: '/sac/repartition',
    },
  ];
}
