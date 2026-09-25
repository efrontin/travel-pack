import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { PLACES } from '../../core/data/places';
import { RouteStore } from '../../core/state/route.store';

const JAPAN_CENTER: L.LatLngExpression = [36.2, 138.25];

/** Carte de l'itinéraire : repères numérotés reliés par une polyligne pointillée. */
@Component({
  selector: 'app-route-map',
  template: `
    <div #map class="fm-map"></div>
    <button type="button" class="recenter" aria-label="Recentrer la carte" (click)="draw()">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M3 11 21 3l-8 18-2-8z" />
      </svg>
    </button>
  `,
  styles: `
    :host {
      position: relative;
      display: block;
      height: 320px;
      background: #e4ddcf;
    }
    .fm-map {
      position: absolute;
      inset: 0;
      z-index: 0;
    }
    .recenter {
      position: absolute;
      right: 14px;
      bottom: 22px;
      z-index: 500;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 0;
      background: var(--on-dark);
      color: var(--ink);
      box-shadow: 0 2px 8px rgba(29, 33, 30, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
})
export class RouteMap implements OnDestroy {
  private readonly route = inject(RouteStore);
  private readonly host = viewChild.required<ElementRef<HTMLElement>>('map');
  private map?: L.Map;
  private layer?: L.LayerGroup;

  constructor() {
    afterNextRender(() => {
      this.map = L.map(this.host().nativeElement, {
        zoomControl: false,
        scrollWheelZoom: false,
      });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }).addTo(this.map);
      this.layer = L.layerGroup().addTo(this.map);
      this.draw();
    });
    effect(() => {
      this.route.stages();
      this.draw();
    });
  }

  protected draw(): void {
    const map = this.map;
    const layer = this.layer;
    if (!map || !layer) return;
    map.invalidateSize();
    layer.clearLayers();
    const stages = this.route.stages();
    const pts = stages.map((s): L.LatLngTuple => [PLACES[s.place].lat, PLACES[s.place].lng]);
    if (!pts.length) {
      map.setView(JAPAN_CENTER, 6);
      return;
    }
    if (pts.length > 1) {
      L.polyline(pts, { color: '#1f3b33', weight: 2, dashArray: '5 6' }).addTo(layer);
    }
    stages.forEach((s, i) => {
      const left = i % 2 === 1;
      const icon = L.divIcon({
        className: '',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        html: `<div class="fm-marker">${i + 1}</div>`,
      });
      L.marker(pts[i], { icon, keyboard: false })
        .bindTooltip(
          `${PLACES[s.place].name.toUpperCase()}<br><small>${s.days} ${s.days > 1 ? 'JOURS' : 'JOUR'}</small>`,
          {
            permanent: true,
            direction: left ? 'left' : 'right',
            offset: [left ? -12 : 12, 0],
            className: 'fm-tip',
          },
        )
        .addTo(layer);
    });
    if (pts.length === 1) map.setView(pts[0], 9);
    else map.fitBounds(pts, { padding: [60, 60] });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
