# Pixel Print Lab — Brand Style Guide

Guida di stile riutilizzabile, estratta dal design system di Pixel Print Lab (by Pix3llab).
Applicabile a qualsiasi progetto che voglia seguire lo stesso linguaggio visivo.

---

## 1. Identità

| Elemento | Valore |
|---|---|
| Nome brand | **Pixel Print Lab** |
| Payoff | "Idee reali, strato dopo strato." |
| Estetica | Pixel-art / brutalismo "cartaceo": bordi neri spessi, ombre solide offset, zero sfumature, spigoli vivi |
| Lingua UI | Italiano, tono diretto e tecnico-ludico |
| Label e bottoni | Sempre MAIUSCOLO |

Riferimenti: pannello admin = "Control Room", voci di menu corte e imperative ("Io penso alla stampa, tu scegli colore e quantità").

---

## 2. Palette colori

### 2.1 Token base

```css
:root {
  color-scheme: light;
  --ink:    #17201a;  /* testo, bordi, sfondi scuri      */
  --paper:  #f3f0e6;  /* sfondo pagina "carta"           */
  --panel:  #fffdf5;  /* superfici card/pannelli         */
  --orange: #ff6534;  /* ACCENTO PRIMARIO (brand)        */
  --blue:   #4277ff;  /* accento secondario / azioni     */
  --green:  #2ba85b;  /* success / pronto                */
  --yellow: #f5c518;  /* warning / occupato              */
  --muted:  #4f574f;  /* testo secondario                */
  --line:   4px solid var(--ink);
  --page:   min(calc(100% - 2rem), 76rem);
}
```

### 2.2 Ruoli semantici

| Ruolo | Colore |
|---|---|
| Primario / brand | `#ff6534` arancione |
| Secondario / link / focus | `#4277ff` blu |
| Success | `#2ba85b` (+ badge `#70d69a`) |
| Warning / busy | `#f5c518` |
| Errore | `#9c2f22` (pubblico) · `#b63627` (admin) |
| Sfondi | `#f3f0e6` carta · `#fffdf5` pannello · `#17201a` scuro |
| Admin dark | `#111a15` sfondo · `#e8e5da` pannello invecchiato |
| Neutri su scuro | `#c8cec9`, `#9aa29c`, `#aeb5b0`, `#737a75` |
| Accenti illustrativi | pesca `#f7c9ad` · azzurro `#bfcfff` |

### 2.3 Regole d'uso

- **Solo light mode.** Lo scuro (`--ink`, `--admin-dark`) è un tema fisso per aree specifiche (header, sidebar, admin), mai un mode switch.
- Ogni sezione ha **un colore d'accento dominante** che colora ombre e focus: arancione (default/carrello), blu (viewer/account), verde (checkout/conferma).
- Backdrop modali: `rgba(23,32,26,0.78–0.88)`.
- Griglia tecnica di sfondo: `rgba(23,32,26,0.04)` su cella 24px (chiara `rgba(243,240,230,0.04)` su scuro).
- Niente gradienti decorativi. Unica eccezione: strisce animate `rgba(255,255,255,0.15)` sulle barre di avanzamento.

---

## 3. Tipografia

**Solo font di sistema, nessun webfont.**

| Ruolo | Stack |
|---|---|
| Base / tutto | `"Courier New", Courier, monospace` — firma "tecnica/terminale" |
| Display / titoli | `Arial, Helvetica, sans-serif` |

**Pesi:** solo 400 e 700.

### Scala

| Elemento | Dimensione | line-height | letter-spacing |
|---|---|---|---|
| `h1` | `clamp(3rem, 7.7vw, 6.7rem)` | 0.89 | **-0.075em** (tratto distintivo) |
| `h2` | `clamp(2rem, 5vw, 4rem)` | 0.95 | -0.055em |
| `h3` card | `clamp(1.6rem, 3vw, 2.2rem)` | — | -0.04em |
| Titoli dialog | `clamp(2rem, 7vw, 4rem)` | — | -0.055em |
| Body / intro | `clamp(1rem, 1.8vw, 1.2rem)` | 1.7 | — |
| Micro-label (kicker, legend) | 0.6–0.72rem | — | 0.08–0.12em, UPPERCASE, bold |
| Bottoni | 0.65–0.78rem | — | UPPERCASE, bold |

Mobile (≤540px): micro-testi a 0.78–0.8rem, tracking titoli rilassato a -0.03/-0.04em.

---

## 4. Logo e icone

- **Logo = CSS puro**, nessun file: quadrato arancione `#ff6534` 1.5rem con bordo 3px ink e ombra `4px 4px 0`, affiancato al wordmark `PIXEL PRINT LAB` in Courier bold uppercase.
- **Logo admin:** grafico a barre pixel — 3 barre arancioni di altezza crescente (35/60/90%) in cornice carta con ombra blu. Lo stesso motivo a barre è riusato per stampanti e conferme ordine.
- **Nessuna libreria di icone.** Solo caratteri testuali: `X` (chiudi), `⚙` (impostazioni), `</>` (editor), `↑ ↓` (riordino), `+` (nuovo), `↓` (CTA).
- **Illustrazioni:** SVG pixel-art con `shape-rendering="crispEdges"`; immagini raster con `image-rendering: pixelated`.

---

## 5. Forme, bordi, ombre

| Proprietà | Regola |
|---|---|
| **border-radius** | **0 ovunque** (design spigoloso). Unica eccezione storica: 0.25rem su un badge ordine |
| **Bordi principali** | `4px solid var(--ink)` su contenitori |
| **Bordi minori** | 3px input/card · 2px chip/opzioni |
| **Separatori** | `2px dashed` ricorrenti |

### Ombre — firma del brand: "hard shadow" offset, mai sfumate

| Scala | Valore | Uso |
|---|---|---|
| Piccola | `3px 3px 0` / `4px 4px 0` | logo, icon-button, toggle |
| Media | `5px 5px 0` / `6px 6px 0` | bottoni |
| Grande | `8px 8px 0` | card prodotto, tracker |
| XL | `10px 10px 0` / `12px 12px 0` | dialog, pannelli hero |

**Colore ombra = accento della sezione** (arancione default, blu viewer/account, verde checkout).

---

## 6. Layout e spaziature

- Larghezza pagina: `min(calc(100% - 2rem), 76rem)` (admin: 92rem)
- Padding pannelli: `clamp(1.25rem, 4vw, 2.5rem)`
- Gap sezioni: `clamp(1.5rem, 4vw, 3rem)` · hero fino a `clamp(3rem, 8vw, 8rem)`
- Padding verticale sezioni: 5–6rem
- Dialog: 36–68rem a seconda del contesto
- **Breakpoint:** 860px, 640px, 540px (pubblico) · 900px, 560px (admin)
- Supportare sempre `prefers-reduced-motion: reduce`

---

## 7. Componenti

### Bottone primario (`.pixel-button`)
Fondo ink, testo paper, uppercase 0.75rem bold, ombra arancione 6px. **Hover: inversione** (fondo arancione, ombra ink). Variante secondaria: fondo paper, bordo 3px, ombra blu.

### Card prodotto
Bordo 4px ink, ombra 8px color accento, visual 4:3 con sfondo pesca `#f7c9ad` (variante azzurro `#bfcfff`), tag codice/3D ink sull'immagine. Hover: immagine `translateY(-0.5rem)` a scatti.

### Input
Bordo 3px ink, fondo panel, bold. Focus: `outline: 3px solid` accento di contesto + offset 2px.

### Chip colore
Pill rettangolare bordo 2px + swatch quadrato; selezionato = inversione ink/paper + ombra accento.

### Dialog
`<dialog>` nativo, bordo 4px ink, ombra 12px colorata per contesto, backdrop ink semi-trasparente.

### Badge stato
`<em>` uppercase: neutro `#c8cec9`, completato `#70d69a`, in lavorazione arancione.

### Barre di avanzamento
Contenitore bordo 2px ink, fill verde con **strisce diagonali animate** a 45° (1s linear infinite).

### Link d'azione
Solo testo uppercase con `border-bottom: 2px solid currentColor` (blu o rosso).

---

## 8. Motion

Tutto **a scatti**, firma pixel-art:

```css
animation-timing-function: steps(2, jump-none); /* o steps(3), steps(5) */
```

- Lampeggi/pulsazioni: 0.7–1.2s con `steps()`
- Animazioni di scena (stampa, layer): 7s con `steps()`
- Transizioni morbide solo per: larghezza barre (`0.4s ease-out`), hover immagini (`160ms steps(2)`), `scroll-behavior: smooth`
- Viewer 3D (Three.js): damping 0.08, materiale `flatShading: true`, `roughness: 0.72`, `metalness: 0.02` (look low-poly coerente)

---

## 9. Checklist per nuovi progetti

1. Definire i token `:root` (sezione 2.1) come unica fonte di verità.
2. Solo Courier New (base) + Arial (titoli), maiuscole aggressive, tracking titoli negativo.
3. Bordi 4px ink, radius 0, ombre solide offset colorate per contesto.
4. Logo CSS: quadrato arancione + wordmark monospace.
5. Icone testuali, illustrazioni SVG `crispEdges`, immagini `pixelated`.
6. Animazioni solo con `steps()`; rispettare `prefers-reduced-motion`.
7. UI in italiano, label maiuscole, tono diretto e tecnico-ludico.
8. Nessun framework CSS, nessuna libreria icone: HTML + CSS vanilla + JS moduli ES.
