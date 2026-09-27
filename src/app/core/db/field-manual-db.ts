import Dexie, { type EntityTable } from 'dexie';
import { Photo } from '../data/photo';
import { Stage } from '../data/places';
import { JournalEntry } from '../data/seed-journal';
import { TripState } from '../data/trip';

/** Le voyage en cours est un enregistrement unique sous cette clé. */
export const TRIP_KEY = 'current';

export type TripRecord = TripState & { id: typeof TRIP_KEY };
/** Étape avec sa position dans l'itinéraire. */
export type StageRecord = Stage & { order: number };

/** Base IndexedDB de l'application (une par appareil). */
export class FieldManualDb extends Dexie {
  trip!: EntityTable<TripRecord, 'id'>;
  stages!: EntityTable<StageRecord, 'id'>;
  entries!: EntityTable<JournalEntry, 'id'>;
  photos!: EntityTable<Photo, 'id'>;

  constructor(name = 'travel-field-manual') {
    super(name);
    this.version(1).stores({
      trip: 'id',
      stages: 'id, order',
      entries: 'id, date, updatedAt',
      photos: 'id, updatedAt',
    });
  }
}
