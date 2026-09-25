import { BAGS } from './bags';
import { ITEMS, ItemCategory } from './items';
import { REVIEWS } from './reviews';

export type CatalogCategory = 'Sacs' | ItemCategory;
export const CATALOG_TABS: readonly ('Tout' | CatalogCategory)[] = [
  'Tout',
  'Sacs',
  'Tech',
  'Vêtements',
  'Photo',
  'Trousse',
  'Accessoires',
];

export interface CatalogEntry {
  id: string;
  name: string;
  brand: string;
  cat: CatalogCategory;
  w: number;
  isBag: boolean;
  tested: boolean;
}

/** Sacs puis objets, dans l'ordre du catalogue. */
export const CATALOG: readonly CatalogEntry[] = [
  ...BAGS.map((b) => ({ ...b, cat: 'Sacs' as const, isBag: true })),
  ...ITEMS.map((i) => ({
    id: i.id,
    name: i.name,
    brand: i.brand,
    cat: i.cat,
    w: i.w,
    isBag: false,
  })),
].map((x) => ({ ...x, tested: x.id in REVIEWS }));
