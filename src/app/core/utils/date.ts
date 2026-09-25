/** `2026-09-12` → `12 SEPTEMBRE 2026` ; chaîne vide si invalide. */
export function frDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  if (isNaN(d.getTime())) return '';
  return d
    .toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    .toUpperCase();
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
