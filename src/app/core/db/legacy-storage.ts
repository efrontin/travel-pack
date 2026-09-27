import { Photo } from '../data/photo';
import { DESTS, Stage } from '../data/places';
import { JournalEntry } from '../data/seed-journal';
import { TripState } from '../data/trip';
import { dataUrlToBlob } from './blob-codec';

/** Clés de l'ancienne version (localStorage), reprises une fois puis effacées. */
const TRIP_KEY = 'fm-trip-v1';
const ROUTE_KEY = 'fm-route-v1';
const JOURNAL_KEY = 'fm-journal-v1';
const PHOTO_PREFIX = 'fm-photo-';

export interface LegacyData {
  trip?: TripState;
  stages?: Stage[];
  entries?: JournalEntry[];
  photos: Photo[];
}

/** Lit les données de l'ancienne version ; `null` s'il n'y en a pas. */
export function readLegacy(): LegacyData | null {
  let storage: Storage;
  try {
    storage = localStorage;
  } catch {
    return null;
  }
  const trip = parse<TripState>(
    storage,
    TRIP_KEY,
    (v) => isObject(v) && (v as TripState).dest in DESTS,
  );
  const stages = parse<Stage[]>(storage, ROUTE_KEY, Array.isArray);
  const entries = parse<JournalEntry[]>(storage, JOURNAL_KEY, Array.isArray);
  const photos = photoKeys(storage).flatMap((key): Photo[] => {
    const value = storage.getItem(key) ?? '';
    const id = key.slice(PHOTO_PREFIX.length);
    try {
      if (value.startsWith('data:')) return [{ id, blob: dataUrlToBlob(value), updatedAt: 0 }];
      if (/^https?:\/\//.test(value)) return [{ id, url: value, updatedAt: 0 }];
    } catch {
      // Image illisible : ignorée.
    }
    return [];
  });
  if (!trip && !stages && !entries && !photos.length) return null;
  return {
    trip: trip && { ...trip, updatedAt: 0 },
    stages: stages?.map((s) => ({ ...s, updatedAt: s.updatedAt ?? 0 })),
    entries: entries?.map((e) => ({
      ...e,
      updatedAt: e.updatedAt ?? 0,
    })),
    photos,
  };
}

/** Efface les anciennes clés, une fois la reprise enregistrée. */
export function clearLegacy(): void {
  try {
    for (const key of [TRIP_KEY, ROUTE_KEY, JOURNAL_KEY, ...photoKeys(localStorage)]) {
      localStorage.removeItem(key);
    }
  } catch {
    // Stockage indisponible : rien à effacer.
  }
}

function photoKeys(storage: Storage): string[] {
  return Array.from({ length: storage.length }, (_, i) => storage.key(i) ?? '').filter((k) =>
    k.startsWith(PHOTO_PREFIX),
  );
}

function parse<T>(storage: Storage, key: string, valid: (v: unknown) => boolean): T | undefined {
  try {
    const raw = storage.getItem(key);
    const value: unknown = raw === null ? undefined : JSON.parse(raw);
    return valid(value) ? (value as T) : undefined;
  } catch {
    return undefined;
  }
}

function isObject(v: unknown): boolean {
  return !!v && typeof v === 'object';
}
