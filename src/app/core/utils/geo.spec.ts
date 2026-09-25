import { PLACES } from '../data/places';
import { haversine } from './geo';

describe('haversine', () => {
  it('matches the prototype distances', () => {
    expect(Math.round(haversine(PLACES['tokyo'], PLACES['nagano']))).toBe(170);
    expect(Math.round(haversine(PLACES['nagano'], PLACES['kusatsu']))).toBe(36);
  });
});
