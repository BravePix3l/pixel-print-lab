---
type: design-system
project: PIX3LLAB Brand Foundation
status: v1
language: it
---

# PIX3LLAB — Sistema visivo v1

## Obiettivo

Definire il nucleo visivo riutilizzabile da tutti i progetti PIX3LLAB senza trasformarli in copie di Pixel Print Lab.

## Principio

**Nucleo stabile, espressione locale.**

Ogni progetto eredita struttura, materia e tono del laboratorio; sceglie invece un proprio accento e un proprio motivo legato alla sua funzione.

## Asset del marchio

Il marchio approvato è **Pixel Triade, variante B / Tecnica**: tre pixel scuri dentro una cornice arancione, con una quarta casella aperta. La geometria è: cornice 10%, pixel 20%, distanza 10%.

| Asset | Uso |
|---|---|
| `PIX3LLAB-mark.svg` | icona principale, badge, avatar, header |
| `PIX3LLAB-favicon.svg` | favicon e icona minima |
| `PIX3LLAB-wordmark.svg` | wordmark vettoriale in tracciati, senza dipendenza dal font |
| `PIX3LLAB-lockup-light.svg` | lockup per superfici chiare |
| `PIX3LLAB-lockup-dark.svg` | lockup per superfici ink/scure |

## Palette core

| Token | Valore | Ruolo |
|---|---:|---|
| Ink | `#17201a` | struttura, testo, bordi, fondi scuri |
| Paper | `#f3f0e6` | fondo principale |
| Panel | `#fffdf5` | superfici e pannelli |
| Signal orange | `#ff6534` | firma PIX3LLAB e call to action principali |
| Blue | `#4277ff` | profondità, link e azioni secondarie |
| Green | `#2ba85b` | piccoli LED di stato positivo; mai superfici o accento decorativo |
| Muted | `#4f574f` | testo secondario |

L’arancione firma PIX3LLAB; non deve riempire ogni superficie. Ink, paper e spazio vuoto fanno metà del lavoro.

## Geometria e materia

- `border-radius: 0` per gli elementi principali.
- Bordi netti: 4 px per strutture, 3 px per controlli.
- Ombre solide offset, mai sfumate.
- Griglia tecnica discreta da 24 px, visibile solo come texture di supporto.
- Icone e illustrazioni in SVG con geometria netta; pixel art quando aggiunge significato.

## Tipografia

| Ruolo | Font | Uso |
|---|---|---|
| Display / wordmark | Dogica Bold | nome PIX3LLAB e titoli grandi, molto brevi |
| UI, label e micro-testi | Arial / Helvetica | navigazione, badge, pulsanti, dati brevi e contenuti leggibili |
| Corpo | Arial / Helvetica | paragrafi, contenuti e UI leggibile |

- Titoli compatti con tracking negativo controllato.
- Nelle tagline, l’ultima unità semantica — inclusa la punteggiatura finale — usa Signal orange; per la firma ufficiale: `pixel by pixel.`.
- Label e azioni in maiuscolo, senza abusarne nel testo lungo.
- Corpo testo leggibile: non trattare ogni paragrafo come output di terminale.

## Movimento

- Micro-interazioni a scatti con `steps()`.
- Niente gradienti decorativi o ombre morbide.
- `prefers-reduced-motion` sempre supportato.
- Il movimento deve indicare stato, progresso o interazione; non fare il giocoliere senza motivo.

## Varianti per progetto

Ogni prodotto definisce soltanto:

1. un accento locale;
2. un accento morbido per visual/card;
3. un motivo semantico;
4. eventuali stati specifici.

| Progetto | Motivo locale | Accento previsto |
|---|---|---|
| PIX3LLAB | Pixel Triade / griglia | arancione segnale |
| Pixel Print Lab | layer, barre, stampa | arancione + blu; verde solo come LED di stato |
| Progetto futuro | da definire in base alla funzione | non duplicare automaticamente Pixel Print Lab |

## Regole di esclusione

- Non usare pixel ovunque solo perché il brand li ama.
- Non applicare a un tool serio elementi giocosi che peggiorano la chiarezza.
- Non usare logo o lockup in spazi troppo piccoli: lì va solo il marchio.
- Non imitare il design system di Pixel Print Lab quando il problema del prodotto è diverso.

## File sorgente

I file approvati per uso pubblico sono raccolti in `Definitivi/SVG/` (master vettoriali), `Definitivi/PNG/` (esportazioni raster) e `Definitivi/Guide/` (specifiche di costruzione). I sorgenti, i font, le licenze e i token CSS restano in `04 - Sorgenti/`; le prove visuali sono conservate in `02 - Processo/`.
