import { Bag } from '../data/bags';
import { Item } from '../data/items';

/** Grammes → kilos au format français, une décimale (« 6,4 »). */
export function kgf(g: number): string {
  return (g / 1000).toFixed(1).replace('.', ',');
}

/** Poids affiché : « 130 g » sous le kilo, sinon « 1,4 kg ». */
export function weightLabel(g: number): string {
  return g < 1000 ? `${g} g` : `${kgf(g)} kg`;
}

/** Articles `per` : un pour deux jours, entre 2 et 5 ; sinon 1. */
export function qty(item: Item, days: number): number {
  return item.per ? Math.max(2, Math.min(5, Math.ceil(days / 2))) : 1;
}

/** Nom suivi de la quantité si > 1 (« T-shirt mérinos ×5 »). */
export function itemLabel(item: Item, days: number): string {
  const q = qty(item, days);
  return q > 1 ? `${item.name} ×${q}` : item.name;
}

export function itemsWeight(items: readonly Item[], days: number): number {
  return items.reduce((t, i) => t + i.w * qty(i, days), 0);
}

export interface Load {
  bag: Bag;
  /** Poids du contenu en grammes. */
  content: number;
  /** Contenu + sac à vide, en grammes. */
  total: number;
  /** Volume du contenu en litres. */
  vol: number;
}

export function load(bag: Bag, items: readonly Item[], days: number): Load {
  const content = itemsWeight(items, days);
  const vol = items.reduce((t, i) => t + i.v * qty(i, days), 0);
  return { bag, content, total: content + bag.w, vol };
}
