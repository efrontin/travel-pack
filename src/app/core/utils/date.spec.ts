import { frDate } from './date';

describe('frDate', () => {
  it('formats ISO dates in French capitals', () => {
    expect(frDate('2026-09-12')).toBe('12 SEPTEMBRE 2026');
    expect(frDate('')).toBe('');
  });
});
