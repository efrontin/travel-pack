import { computed, effect, Injectable, signal } from '@angular/core';
import { BAGS, bagById, CABIN_LIMIT_KG } from '../data/bags';
import { Climate, ITEMS, suggest } from '../data/items';
import { DestinationId, DESTS } from '../data/places';
import { loadJson, saveJson } from '../utils/storage';
import { itemsWeight, load } from '../utils/weight';

const STORAGE_KEY = 'fm-trip-v1';

export interface TripState {
  dest: DestinationId;
  days: number;
  clim: Climate;
  bagId: string;
  included: string[];
  checked: string[];
  cmpBagId: string;
}

export const DEFAULT_TRIP: TripState = {
  dest: 'tokyo',
  days: 10,
  clim: 'humide',
  bagId: 'b30',
  included: suggest('humide'),
  checked: ['passeport', 'ordi', 'gan', 'merinos'],
  cmpBagId: 'b24',
};

const isTrip = (v: unknown): boolean =>
  !!v &&
  typeof v === 'object' &&
  (v as TripState).dest in DESTS &&
  Array.isArray((v as TripState).included) &&
  Array.isArray((v as TripState).checked);

const clampDays = (d: number) => Math.min(30, Math.max(2, Math.round(d)));

@Injectable({ providedIn: 'root' })
export class TripStore {
  private readonly state = signal<TripState>(loadJson(STORAGE_KEY, DEFAULT_TRIP, isTrip));

  readonly destId = computed(() => this.state().dest);
  readonly days = computed(() => this.state().days);
  readonly clim = computed(() => this.state().clim);
  readonly bagId = computed(() => this.state().bagId);
  readonly included = computed(() => this.state().included);
  readonly checked = computed(() => this.state().checked);

  readonly cabinLimitKg = CABIN_LIMIT_KG;
  readonly dest = computed(() => DESTS[this.destId()]);
  readonly bag = computed(() => bagById(this.bagId()));
  /** Sac de comparaison, toujours différent du sac actuel. */
  readonly cmpBag = computed(() => {
    const id = this.state().cmpBagId;
    return id !== this.bagId() ? bagById(id) : BAGS.find((b) => b.id !== this.bagId())!;
  });

  readonly items = computed(() => ITEMS.filter((i) => this.included().includes(i.id)));
  readonly count = computed(() => this.items().length);
  readonly checkedCount = computed(
    () => this.items().filter((i) => this.checked().includes(i.id)).length,
  );
  readonly load = computed(() => load(this.bag(), this.items(), this.days()));
  readonly cmpLoad = computed(() => load(this.cmpBag(), this.items(), this.days()));
  readonly over = computed(() => this.load().total > this.cabinLimitKg * 1000);

  readonly suggestion = computed(() => suggest(this.clim()));
  /** Poids de la liste suggérée pour les réglages actuels (sac compris), en grammes. */
  readonly suggestionWeight = computed(
    () =>
      itemsWeight(
        ITEMS.filter((i) => this.suggestion().includes(i.id)),
        this.days(),
      ) + this.bag().w,
  );

  constructor() {
    effect(() => saveJson(STORAGE_KEY, this.state()));
  }

  /** Change de destination et applique son climat par défaut. */
  setDest(dest: DestinationId): void {
    this.patch({ dest, clim: DESTS[dest].clim });
  }

  setDays(days: number): void {
    this.patch({ days: clampDays(days) });
  }

  setClim(clim: Climate): void {
    this.patch({ clim });
  }

  setBag(bagId: string): void {
    this.patch({ bagId });
  }

  setCmpBag(cmpBagId: string): void {
    this.patch({ cmpBagId });
  }

  /** Échange le sac actuel et le sac de comparaison. */
  swapBags(): void {
    const next = this.cmpBag().id;
    this.patch({ bagId: next, cmpBagId: this.bagId() });
  }

  /** Remplace la liste par la suggestion et remet la checklist à zéro. */
  generate(): void {
    this.patch({ included: this.suggestion(), checked: [] });
  }

  isIncluded(id: string): boolean {
    return this.included().includes(id);
  }

  toggleIncluded(id: string): void {
    this.patch({ included: toggle(this.included(), id) });
  }

  toggleChecked(id: string): void {
    this.patch({ checked: toggle(this.checked(), id) });
  }

  private patch(p: Partial<TripState>): void {
    this.state.update((s) => ({ ...s, ...p }));
  }
}

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}
