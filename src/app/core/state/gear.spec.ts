import { TestBed } from '@angular/core/testing';
import { CATALOG } from '../data/catalog';
import { GearActions } from './gear';
import { TripStore } from './trip.store';
import { UiStore } from './ui.store';

const entry = (id: string) => CATALOG.find((x) => x.id === id)!;

describe('GearActions', () => {
  let gear: GearActions;
  let trip: TripStore;
  let ui: UiStore;

  beforeEach(() => {
    localStorage.clear();
    gear = TestBed.inject(GearActions);
    trip = TestBed.inject(TripStore);
    ui = TestBed.inject(UiStore);
  });

  it('adds and removes an item with a toast', () => {
    gear.toggle(entry('hybride'));
    expect(trip.isIncluded('hybride')).toBe(true);
    expect(ui.toast()).toBe('Appareil hybride ajouté au sac.');
    gear.toggle(entry('hybride'));
    expect(gear.isInBag(entry('hybride'))).toBe(false);
    expect(ui.toast()).toBe('Appareil hybride retiré du sac.');
  });

  it('chooses a bag instead of toggling it', () => {
    gear.toggle(entry('v40'));
    expect(trip.bagId()).toBe('v40');
    expect(ui.toast()).toBe('Valise cabine 40 L choisi comme sac.');
  });

  it('flags tested gear', () => {
    expect(entry('b30').tested).toBe(true);
    expect(entry('ordi').tested).toBe(false);
    expect(CATALOG).toHaveLength(27);
  });
});
