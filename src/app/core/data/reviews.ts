export interface Review {
  n: string;
  days: number;
  trips: string;
  likes: string[];
  dislikes: string[];
  verdict: string;
}

export const REVIEWS: Readonly<Record<string, Review>> = {
  b30: {
    n: 'FICHE TEST / 026',
    days: 14,
    trips: '2 VOLS',
    likes: ['Ouverture façon valise', 'Accès rapide aux papiers', 'Format cabine'],
    dislikes: ['1,4 kg à vide', 'Poche gourde étroite'],
    verdict:
      'Pour qui part deux semaines avec un seul sac et veut tout voir d’un coup d’œil en l’ouvrant.',
  },
  b24: {
    n: 'FICHE TEST / 031',
    days: 9,
    trips: '1 VOL',
    likes: ['Très léger', 'Se glisse sous le siège'],
    dislikes: ['Aucune armature', 'Peu de rangement interne'],
    verdict: 'Pour les week-ends et les voyageurs minimalistes qui lavent en route.',
  },
  v40: {
    n: 'FICHE TEST / 019',
    days: 21,
    trips: '4 VOLS',
    likes: ['Protège le matériel photo', 'Roule sans effort en gare'],
    dislikes: ['2,3 kg à vide', 'Pénible dans les escaliers'],
    verdict: 'Pour les séjours urbains avec peu de marche et du matériel fragile.',
  },
  gan: {
    n: 'FICHE TEST / 012',
    days: 40,
    trips: '6 PAYS',
    likes: ['Charge ordinateur et téléphone ensemble', 'Petit et froid au toucher'],
    dislikes: ['Pas de prise intégrée'],
    verdict: 'Le seul chargeur à emporter si vous avez des appareils USB-C.',
  },
  merinos: {
    n: 'FICHE TEST / 008',
    days: 30,
    trips: '3 PAYS',
    likes: ['Ne garde pas les odeurs', 'Sèche en une nuit'],
    dislikes: ['Fragile au frottement des bretelles'],
    verdict: 'Trois suffisent pour dix jours avec une lessive au lavabo.',
  },
  pluie: {
    n: 'FICHE TEST / 017',
    days: 12,
    trips: 'JAPON',
    likes: ['Se range dans sa poche', 'Vraiment étanche'],
    dislikes: ['Respire mal en été'],
    verdict: 'Pour l’automne et le printemps humides. En plein été, préférez un parapluie.',
  },
  hybride: {
    n: 'FICHE TEST / 022',
    days: 18,
    trips: 'JAPON',
    likes: ['Discret en ville', 'Rendu des couleurs'],
    dislikes: ['Autonomie courte'],
    verdict: 'Pour qui veut plus qu’un téléphone sans porter un reflex.',
  },
};
