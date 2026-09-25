import { Injectable, signal } from '@angular/core';

const TOAST_MS = 2200;

@Injectable({ providedIn: 'root' })
export class UiStore {
  readonly menuOpen = signal(false);
  readonly toast = signal('');
  private timer?: ReturnType<typeof setTimeout>;

  flash(message: string): void {
    this.toast.set(message);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.toast.set(''), TOAST_MS);
  }
}
