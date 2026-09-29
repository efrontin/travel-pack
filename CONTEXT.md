# Travel Field Manual

Application de voyage personnelle : préparer son sac, suivre son itinéraire, tenir un carnet.

## Langage

**Lieu**:
Une ville que l'on peut visiter, choisie dans le catalogue de l'application. Un lieu a un nom et une position sur la carte.
_À éviter_ : destination (mot réservé au voyage de départ dans la préparation du sac), ville.

**Étape**:
Un séjour dans un lieu, avec une durée en jours. Une étape correspond à un seul lieu, et un lieu n'apparaît qu'une seule fois dans l'itinéraire.
_À éviter_ : arrêt, escale.

**Itinéraire**:
La suite ordonnée des étapes du voyage. L'ordre compte : il détermine les distances entre étapes, le total et le tracé sur la carte.

**Note**:
Aide-mémoire court attaché à une étape, plutôt préparatoire (« réserver le train »). Sans lien avec le carnet.
_À éviter_ : fiche, commentaire.

**Hébergement**:
Texte libre attaché à une étape, indiquant où l'on dort.

**Fiche**:
Texte daté du carnet, écrit pendant ou après le séjour. Rattachée à une étape par son nom, mais distincte de la note de l'étape.
_À éviter_ : note.

## Relations

- Un **itinéraire** contient zéro, une ou plusieurs **étapes**, dans un ordre choisi par l'utilisateur.
- Une **étape** est faite d'un **lieu** et d'une durée. Elle peut être complétée par des informations libres de l'utilisateur (note, hébergement, dates, couleur ou icône).
- Le **lieu** d'une étape ne change pas : personnaliser une étape ne crée pas de nouveau lieu.

## Ambiguïtés levées

- « Personnaliser une étape » veut dire ajouter des informations à une étape existante. Cela ne veut pas dire créer un lieu hors catalogue.
- Une même ville ne peut pas former deux étapes.
