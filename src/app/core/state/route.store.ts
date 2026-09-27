import { computed, inject, Injectable, signal } from '@angular/core';
import { DEFAULT_STAGES, PLACES, Stage } from '../data/places';
import { DataRepository } from '../db/data-repository';
import { WriteQueue } from '../db/write-queue';
import { haversine } from '../utils/geo';

@Injectable({ providedIn: 'root' })
export class RouteStore {
  private readonly repo = inject(DataRepository);
  private readonly queue = inject(WriteQueue);
  private readonly all = signal<Stage[]>(DEFAULT_STAGES);

  /** Étapes dont le lieu est connu. */
  readonly stages = computed(() => this.all().filter((s) => PLACES[s.place]));
  readonly totalDays = computed(() => this.stages().reduce((t, s) => t + s.days, 0));
  readonly km = computed(() =>
    this.stages().reduce(
      (t, s, i, arr) => (i ? t + haversine(PLACES[arr[i - 1].place], PLACES[s.place]) : t),
      0,
    ),
  );
  /** Lieux pas encore dans l'itinéraire. */
  readonly remaining = computed(() =>
    Object.entries(PLACES)
      .filter(([k]) => !this.stages().some((s) => s.place === k))
      .map(([id, p]) => ({ id, ...p })),
  );
  readonly placeNames = computed(() => this.stages().map((s) => PLACES[s.place].name));

  /** Charge l'itinéraire enregistré (sans le réécrire). */
  hydrate(stages: Stage[]): void {
    this.all.set(stages);
  }

  add(place: string): void {
    this.save([...this.all(), { id: crypto.randomUUID(), place, days: 2, updatedAt: Date.now() }]);
  }

  remove(id: string): void {
    this.save(this.all().filter((s) => s.id !== id));
  }

  setDays(id: string, days: number): void {
    this.save(
      this.all().map((s) =>
        s.id === id ? { ...s, days: Math.max(1, days), updatedAt: Date.now() } : s,
      ),
    );
  }

  private save(stages: Stage[]): void {
    this.all.set(stages);
    this.queue.run(() => this.repo.saveStages(stages));
  }
}
