export interface JournalEntry {
  id: string;
  title: string;
  /** Date ISO `YYYY-MM-DD`. */
  date: string;
  stage: string;
  text: string;
  /** Horodatage de la dernière modification (ms), utile à une future synchronisation. */
  updatedAt: number;
}

export const DEFAULT_ENTRIES: JournalEntry[] = [
  {
    id: 'e1',
    title: 'Tokyo, entre tradition et modernité',
    date: '2026-09-12',
    stage: 'Tokyo',
    text: "Dès la sortie de la gare de Shinjuku, la ville impose son rythme : néons, foule dense, puis un temple silencieux deux rues plus loin. Chaque quartier a son caractère. J'ai marché plus de vingt kilomètres le premier jour, le sac allégé au minimum, et je n'ai regretté que l'absence d'un parapluie.",
    updatedAt: 0,
  },
  {
    id: 'e2',
    title: 'Premier bain à Kusatsu',
    date: '2026-09-20',
    stage: 'Kusatsu Onsen',
    text: "L'odeur de soufre arrive avant le village. Le yubatake fume au centre de la place. Serviette, yukata et sandales sont fournis par le ryokan : tout ce que j'avais prévu pour le soir est resté au fond du sac.",
    updatedAt: 0,
  },
  {
    id: 'e3',
    title: "Ce que j'aurais laissé à la maison",
    date: '2026-09-22',
    stage: 'Nagano',
    text: "Bilan à mi-parcours : le deuxième pull n'est jamais sorti, la batterie a servi tous les jours. La veste de pluie a sauvé la montée vers Togakushi.",
    updatedAt: 0,
  },
];
