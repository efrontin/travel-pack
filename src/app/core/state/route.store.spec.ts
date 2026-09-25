import { TestBed } from '@angular/core/testing';
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
});
