import { TestBed } from '@angular/core/testing';
import { LocalRepository } from '../db/local-repository';
import { WriteQueue } from '../db/write-queue';
import { Hydration } from './hydration';
import { JournalStore } from './journal.store';
import { PhotoStore } from './photo.store';
import { RouteStore } from './route.store';
import { TripStore } from './trip.store';

const PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

describe('Hydration', () => {
  beforeEach(() => localStorage.clear());

  it('seeds the example trip on first launch', async () => {
    await TestBed.inject(Hydration).run();
    const saved = await new LocalRepository().load();
    expect(saved.trip?.dest).toBe('tokyo');
    expect(saved.stages).toHaveLength(3);
    expect(saved.entries).toHaveLength(3);
    expect(TestBed.inject(JournalStore).sorted()).toHaveLength(3);
  });

  it('moves the previous localStorage data into IndexedDB, then clears it', async () => {
    localStorage.setItem(
      'fm-trip-v1',
      JSON.stringify({
        dest: 'lisbonne',
        days: 6,
        clim: 'doux',
        bagId: 'b24',
        included: ['ordi'],
        checked: [],
        cmpBagId: 'b30',
      }),
    );
    localStorage.setItem('fm-route-v1', JSON.stringify([{ id: 's9', place: 'kyoto', days: 3 }]));
    localStorage.setItem(
      'fm-journal-v1',
      JSON.stringify([
        { id: 'e9', title: 'Kyoto', date: '2026-10-01', stage: 'Kyoto', text: 'Temples.' },
      ]),
    );
    localStorage.setItem('fm-photo-hero', PIXEL);

    await TestBed.inject(Hydration).run();

    expect(TestBed.inject(TripStore).destId()).toBe('lisbonne');
    expect(TestBed.inject(TripStore).days()).toBe(6);
    expect(TestBed.inject(RouteStore).placeNames()).toEqual(['Kyoto']);
    expect(TestBed.inject(JournalStore).get('e9')?.text).toBe('Temples.');
    expect(TestBed.inject(PhotoStore).src('hero')).toMatch(/^blob:/);
    const saved = await new LocalRepository().load();
    expect(saved.photos[0].blob?.size).toBeGreaterThan(0);
    expect(localStorage.length).toBe(0);
  });

  it('reloads what the stores saved (app restart)', async () => {
    await TestBed.inject(Hydration).run();
    TestBed.inject(TripStore).setDays(21);
    const id = TestBed.inject(JournalStore).add('Nara');
    TestBed.inject(RouteStore).add('nara');
    await TestBed.inject(WriteQueue).idle();

    TestBed.resetTestingModule();
    await TestBed.inject(Hydration).run();

    expect(TestBed.inject(TripStore).days()).toBe(21);
    expect(TestBed.inject(JournalStore).get(id)?.stage).toBe('Nara');
    expect(TestBed.inject(RouteStore).placeNames().at(-1)).toBe('Nara');
  });
});
