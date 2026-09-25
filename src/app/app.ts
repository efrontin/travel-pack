import { Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { UiStore } from './core/state/ui.store';
import { TabBar } from './shared/tab-bar/tab-bar';
import { Toast } from './shared/toast/toast';

@Component({
  imports: [RouterOutlet, TabBar, Toast],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly ui = inject(UiStore);
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');

  constructor() {
    const sub = inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.scroller().nativeElement.scrollTop = 0;
        this.ui.menuOpen.set(false);
      });
    inject(DestroyRef).onDestroy(() => sub.unsubscribe());
  }
}
