import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { UiStore } from './core/state/ui.store';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('renders the five tabs', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const labels = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll('app-tab-bar a'),
    ].map((a) => a.textContent?.trim());
    expect(labels).toEqual(['Accueil', 'Itinéraire', 'Mon sac', 'Équipement', 'Carnet']);
  });

  it('opens the menu overlay and shows toasts', async () => {
    const fixture = TestBed.createComponent(App);
    const ui = TestBed.inject(UiStore);
    ui.menuOpen.set(true);
    ui.flash('Liste copiée');
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-menu')?.textContent).toContain('SACHEZ CE QUE VOUS PORTEZ.');
    expect(el.querySelector('app-toast')?.textContent).toContain('Liste copiée');
  });
});
