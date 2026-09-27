import { computed, inject, Injectable, signal } from '@angular/core';
import { DEFAULT_ENTRIES, JournalEntry } from '../data/seed-journal';
import { DataRepository } from '../db/data-repository';
import { WriteQueue } from '../db/write-queue';
import { todayIso } from '../utils/date';
import { PhotoStore } from './photo.store';
import { RouteStore } from './route.store';

/** Emplacement photo d'une fiche. */
export const entryPhotoId = (entryId: string) => 'j-' + entryId;

@Injectable({ providedIn: 'root' })
export class JournalStore {
  private readonly repo = inject(DataRepository);
  private readonly queue = inject(WriteQueue);
  private readonly route = inject(RouteStore);
  private readonly photos = inject(PhotoStore);
  private readonly all = signal<JournalEntry[]>(DEFAULT_ENTRIES);

  readonly entries = this.all.asReadonly();
  /** Plus récentes d'abord. */
  readonly sorted = computed(() =>
    [...this.all()].sort((a, b) => (b.date || '').localeCompare(a.date || '')),
  );

  /** Charge les fiches enregistrées (sans les réécrire). */
  hydrate(entries: JournalEntry[]): void {
    this.all.set(entries);
  }

  get(id: string): JournalEntry | undefined {
    return this.all().find((e) => e.id === id);
  }

  /** Crée une fiche vide (liée à `stage` ou à la première étape) et renvoie son id. */
  add(stage?: string): string {
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      title: '',
      date: todayIso(),
      stage: stage ?? this.route.placeNames()[0] ?? '',
      text: '',
      updatedAt: Date.now(),
    };
    this.all.update((l) => [entry, ...l]);
    this.queue.run(() => this.repo.putEntry(entry));
    return entry.id;
  }

  update(id: string, patch: Partial<Omit<JournalEntry, 'id' | 'updatedAt'>>): void {
    const current = this.get(id);
    if (!current) return;
    const next = { ...current, ...patch, updatedAt: Date.now() };
    this.all.update((l) => l.map((e) => (e.id === id ? next : e)));
    this.queue.run(() => this.repo.putEntry(next));
  }

  /** Supprime la fiche et sa photo. */
  remove(id: string): void {
    this.all.update((l) => l.filter((e) => e.id !== id));
    this.queue.run(() => this.repo.deleteEntry(id));
    this.photos.remove(entryPhotoId(id));
  }
}
