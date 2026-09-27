import { inject, Injectable } from '@angular/core';
import { DEFAULT_STAGES } from '../data/places';
import { DEFAULT_ENTRIES } from '../data/seed-journal';
import { DEFAULT_TRIP } from '../data/trip';
import { DataRepository, Snapshot } from '../db/data-repository';
import { clearLegacy, readLegacy } from '../db/legacy-storage';
import { JournalStore } from './journal.store';
import { PhotoStore } from './photo.store';
import { RouteStore } from './route.store';
import { TripStore } from './trip.store';
import { UiStore } from './ui.store';

/** Chargement des données au démarrage de l'application. */
@Injectable({ providedIn: 'root' })
export class Hydration {
  private readonly repo = inject(DataRepository);
  private readonly trip = inject(TripStore);
  private readonly route = inject(RouteStore);
  private readonly journal = inject(JournalStore);
  private readonly photos = inject(PhotoStore);
  private readonly ui = inject(UiStore);

  /**
   * Au premier lancement, enregistre les données de l'ancienne version (localStorage)
   * ou le voyage d'exemple ; puis charge la base dans les stores.
   */
  async run(): Promise<void> {
    try {
      await requestPersistence();
      if (await this.repo.isEmpty()) {
        const legacy = readLegacy();
        await this.repo.replaceAll({
          trip: legacy?.trip ?? DEFAULT_TRIP,
          stages: legacy?.stages ?? DEFAULT_STAGES,
          entries: legacy?.entries ?? DEFAULT_ENTRIES,
          photos: legacy?.photos ?? [],
        });
        if (legacy) clearLegacy();
      }
      this.apply(await this.repo.load());
    } catch (error) {
      // Base indisponible : l'app reste utilisable avec les données d'exemple.
      console.error(error);
      this.ui.flash('Données locales indisponibles sur cet appareil.');
    }
  }

  /** Remplace l'état des stores par un instantané de la base. */
  apply(snapshot: Snapshot): void {
    this.trip.hydrate(snapshot.trip ?? DEFAULT_TRIP);
    this.route.hydrate(snapshot.stages);
    this.journal.hydrate(snapshot.entries);
    this.photos.hydrate(snapshot.photos);
  }
}

/** Demande au navigateur de ne pas effacer la base quand l'espace manque. */
async function requestPersistence(): Promise<void> {
  try {
    if (!(await navigator.storage?.persisted?.())) await navigator.storage?.persist?.();
  } catch {
    // Non pris en charge : sans conséquence.
  }
}
