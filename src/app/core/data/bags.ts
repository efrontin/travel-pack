export interface Bag {
  id: string;
  name: string;
  brand: string;
  /** Poids à vide en grammes. */
  w: number;
  /** Capacité en litres. */
  cap: number;
}

export const BAGS: readonly Bag[] = [
  { id: 'b30', name: 'Sac de voyage 30 L', brand: 'Ouverture valise · cabine', w: 1400, cap: 30 },
  { id: 'b24', name: 'Sac à dos 24 L', brand: 'Léger, sans armature', w: 900, cap: 24 },
  { id: 'v40', name: 'Valise cabine 40 L', brand: 'Coque rigide · 4 roues', w: 2300, cap: 40 },
];

export function bagById(id: string): Bag {
  return BAGS.find((b) => b.id === id) ?? BAGS[0];
}

/** Limite de poids cabine par défaut, en kg. */
export const CABIN_LIMIT_KG = 8;
