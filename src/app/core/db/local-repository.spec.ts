import { DEFAULT_STAGES } from '../data/places';
import { DEFAULT_ENTRIES } from '../data/seed-journal';
import { DEFAULT_TRIP } from '../data/trip';
import { LocalRepository } from './local-repository';

describe('LocalRepository', () => {
  it('starts empty', async () => {
    const repo = new LocalRepository();
    expect(await repo.isEmpty()).toBe(true);
    expect(await repo.load()).toEqual({ trip: null, stages: [], entries: [], photos: [] });
  });

  it('replaces everything and keeps the stage order', async () => {
    const repo = new LocalRepository();
    const stages = [...DEFAULT_STAGES].reverse();
    await repo.replaceAll({ trip: DEFAULT_TRIP, stages, entries: DEFAULT_ENTRIES, photos: [] });
    const loaded = await repo.load();
    expect(await repo.isEmpty()).toBe(false);
    expect(loaded.trip).toEqual(DEFAULT_TRIP);
    expect(loaded.stages).toEqual(stages);
    expect(loaded.entries).toHaveLength(3);
  });

  it('creates, updates and deletes entries and photos', async () => {
    const repo = new LocalRepository();
    const entry = { ...DEFAULT_ENTRIES[0], id: 'x' };
    await repo.putEntry(entry);
    await repo.putEntry({ ...entry, title: 'Modifiée' });
    expect((await repo.load()).entries).toEqual([{ ...entry, title: 'Modifiée' }]);
    await repo.deleteEntry('x');
    await repo.putPhoto({ id: 'hero', url: 'https://example.com/a.jpg', updatedAt: 1 });
    expect((await repo.load()).entries).toEqual([]);
    expect((await repo.load()).photos).toEqual([
      { id: 'hero', url: 'https://example.com/a.jpg', updatedAt: 1 },
    ]);
    await repo.deletePhoto('hero');
    expect((await repo.load()).photos).toEqual([]);
  });

  it('survives a new connection (app restart)', async () => {
    await new LocalRepository().saveStages(DEFAULT_STAGES.slice(0, 1));
    expect((await new LocalRepository().load()).stages).toEqual(DEFAULT_STAGES.slice(0, 1));
  });
});
