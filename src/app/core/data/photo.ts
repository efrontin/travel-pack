/** Photo d'un emplacement (`hero`, `j-<id fiche>`, `item-<id>`…) : fichier local ou URL web. */
export interface Photo {
  /** Identifiant de l'emplacement photo. */
  id: string;
  blob?: Blob;
  url?: string;
  updatedAt: number;
}
