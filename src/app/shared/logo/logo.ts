import { Component } from '@angular/core';

/** Montagne au trait, couleur héritée (`currentColor`). */
@Component({
  selector: 'app-logo',
  template: `
    <svg
      width="34"
      height="22"
      viewBox="0 0 34 22"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      aria-hidden="true"
    >
      <path d="M1 21 11 5l6 9 4-5 12 12z" />
      <path d="M8 10l3 2 3-3" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
    }
  `,
})
export class Logo {}
