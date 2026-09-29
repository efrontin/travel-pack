import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DataRepository } from '../db/data-repository';
import { WriteQueue } from '../db/write-queue';
import { RouteStore } from './route.store';

describe('RouteStore', () => {
  let store: RouteStore;

  beforeEach(() => {
    localStorage.clear();
    store = TestBed.inject(RouteStore);
  });

  it('totals days and distance of the default route', () => {
    expect(store.totalDays()).toBe(14);
    expect(Math.round(store.km())).toBe(206);
    expect(store.remaining()).toHaveLength(9);
  });

  it('keeps at least one day per stage', () => {
    store.setDays('s3', 0);
    expect(store.stages()[2].days).toBe(1);
  });

  it('adds and removes stages', () => {
    store.add('kyoto');
    expect(store.stages().at(-1)?.place).toBe('kyoto');
    store.remove('s1');
    expect(store.stages()[0].place).toBe('nagano');
  });

  it('moves a stage and saves the new order once', async () => {
    const save = vi.spyOn(TestBed.inject(DataRepository), 'saveStages');
    store.move('s3', 0);
    expect(store.stages().map((s) => s.place)).toEqual(['kusatsu', 'tokyo', 'nagano']);
    await TestBed.inject(WriteQueue).idle();
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('shows the order of a drag in progress and saves it once on drop', async () => {
    const save = vi.spyOn(TestBed.inject(DataRepository), 'saveStages');
    store.dragTo('s3', 0);
    expect(store.stages().map((s) => s.place)).toEqual(['kusatsu', 'tokyo', 'nagano']);
    expect(Math.round(store.km())).toBe(311);
    await TestBed.inject(WriteQueue).idle();
    expect(save).not.toHaveBeenCalled();

    store.drop();
    await TestBed.inject(WriteQueue).idle();
    expect(save).toHaveBeenCalledTimes(1);
    expect(store.stages().map((s) => s.place)).toEqual(['kusatsu', 'tokyo', 'nagano']);
  });

  it('does nothing when a move changes nothing', async () => {
    const save = vi.spyOn(TestBed.inject(DataRepository), 'saveStages');
    store.move('s1', 0);
    store.move('s3', 2);
    store.move('inconnue', 0);
    expect(store.stages().map((s) => s.place)).toEqual(['tokyo', 'nagano', 'kusatsu']);
    await TestBed.inject(WriteQueue).idle();
    expect(save).not.toHaveBeenCalled();
  });

  it('does not save a drag that ends where it started', async () => {
    const save = vi.spyOn(TestBed.inject(DataRepository), 'saveStages');
    store.dragTo('s3', 0);
    store.dragTo('s3', 2);
    store.drop();
    await TestBed.inject(WriteQueue).idle();
    expect(save).not.toHaveBeenCalled();
  });

  it('keeps stages with an unknown place at the end when reordering', async () => {
    const save = vi.spyOn(TestBed.inject(DataRepository), 'saveStages');
    store.hydrate([
      { id: 'a', place: 'tokyo', days: 2, updatedAt: 0 },
      { id: 'x', place: 'atlantide', days: 2, updatedAt: 0 },
      { id: 'b', place: 'nagano', days: 2, updatedAt: 0 },
    ]);
    store.move('a', 1);
    expect(store.stages().map((s) => s.id)).toEqual(['b', 'a']);
    await TestBed.inject(WriteQueue).idle();
    expect(save.mock.calls[0][0].map((s) => s.id)).toEqual(['b', 'a', 'x']);
  });

  it('keeps the saved order available while a drag is in progress', () => {
    store.dragTo('s3', 0);
    expect(store.savedStages().map((s) => s.place)).toEqual(['tokyo', 'nagano', 'kusatsu']);
    expect(store.stages().map((s) => s.place)).toEqual(['kusatsu', 'tokyo', 'nagano']);
  });

  it('restores the saved order when a drag is cancelled', async () => {
    const save = vi.spyOn(TestBed.inject(DataRepository), 'saveStages');
    store.dragTo('s3', 0);
    store.cancelDrag();
    expect(store.stages().map((s) => s.place)).toEqual(['tokyo', 'nagano', 'kusatsu']);
    store.drop();
    await TestBed.inject(WriteQueue).idle();
    expect(save).not.toHaveBeenCalled();
  });
});
