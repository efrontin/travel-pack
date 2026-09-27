import { DEFAULT_STAGES } from '../data/places';
import { DEFAULT_ENTRIES } from '../data/seed-journal';
import { DEFAULT_TRIP } from '../data/trip';
import { Snapshot } from '../db/data-repository';
import { backupFileName, fromBackupJson, toBackupJson } from './backup';

describe('backup', () => {
  const snapshot: Snapshot = {
    trip: DEFAULT_TRIP,
    stages: DEFAULT_STAGES,
    entries: DEFAULT_ENTRIES,
    photos: [
      {
        id: 'hero',
        blob: new Blob([new Uint8Array([1, 2, 3])], { type: 'image/jpeg' }),
        updatedAt: 5,
      },
      { id: 'item-ordi', url: 'https://example.com/ordi.jpg', updatedAt: 6 },
    ],
  };

  it('round-trips all data, photos included', async () => {
    const restored = fromBackupJson(await toBackupJson(snapshot));
    expect(restored.trip).toEqual(DEFAULT_TRIP);
    expect(restored.stages).toEqual(DEFAULT_STAGES);
    expect(restored.entries).toEqual(DEFAULT_ENTRIES);
    expect(restored.photos[1]).toEqual(snapshot.photos[1]);
    const blob = restored.photos[0].blob!;
    expect(blob.type).toBe('image/jpeg');
    expect([...new Uint8Array(await blob.arrayBuffer())]).toEqual([1, 2, 3]);
  });

  it('rejects files that are not a backup', () => {
    expect(() => fromBackupJson('pas du json')).toThrow('pas une sauvegarde');
    expect(() => fromBackupJson('{"format":"autre"}')).toThrow('pas une sauvegarde');
    expect(() => fromBackupJson('{"format":"travel-field-manual","version":9}')).toThrow('Version');
  });

  it('names the file with the date', () => {
    expect(backupFileName(new Date('2026-09-27T10:00:00Z'))).toBe('field-manual-2026-09-27.json');
  });
});
