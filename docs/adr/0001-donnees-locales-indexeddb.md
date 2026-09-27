# 0001 — Données sur l'appareil, dans IndexedDB

- Statut : accepté
- Date : 2026-09-27

## Contexte

L'app est une PWA statique (GitHub Pages) utilisée sur un seul iPhone, souvent hors ligne en voyage. Les données (sac, itinéraire, carnet, photos) étaient dans localStorage : environ 5 Mo sur iOS, photos en base64, aucune sauvegarde.

## Décision

- Les données sont stockées dans **IndexedDB**, via **Dexie** (`src/app/core/db/`). La base `travel-field-manual` a quatre tables : `trip` (enregistrement unique), `stages`, `entries` et `photos` (fichiers Blob).
- Les stores lisent la base au démarrage (`Hydration`, lancée à l'initialisation de l'app). Chaque création, modification ou suppression part ensuite dans une file d'écriture ordonnée (`WriteQueue`).
- L'accès passe par le contrat `DataRepository`, aujourd'hui implémenté par `LocalRepository`.
- L'utilisateur peut **exporter et importer une sauvegarde JSON** depuis le menu, photos comprises.
- Au premier lancement, les anciennes données localStorage (`fm-*-v1`, `fm-photo-*`) sont reprises, puis effacées une fois enregistrées.

## Pas de synchronisation pour l'instant

Firestore (hors ligne intégré) a été envisagé et reporté : un seul appareil suffit dans un premier temps. Pour préparer une migration :
- les identifiants sont des UUID ;
- chaque enregistrement porte `updatedAt` ;
- une implémentation synchronisée de `DataRepository` pourra remplacer `LocalRepository` sans toucher aux stores ni aux écrans ;
- la sauvegarde JSON peut servir de format d'import initial.

## Conséquences

- Les données ne quittent pas l'appareil. iOS peut les effacer : l'app demande un stockage persistant (`navigator.storage.persist()`), et l'export reste le filet de sécurité.
- Les tests tournent sur `fake-indexeddb` (`src/test-setup.ts`).
