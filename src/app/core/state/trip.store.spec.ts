import { TestBed } from '@angular/core/testing';
import { suggest } from '../data/items';
import { TripStore } from './trip.store';

describe('TripStore', () => {
  let store: TripStore;

  beforeEach(() => {
    localStorage.clear();
    store = TestBed.inject(TripStore);
  });

  it('starts with the humid Tokyo suggestion at 6,4 kg', () => {
    expect(store.count()).toBe(19);
    expect(store.load().total).toBe(6355);
    expect(store.over()).toBe(false);
  });

  it('applies the destination climate', () => {
    store.setDest('nagano');
    expect(store.clim()).toBe('froid');
  });

  it('bounds the duration between 2 and 30 days', () => {
    store.setDays(40);
    expect(store.days()).toBe(30);
    store.setDays(1);
    expect(store.days()).toBe(2);
  });

  it('generates the suggestion and clears the checklist', () => {
    store.setClim('chaud');
    store.generate();
    expect(store.included()).toEqual(suggest('chaud'));
    expect(store.checked()).toEqual([]);
  });

  it('swaps the current and compared bags', () => {
    store.swapBags();
    expect(store.bagId()).toBe('b24');
    expect(store.cmpBag().id).toBe('b30');
  });

  it('never compares a bag with itself', () => {
    store.setBag('b24');
    expect(store.cmpBag().id).not.toBe('b24');
  });

  it('flags a load over the cabin limit', () => {
    store.setBag('v40');
    expect(store.over()).toBe(false);
    ['hybride', 'objectif', 'liseuse'].forEach((id) => store.toggleIncluded(id));
    expect(store.over()).toBe(true);
  });
});
