export type Climate = 'chaud' | 'doux' | 'froid' | 'humide';
export const CLIMATES: readonly Climate[] = ['chaud', 'doux', 'froid', 'humide'];

export type CompartmentId = 'main' | 'ordi' | 'avant' | 'acces' | 'lat';
export const COMPS: Record<CompartmentId, string> = {
  main: 'Compartiment principal',
  ordi: 'Poche ordinateur',
  avant: 'Poche organisateur',
  acces: 'Accès rapide',
  lat: 'Poches latérales',
};

export type ItemCategory = 'Vêtements' | 'Tech' | 'Photo' | 'Trousse' | 'Accessoires';
export const ITEM_CATEGORIES: readonly ItemCategory[] = [
  'Vêtements',
  'Tech',
  'Photo',
  'Trousse',
  'Accessoires',
];

export interface Item {
  id: string;
  name: string;
  brand: string;
  cat: ItemCategory;
  /** Poids unitaire en grammes. */
  w: number;
  /** Volume unitaire en litres. */
  v: number;
  comp: CompartmentId;
  /** Quantité dépendante de la durée (voir `qty`). */
  per?: boolean;
  /** Optionnel : jamais suggéré automatiquement. */
  opt?: boolean;
  /** Climats pour lesquels l'objet est suggéré ; absent = tous. */
  clim?: Climate[];
}

export const ITEMS: readonly Item[] = [
  {
    id: 'merinos',
    name: 'T-shirt mérinos',
    brand: 'Laine 150 g/m²',
    cat: 'Vêtements',
    w: 130,
    v: 0.6,
    comp: 'main',
    per: true,
  },
  {
    id: 'chaussettes',
    name: 'Chaussettes techniques',
    brand: 'Mérinos mi-hautes',
    cat: 'Vêtements',
    w: 45,
    v: 0.15,
    comp: 'main',
    per: true,
  },
  {
    id: 'pantalon',
    name: 'Pantalon de voyage',
    brand: 'Stretch déperlant',
    cat: 'Vêtements',
    w: 380,
    v: 1.4,
    comp: 'main',
  },
  {
    id: 'short',
    name: 'Short',
    brand: 'Séchage rapide',
    cat: 'Vêtements',
    w: 180,
    v: 0.6,
    comp: 'main',
    clim: ['chaud', 'humide'],
  },
  {
    id: 'pull',
    name: 'Pull léger',
    brand: 'Mérinos col rond',
    cat: 'Vêtements',
    w: 280,
    v: 1.6,
    comp: 'main',
    clim: ['doux', 'froid', 'humide'],
  },
  {
    id: 'doudoune',
    name: 'Doudoune compressible',
    brand: 'Duvet 800 cuin',
    cat: 'Vêtements',
    w: 260,
    v: 2,
    comp: 'main',
    clim: ['froid'],
  },
  {
    id: 'pluie',
    name: 'Veste de pluie',
    brand: 'Membrane 3 couches',
    cat: 'Vêtements',
    w: 310,
    v: 1.2,
    comp: 'main',
    clim: ['doux', 'froid', 'humide'],
  },
  {
    id: 'ordi',
    name: 'Ordinateur 13″',
    brand: 'Ultraportable',
    cat: 'Tech',
    w: 1240,
    v: 1.2,
    comp: 'ordi',
  },
  {
    id: 'gan',
    name: 'Chargeur GaN 65 W',
    brand: '3 ports USB-C',
    cat: 'Tech',
    w: 120,
    v: 0.2,
    comp: 'avant',
  },
  {
    id: 'batterie',
    name: 'Batterie 10 000 mAh',
    brand: 'Charge rapide 30 W',
    cat: 'Tech',
    w: 180,
    v: 0.2,
    comp: 'avant',
  },
  {
    id: 'adapt',
    name: 'Adaptateur universel',
    brand: 'Types A, C, G, I',
    cat: 'Tech',
    w: 90,
    v: 0.15,
    comp: 'avant',
  },
  {
    id: 'ecouteurs',
    name: 'Écouteurs à réduction de bruit',
    brand: 'Étui compact',
    cat: 'Tech',
    w: 50,
    v: 0.1,
    comp: 'acces',
  },
  {
    id: 'liseuse',
    name: 'Liseuse',
    brand: 'Écran 7″',
    cat: 'Tech',
    w: 190,
    v: 0.2,
    comp: 'ordi',
    opt: true,
  },
  {
    id: 'hybride',
    name: 'Appareil hybride',
    brand: 'Capteur APS-C',
    cat: 'Photo',
    w: 480,
    v: 1,
    comp: 'main',
    opt: true,
  },
  {
    id: 'objectif',
    name: 'Objectif 23 mm',
    brand: 'Focale fixe f/2',
    cat: 'Photo',
    w: 180,
    v: 0.3,
    comp: 'main',
    opt: true,
  },
  {
    id: 'trousse',
    name: 'Trousse de toilette',
    brand: 'Formats < 100 ml',
    cat: 'Trousse',
    w: 340,
    v: 1.2,
    comp: 'main',
  },
  {
    id: 'pharma',
    name: 'Pharmacie de voyage',
    brand: 'Essentiels',
    cat: 'Trousse',
    w: 150,
    v: 0.4,
    comp: 'main',
  },
  {
    id: 'solaire',
    name: 'Crème solaire SPF 50',
    brand: '50 ml',
    cat: 'Trousse',
    w: 70,
    v: 0.1,
    comp: 'main',
    clim: ['chaud', 'humide'],
  },
  {
    id: 'passeport',
    name: 'Passeport',
    brand: 'Documents',
    cat: 'Accessoires',
    w: 40,
    v: 0.05,
    comp: 'acces',
  },
  {
    id: 'carnet',
    name: 'Carnet + stylo',
    brand: 'A6 papier ivoire',
    cat: 'Accessoires',
    w: 120,
    v: 0.2,
    comp: 'acces',
  },
  {
    id: 'cubes',
    name: 'Cubes de rangement ×2',
    brand: 'Compression',
    cat: 'Accessoires',
    w: 140,
    v: 0,
    comp: 'main',
  },
  {
    id: 'gourde',
    name: 'Gourde isotherme',
    brand: '500 ml',
    cat: 'Accessoires',
    w: 160,
    v: 0.6,
    comp: 'lat',
  },
  {
    id: 'parapluie',
    name: 'Parapluie pliant',
    brand: 'Automatique',
    cat: 'Accessoires',
    w: 230,
    v: 0.4,
    comp: 'lat',
    clim: ['humide', 'doux'],
  },
  {
    id: 'couteau',
    name: 'Couteau de poche',
    brand: 'EDC · lame 6 cm',
    cat: 'Accessoires',
    w: 70,
    v: 0.05,
    comp: 'acces',
    opt: true,
  },
];

/** Liste suggérée : objets non optionnels adaptés au climat. */
export function suggest(clim: Climate): string[] {
  return ITEMS.filter((i) => !i.opt && (!i.clim || i.clim.includes(clim))).map((i) => i.id);
}
