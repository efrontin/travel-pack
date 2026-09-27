import { inject, Injectable } from '@angular/core';
import { UiStore } from '../state/ui.store';

/**
 * File d'écriture : les enregistrements partent dans l'ordre des modifications,
 * sans bloquer l'interface. Un échec est signalé par un toast.
 */
@Injectable({ providedIn: 'root' })
export class WriteQueue {
  private readonly ui = inject(UiStore);
  private tail: Promise<void> = Promise.resolve();

  run(write: () => Promise<unknown>): void {
    this.tail = this.tail.then(write).then(
      () => undefined,
      (error: unknown) => {
        console.error(error);
        this.ui.flash('Enregistrement impossible sur cet appareil.');
      },
    );
  }

  /** Résolue quand toutes les écritures en cours sont terminées. */
  idle(): Promise<void> {
    return this.tail;
  }
}
