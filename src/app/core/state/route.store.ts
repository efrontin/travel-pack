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
  /** Ordre provisoire pendant un glisser, jamais enregistré avant `drop()`. */
  private readonly draft = signal<Stage[] | null>(null);

  /** Étapes dont le lieu est connu, dans l'ordre affiché (provisoire pendant un glisser). */
  readonly stages = computed(() => (this.draft() ?? this.all()).filter((s) => PLACES[s.place]));
  /** Étapes visibles dans l'ordre enregistré, inchangées pendant un glisser. */
  readonly savedStages = computed(() => this.all().filter((s) => PLACES[s.place]));
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

  /** Place l'étape à la position `index` de l'itinéraire. */
  move(id: string, index: number): void {
    const next = reorder(this.all(), id, index);
    if (!sameOrder(next, this.all())) this.save(next);
  }

  /** Montre l'étape à la position `index` sans enregistrer, le temps d'un glisser. */
  dragTo(id: string, index: number): void {
    this.draft.set(reorder(this.draft() ?? this.all(), id, index));
  }

  /** Enregistre l'ordre provisoire. */
  drop(): void {
    const stages = this.draft();
    if (!stages) return;
    this.draft.set(null);
    if (!sameOrder(stages, this.all())) this.save(stages);
  }

  /** Abandonne l'ordre provisoire et revient à l'ordre enregistré. */
  cancelDrag(): void {
    this.draft.set(null);
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

/** `index` est une position parmi les étapes visibles ; les étapes masquées passent à la fin. */
function reorder(stages: Stage[], id: string, index: number): Stage[] {
  const visible = stages.filter((s) => PLACES[s.place]);
  const hidden = stages.filter((s) => !PLACES[s.place]);
  const from = visible.findIndex((s) => s.id === id);
  if (from < 0) return stages;
  const [stage] = visible.splice(from, 1);
  visible.splice(index, 0, stage);
  return [...visible, ...hidden];
}

function sameOrder(a: Stage[], b: Stage[]): boolean {
  return a.length === b.length && a.every((s, i) => s.id === b[i].id);
}
