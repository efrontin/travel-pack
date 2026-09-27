import { Injectable } from '@angular/core';
import { Photo } from '../data/photo';
import { Stage } from '../data/places';
import { JournalEntry } from '../data/seed-journal';
import { TripState } from '../data/trip';
import { LocalRepository } from './local-repository';

/** Toutes les données de l'utilisateur, telles qu'enregistrées. */
export interface Snapshot {
  /** `null` tant que rien n'a jamais été enregistré. */
  trip: TripState | null;
  /** Dans l'ordre de l'itinéraire. */
  stages: Stage[];
  entries: JournalEntry[];
  photos: Photo[];
}

/**
 * Accès aux données persistées. Implémentation actuelle : IndexedDB sur l'appareil
 * (`LocalRepository`). Une version synchronisée (Firestore…) pourra la remplacer
 * en changeant ce fournisseur, sans toucher aux stores ni aux écrans.
 */
@Injectable({ providedIn: 'root', useFactory: () => new LocalRepository() })
export abstract class DataRepository {
  abstract load(): Promise<Snapshot>;
  /** Vrai si l'appareil n'a encore jamais rien enregistré. */
  abstract isEmpty(): Promise<boolean>;
  /** Remplace toutes les données (première installation, import de sauvegarde). */
  abstract replaceAll(snapshot: Snapshot): Promise<void>;
  abstract saveTrip(trip: TripState): Promise<void>;
  /** Enregistre l'itinéraire complet, dans l'ordre donné. */
  abstract saveStages(stages: Stage[]): Promise<void>;
  abstract putEntry(entry: JournalEntry): Promise<void>;
  abstract deleteEntry(id: string): Promise<void>;
  abstract putPhoto(photo: Photo): Promise<void>;
  abstract deletePhoto(id: string): Promise<void>;
}
