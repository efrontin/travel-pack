import { inject, Injectable } from '@angular/core';
import { DataRepository } from '../db/data-repository';
import { WriteQueue } from '../db/write-queue';
import { Hydration } from '../state/hydration';
import { UiStore } from '../state/ui.store';
import { backupFileName, fromBackupJson, toBackupJson } from './backup';

@Injectable({ providedIn: 'root' })
export class BackupService {
  private readonly repo = inject(DataRepository);
  private readonly queue = inject(WriteQueue);
  private readonly hydration = inject(Hydration);
  private readonly ui = inject(UiStore);

  /** Exporte toutes les données dans un fichier JSON (partage sur mobile, sinon téléchargement). */
  async export(): Promise<void> {
    await this.queue.idle();
    const json = await toBackupJson(await this.repo.load());
    const file = new File([json], backupFileName(), { type: 'application/json' });
    if (await share(file)) return;
    const url = URL.createObjectURL(file);
    const link = Object.assign(document.createElement('a'), { href: url, download: file.name });
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.ui.flash('Sauvegarde téléchargée.');
  }

  /** Remplace toutes les données par celles du fichier. */
  async import(file: File): Promise<void> {
    let snapshot;
    try {
      snapshot = fromBackupJson(await file.text());
    } catch (error) {
      this.ui.flash((error as Error).message);
      return;
    }
    try {
      await this.queue.idle();
      await this.repo.replaceAll(snapshot);
      this.hydration.apply(await this.repo.load());
      this.ui.flash('Sauvegarde importée.');
    } catch (error) {
      console.error(error);
      this.ui.flash('Import impossible sur cet appareil.');
    }
  }
}

/**
 * Feuille de partage native sur écran tactile (iPhone : Enregistrer dans Fichiers…).
 * Renvoie `false` si le partage est indisponible ou échoue, pour basculer sur le téléchargement.
 */
async function share(file: File): Promise<boolean> {
  const touch = matchMedia('(pointer: coarse)').matches;
  if (!touch || !navigator.canShare?.({ files: [file] })) return false;
  try {
    await navigator.share({ files: [file], title: 'Sauvegarde Field Manual' });
    return true;
  } catch (error) {
    // Annulé par l'utilisateur : rien d'autre à faire.
    return (error as DOMException).name === 'AbortError';
  }
}
