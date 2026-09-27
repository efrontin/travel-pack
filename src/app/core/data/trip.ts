import { Climate, suggest } from './items';
import { DestinationId } from './places';

export interface TripState {
  dest: DestinationId;
  days: number;
  clim: Climate;
  bagId: string;
  included: string[];
  checked: string[];
  cmpBagId: string;
  /** Horodatage de la dernière modification (ms), utile à une future synchronisation. */
  updatedAt: number;
}

export const DEFAULT_TRIP: TripState = {
  dest: 'tokyo',
  days: 10,
  clim: 'humide',
  bagId: 'b30',
  included: suggest('humide'),
  checked: ['passeport', 'ordi', 'gan', 'merinos'],
  cmpBagId: 'b24',
  updatedAt: 0,
};
