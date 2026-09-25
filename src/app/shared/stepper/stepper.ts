import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-stepper',
  template: `
    <button
      type="button"
      aria-label="Un jour de moins"
      [disabled]="value() <= min()"
      (click)="value.set(value() - 1)"
    >
      −
    </button>
    <span aria-live="polite">{{ value() }}</span>
    <button type="button" aria-label="Un jour de plus" (click)="value.set(value() + 1)">+</button>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: transparent;
      font: 400 15px var(--sans);
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    span {
      min-width: 20px;
      text-align: center;
      font: 600 13px var(--sans);
    }
  `,
})
export class Stepper {
  readonly value = model.required<number>();
  readonly min = input(1);
}
