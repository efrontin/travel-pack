import { bagById } from '../data/bags';
import { ITEMS } from '../data/items';
import { itemLabel, kgf, load, qty, weightLabel } from './weight';

const item = (id: string) => ITEMS.find((i) => i.id === id)!;

describe('weight', () => {
  it('formats kilos with a French decimal comma', () => {
    expect(kgf(6400)).toBe('6,4');
    expect(kgf(1400)).toBe('1,4');
    expect(weightLabel(130)).toBe('130 g');
    expect(weightLabel(1240)).toBe('1,2 kg');
  });

  it('scales per-day items between 2 and 5', () => {
    expect(qty(item('merinos'), 2)).toBe(2);
    expect(qty(item('merinos'), 7)).toBe(4);
    expect(qty(item('merinos'), 30)).toBe(5);
    expect(qty(item('ordi'), 30)).toBe(1);
    expect(itemLabel(item('merinos'), 10)).toBe('T-shirt mérinos ×5');
    expect(itemLabel(item('ordi'), 10)).toBe('Ordinateur 13″');
  });

  it('adds the empty bag weight to the load', () => {
    const l = load(bagById('b30'), [item('merinos'), item('ordi')], 4);
    expect(l.content).toBe(130 * 2 + 1240);
    expect(l.total).toBe(l.content + 1400);
    expect(l.vol).toBeCloseTo(0.6 * 2 + 1.2);
  });
});
