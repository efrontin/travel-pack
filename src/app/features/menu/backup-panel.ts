import { Component, inject, signal } from '@angular/core';
import { BackupService } from '../../core/backup/backup.service';

/** Export et import d'une sauvegarde JSON, dans le menu. */
@Component({
  selector: 'app-backup-panel',
  template: `
    <span class="title">MES DONNÉES</span>
    <p>Elles restent sur cet appareil. Exportez une sauvegarde de temps en temps.</p>
    <div class="actions">
      <button type="button" [disabled]="busy()" (click)="exportData()">Exporter</button>
      <button type="button" [disabled]="busy()" (click)="file.click()">Importer</button>
    </div>
    <input #file type="file" accept="application/json,.json" hidden (change)="importData(file)" />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 28px;
    }
    .title {
      font: 600 10px var(--sans);
      letter-spacing: 0.18em;
      color: var(--copper-light);
    }
    p {
      font: 400 13px/1.45 var(--sans);
      color: rgba(245, 240, 230, 0.72);
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 4px;
    }
    button {
      flex: 1;
      padding: 11px 6px;
      border: 1px solid rgba(245, 240, 230, 0.4);
      border-radius: 999px;
      background: transparent;
      color: var(--on-dark);
      font: 500 13px var(--sans);
    }
    button:hover {
      border-color: var(--copper-light);
      color: var(--copper-light);
    }
    button:disabled {
      opacity: 0.5;
    }
  `,
})
export class BackupPanel {
  private readonly backup = inject(BackupService);
  protected readonly busy = signal(false);

  protected async exportData(): Promise<void> {
    await this.run(() => this.backup.export());
  }

  protected async importData(input: HTMLInputElement): Promise<void> {
    const file = input.files?.[0];
    input.value = '';
    if (!file || !confirm('Remplacer toutes les données de cet appareil par cette sauvegarde ?')) {
      return;
    }
    await this.run(() => this.backup.import(file));
  }

  private async run(action: () => Promise<void>): Promise<void> {
    this.busy.set(true);
    try {
      await action();
    } finally {
      this.busy.set(false);
    }
  }
}
