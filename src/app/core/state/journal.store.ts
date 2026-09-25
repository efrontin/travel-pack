import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { DEFAULT_ENTRIES, JournalEntry } from '../data/seed-journal';
import { todayIso } from '../utils/date';
import { loadJson, saveJson } from '../utils/storage';
import { RouteStore } from './route.store';

const STORAGE_KEY = 'fm-journal-v1';

@Injectable({ providedIn: 'root' })
export class JournalStore {
  private readonly route = inject(RouteStore);
  readonly entries = signal<JournalEntry[]>(loadJson(STORAGE_KEY, DEFAULT_ENTRIES, Array.isArray));

  /** Plus récentes d'abord. */
  readonly sorted = computed(() =>
    [...this.entries()].sort((a, b) => (b.date || '').localeCompare(a.date || '')),
  );

  constructor() {
    effect(() => saveJson(STORAGE_KEY, this.entries()));
  }

  get(id: string): JournalEntry | undefined {
    return this.entries().find((e) => e.id === id);
  }

  /** Crée une fiche vide (liée à `stage` ou à la première étape) et renvoie son id. */
  add(stage?: string): string {
    const id = 'e' + Date.now();
    const entry: JournalEntry = {
      id,
      title: '',
      date: todayIso(),
      stage: stage ?? this.route.placeNames()[0] ?? '',
      text: '',
    };
    this.entries.update((l) => [entry, ...l]);
    return id;
  }

  update(id: string, patch: Partial<Omit<JournalEntry, 'id'>>): void {
    this.entries.update((l) => l.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  remove(id: string): void {
    this.entries.update((l) => l.filter((e) => e.id !== id));
  }
}
