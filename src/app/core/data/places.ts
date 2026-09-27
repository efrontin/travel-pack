import { Climate } from './items';

export interface Destination {
  name: string;
  lat: string;
  lng: string;
  route: string;
  clim: Climate;
}

export type DestinationId = 'tokyo' | 'nagano' | 'lisbonne' | 'marrakech';

export const DESTS: Record<DestinationId, Destination> = {
  tokyo: {
    name: 'Tokyo',
    lat: '35° 41′ 22″ N',
    lng: '139° 41′ 30″ E',
    route: 'TOKYO → NAGANO',
    clim: 'humide',
  },
  nagano: {
    name: 'Nagano',
    lat: '36° 38′ 54″ N',
    lng: '138° 11′ 41″ E',
    route: 'NAGANO → KUSATSU',
    clim: 'froid',
  },
  lisbonne: {
    name: 'Lisbonne',
    lat: '38° 43′ 20″ N',
    lng: '9° 08′ 21″ W',
    route: 'LISBONNE → PORTO',
    clim: 'doux',
  },
  marrakech: {
    name: 'Marrakech',
    lat: '31° 37′ 46″ N',
    lng: '7° 58′ 52″ W',
    route: 'MARRAKECH → ESSAOUIRA',
    clim: 'chaud',
  },
};

export interface Place {
  name: string;
  lat: number;
  lng: number;
}

export const PLACES: Readonly<Record<string, Place>> = {
  tokyo: { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  nikko: { name: 'Nikkō', lat: 36.7199, lng: 139.6982 },
  hakone: { name: 'Hakone', lat: 35.2324, lng: 139.1069 },
  nagano: { name: 'Nagano', lat: 36.6485, lng: 138.1942 },
  kusatsu: { name: 'Kusatsu Onsen', lat: 36.6206, lng: 138.5961 },
  matsumoto: { name: 'Matsumoto', lat: 36.238, lng: 137.972 },
  takayama: { name: 'Takayama', lat: 36.1461, lng: 137.2522 },
  kanazawa: { name: 'Kanazawa', lat: 36.5613, lng: 136.6562 },
  kyoto: { name: 'Kyoto', lat: 35.0116, lng: 135.7681 },
  nara: { name: 'Nara', lat: 34.6851, lng: 135.8048 },
  osaka: { name: 'Osaka', lat: 34.6937, lng: 135.5023 },
  hiroshima: { name: 'Hiroshima', lat: 34.3853, lng: 132.4553 },
};

export interface Stage {
  id: string;
  place: string;
  days: number;
  /** Horodatage de la dernière modification (ms), utile à une future synchronisation. */
  updatedAt: number;
}

export const DEFAULT_STAGES: Stage[] = [
  { id: 's1', place: 'tokyo', days: 7, updatedAt: 0 },
  { id: 's2', place: 'nagano', days: 5, updatedAt: 0 },
  { id: 's3', place: 'kusatsu', days: 2, updatedAt: 0 },
];
