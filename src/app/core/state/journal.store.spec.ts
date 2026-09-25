import { TestBed } from '@angular/core/testing';
import { JournalStore } from './journal.store';

describe('JournalStore', () => {
  let store: JournalStore;

  beforeEach(() => {
    localStorage.clear();
    store = TestBed.inject(JournalStore);
  });

  it('sorts entries newest first', () => {
    expect(store.sorted().map((e) => e.id)).toEqual(['e3', 'e2', 'e1']);
  });

  it('creates an entry linked to the first stage by default', () => {
    const id = store.add();
    expect(store.get(id)?.stage).toBe('Tokyo');
    expect(store.add('Nara')).not.toBe('');
  });

  it('updates and removes entries', () => {
    store.update('e1', { title: 'Nouveau' });
    expect(store.get('e1')?.title).toBe('Nouveau');
    store.remove('e1');
    expect(store.get('e1')).toBeUndefined();
  });
});
