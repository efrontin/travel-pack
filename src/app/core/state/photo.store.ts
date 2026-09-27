import { inject, Injectable, signal } from '@angular/core';
import { Photo } from '../data/photo';
import { DataRepository } from '../db/data-repository';
import { WriteQueue } from '../db/write-queue';

/** Photos des emplacements, gardées en fichiers dans la base de l'appareil. */
@Injectable({ providedIn: 'root' })
export class PhotoStore {
  private readonly repo = inject(DataRepository);
  private readonly queue = inject(WriteQueue);
  /** Emplacement → adresse affichable (`blob:` ou `https:`). */
  private readonly sources = signal<ReadonlyMap<string, string>>(new Map());

  /** Adresse de la photo d'un emplacement, ou chaîne vide. */
  src(id: string): string {
    return this.sources().get(id) ?? '';
  }

  /** Charge les photos enregistrées (sans les réécrire). */
  hydrate(photos: Photo[]): void {
    this.sources().forEach(revoke);
    this.sources.set(
      new Map(photos.map((p) => [p.id, display(p)] as const).filter(([, src]) => src)),
    );
  }

  /** Enregistre un fichier image ou une URL web pour l'emplacement. */
  set(id: string, source: Blob | string): void {
    const photo: Photo =
      typeof source === 'string'
        ? { id, url: source, updatedAt: Date.now() }
        : { id, blob: source, updatedAt: Date.now() };
    this.replace(id, display(photo));
    this.queue.run(() => this.repo.putPhoto(photo));
  }

  remove(id: string): void {
    if (!this.sources().has(id)) return;
    this.replace(id, '');
    this.queue.run(() => this.repo.deletePhoto(id));
  }

  private replace(id: string, src: string): void {
    const next = new Map(this.sources());
    revoke(next.get(id) ?? '');
    if (src) next.set(id, src);
    else next.delete(id);
    this.sources.set(next);
  }
}

function display(photo: Photo): string {
  return photo.blob ? URL.createObjectURL(photo.blob) : (photo.url ?? '');
}

function revoke(src: string): void {
  if (src.startsWith('blob:')) URL.revokeObjectURL(src);
}
