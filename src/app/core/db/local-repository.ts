import { Photo } from '../data/photo';
import { Stage } from '../data/places';
import { JournalEntry } from '../data/seed-journal';
import { TripState } from '../data/trip';
import type { DataRepository, Snapshot } from './data-repository';
import { FieldManualDb, TRIP_KEY } from './field-manual-db';

/** Données sur l'appareil, dans IndexedDB. */
export class LocalRepository implements DataRepository {
  private readonly db = new FieldManualDb();

  async load(): Promise<Snapshot> {
    const { db } = this;
    const [trip, stages, entries, photos] = await Promise.all([
      db.trip.get(TRIP_KEY),
      db.stages.orderBy('order').toArray(),
      db.entries.toArray(),
      db.photos.toArray(),
    ]);
    return {
      trip: trip ? withoutKey(trip) : null,
      stages: stages.map(({ order: _, ...stage }) => stage),
      entries,
      photos,
    };
  }

  async isEmpty(): Promise<boolean> {
    return (await this.db.trip.count()) === 0;
  }

  async replaceAll(snapshot: Snapshot): Promise<void> {
    const { db } = this;
    await db.transaction('rw', [db.trip, db.stages, db.entries, db.photos], async () => {
      await Promise.all([
        db.trip.clear(),
        db.stages.clear(),
        db.entries.clear(),
        db.photos.clear(),
      ]);
      if (snapshot.trip) await db.trip.put({ ...snapshot.trip, id: TRIP_KEY });
      await db.stages.bulkPut(ordered(snapshot.stages));
      await db.entries.bulkPut(snapshot.entries);
      await db.photos.bulkPut(snapshot.photos);
    });
  }

  async saveTrip(trip: TripState): Promise<void> {
    await this.db.trip.put({ ...trip, id: TRIP_KEY });
  }

  async saveStages(stages: Stage[]): Promise<void> {
    const { db } = this;
    await db.transaction('rw', db.stages, async () => {
      await db.stages.clear();
      await db.stages.bulkPut(ordered(stages));
    });
  }

  async putEntry(entry: JournalEntry): Promise<void> {
    await this.db.entries.put(entry);
  }

  async deleteEntry(id: string): Promise<void> {
    await this.db.entries.delete(id);
  }

  async putPhoto(photo: Photo): Promise<void> {
    await this.db.photos.put(photo);
  }

  async deletePhoto(id: string): Promise<void> {
    await this.db.photos.delete(id);
  }
}

function withoutKey({ id: _, ...trip }: TripState & { id: string }): TripState {
  return trip;
}

function ordered(stages: Stage[]) {
  return stages.map((stage, order) => ({ ...stage, order }));
}
