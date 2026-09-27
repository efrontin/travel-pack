import { booleanAttribute, Component, computed, inject, input, signal } from '@angular/core';
import { PhotoStore } from '../../core/state/photo.store';

const MAX_SIDE = 1280;

/** Réduit l'image au plus à MAX_SIDE px (JPEG) pour limiter la place occupée. */
function downscale(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * k);
      canvas.height = Math.round(img.height * k);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Image illisible'))),
        'image/jpeg',
        0.82,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image illisible'));
    };
    img.src = url;
  });
}

/**
 * Emplacement photo : bloc `--paper-3` légendé tant qu'il est vide.
 * Toucher pour choisir un fichier, glisser un fichier ou une image web, ou coller une URL.
 * L'image est gardée dans la base de l'appareil (voir `PhotoStore`).
 */
@Component({
  selector: 'app-photo-slot',
  template: `
    @if (src(); as url) {
      <img [src]="url" [alt]="placeholder()" />
      <button type="button" class="remove" aria-label="Retirer la photo" (click)="set('')">
        ×
      </button>
    } @else {
      <button type="button" class="empty" (click)="file.click()">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
        </svg>
        @if (!compact()) {
          <span class="caption">{{ placeholder() }}</span>
          <span class="hint">Toucher pour ajouter · <u (click)="askUrl($event)">URL</u></span>
        } @else {
          <span class="sr-only">{{ placeholder() }}</span>
        }
      </button>
    }
    <input #file type="file" accept="image/*" hidden (change)="pick(file)" />
  `,
  host: {
    '[class.dark]': "tone() === 'dark'",
    '[class.dragging]': 'dragging()',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'dragging.set(false)',
    '(drop)': 'onDrop($event)',
  },
  styles: `
    :host {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: var(--paper-3);
      color: var(--muted);
    }
    :host(.dark) {
      background: transparent;
      color: rgba(245, 240, 230, 0.55);
    }
    :host(.dragging) {
      outline: 2px dashed var(--copper);
      outline-offset: -6px;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .empty {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px;
      border: 0;
      background: none;
      color: inherit;
      text-align: center;
    }
    .caption {
      font: 500 13px var(--sans);
    }
    .hint {
      font: 400 11px var(--sans);
      opacity: 0.8;
    }
    .remove {
      position: absolute;
      right: 8px;
      bottom: 8px;
      z-index: 2;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 0;
      background: rgba(29, 33, 30, 0.55);
      color: var(--on-dark);
      font: 300 16px/1 var(--sans);
    }
  `,
})
export class PhotoSlot {
  readonly slotId = input.required<string>();
  readonly placeholder = input('Photo');
  readonly tone = input<'light' | 'dark'>('light');
  /** Vignette : icône seule. */
  readonly compact = input(false, { transform: booleanAttribute });

  protected readonly dragging = signal(false);
  private readonly photos = inject(PhotoStore);
  protected readonly src = computed(() => this.photos.src(this.slotId()));

  protected set(source: Blob | string): void {
    if (source) this.photos.set(this.slotId(), source);
    else this.photos.remove(this.slotId());
  }

  protected async pick(input: HTMLInputElement): Promise<void> {
    const file = input.files?.[0];
    input.value = '';
    if (file) this.set(await downscale(file));
  }

  protected askUrl(event: Event): void {
    event.stopPropagation();
    const url = prompt('Adresse de l’image (https://…)')?.trim();
    if (url && /^https?:\/\//.test(url)) this.set(url);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  protected async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    this.dragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file?.type.startsWith('image/')) {
      this.set(await downscale(file));
      return;
    }
    const url = event.dataTransfer?.getData('text/uri-list').split('\n')[0]?.trim();
    if (url && /^https?:\/\//.test(url)) this.set(url);
  }
}
