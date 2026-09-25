import { computed, effect, Injectable, signal } from '@angular/core';
import { DEFAULT_STAGES, PLACES, Stage } from '../data/places';
import { haversine } from '../utils/geo';
import { loadJson, saveJson } from '../utils/storage';

const STORAGE_KEY = 'fm-route-v1';

@Injectable({ providedIn: 'root' })
export class RouteStore {
  private readonly all = signal<Stage[]>(loadJson(STORAGE_KEY, DEFAULT_STAGES, Array.isArray));

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

  constructor() {
    effect(() => saveJson(STORAGE_KEY, this.all()));
  }

  add(place: string): void {
    this.all.update((l) => [...l, { id: 's' + Date.now(), place, days: 2 }]);
  }

  remove(id: string): void {
    this.all.update((l) => l.filter((s) => s.id !== id));
  }

  setDays(id: string, days: number): void {
    this.all.update((l) => l.map((s) => (s.id === id ? { ...s, days: Math.max(1, days) } : s)));
  }
}
