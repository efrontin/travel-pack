import { Photo } from '../data/photo';
import { DESTS, Stage } from '../data/places';
import { JournalEntry } from '../data/seed-journal';
import { TripState } from '../data/trip';
import { blobToDataUrl, dataUrlToBlob } from '../db/blob-codec';
import { Snapshot } from '../db/data-repository';

const FORMAT = 'travel-field-manual';
const VERSION = 1;

interface BackupPhoto {
  id: string;
  url?: string;
  /** Image encodée en `data:` URL. */
  data?: string;
  updatedAt: number;
}

interface BackupFile {
  format: typeof FORMAT;
  version: typeof VERSION;
  exportedAt: string;
  trip: TripState | null;
  stages: Stage[];
  entries: JournalEntry[];
  photos: BackupPhoto[];
}

/** Sauvegarde JSON autonome (photos comprises). */
export async function toBackupJson(snapshot: Snapshot, now = new Date()): Promise<string> {
  const file: BackupFile = {
    format: FORMAT,
    version: VERSION,
    exportedAt: now.toISOString(),
    trip: snapshot.trip,
    stages: snapshot.stages,
    entries: snapshot.entries,
    photos: await Promise.all(
      snapshot.photos.map(async (p) => ({
        id: p.id,
        updatedAt: p.updatedAt,
        ...(p.blob ? { data: await blobToDataUrl(p.blob) } : { url: p.url }),
      })),
    ),
  };
  return JSON.stringify(file);
}

/** Lit une sauvegarde ; lève une erreur au message lisible si le fichier ne convient pas. */
export function fromBackupJson(text: string): Snapshot {
  let file: Partial<BackupFile>;
  try {
    file = JSON.parse(text);
  } catch {
    throw new Error('Ce fichier n’est pas une sauvegarde Field Manual.');
  }
  if (file?.format !== FORMAT) throw new Error('Ce fichier n’est pas une sauvegarde Field Manual.');
  if (file.version !== VERSION) throw new Error('Version de sauvegarde non prise en charge.');
  if (!Array.isArray(file.stages) || !Array.isArray(file.entries) || !Array.isArray(file.photos)) {
    throw new Error('Sauvegarde incomplète.');
  }
  if (file.trip && !(file.trip.dest in DESTS)) throw new Error('Sauvegarde incomplète.');
  return {
    trip: file.trip ?? null,
    stages: file.stages,
    entries: file.entries,
    photos: file.photos.flatMap((p): Photo[] => {
      if (p.data) return [{ id: p.id, blob: dataUrlToBlob(p.data), updatedAt: p.updatedAt }];
      if (p.url) return [{ id: p.id, url: p.url, updatedAt: p.updatedAt }];
      return [];
    }),
  };
}

export function backupFileName(now = new Date()): string {
  return `field-manual-${now.toISOString().slice(0, 10)}.json`;
}
