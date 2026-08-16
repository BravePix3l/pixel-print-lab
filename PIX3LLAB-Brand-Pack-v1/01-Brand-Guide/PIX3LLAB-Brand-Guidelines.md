# PIX3LLAB — Linee guida del brand

**Versione:** 1.0  
**Lingua del manuale:** italiano  
**Fonte di verità degli asset:** `02-Final-Assets/`

---

## 1. Identità

| Elemento | Approvato |
|---|---|
| Nome | **PIX3LLAB** |
| Descriptor | **PERSONAL DIGITAL LAB** |
| Firma | **Tools, ideas & experiments built pixel by pixel.** |
| Identità online | **BravePix3l** |

PIX3LLAB è il laboratorio digitale personale di Mauro: uno spazio non commerciale per tool utili, sistemi auto-ospitati, progetti maker, automazioni e sperimentazione tecnica curata.

Il tono è **diretto, tecnicamente curioso, pratico e leggermente giocoso**. Evitare il linguaggio da startup, la patina corporate e il cyberpunk generico: i pixel sono struttura e materia, non arredamento nostalgico.

### Architettura

PIX3LLAB è l’identità ombrello. I singoli prodotti mantengono il loro nome e la loro personalità, ma ereditano il nucleo visivo del laboratorio. Pixel Print Lab è un progetto PIX3LLAB, non il brand ombrello.

---

## 2. Marchio

Il marchio approvato è **Pixel Triade — variante B / Tecnica**:

- tre pixel scuri dentro una cornice arancione;
- una quarta casella aperta, come spazio per l’esperimento;
- rapporto geometrico: **cornice 10% · pixel 20% · distanza 10%**.

### Asset corretti per ogni uso

| File | Utilizzo |
|---|---|
| `SVG/PIX3LLAB-mark.svg` | icona principale, avatar, badge, header |
| `SVG/PIX3LLAB-favicon.svg` | favicon e icona minima |
| `SVG/PIX3LLAB-wordmark.svg` | wordmark vettoriale |
| `SVG/PIX3LLAB-lockup-light.svg` | lockup su fondo chiaro |
| `SVG/PIX3LLAB-lockup-dark.svg` | lockup su fondo ink/scuro |

**Regola di dimensione:** in spazi piccoli usare esclusivamente il marchio, mai il lockup completo.

### Varianti chiara e scura

Le varianti light e dark condividono esattamente geometria, scala, box, ancoraggi e baseline. Nella variante scura cambia **solo** il colore della cornice strutturale del marchio: da Ink a Paper.

Non aggiungere un contorno esterno bianco, non rimpicciolire il marchio e non alterare i rapporti per risolvere problemi di contrasto.

### Specifica del lockup

| Proprietà | Valore |
|---|---:|
| Canvas SVG | 960 × 200 |
| Marchio | x 30 · y 30 · 140 × 140 |
| Scala marchio | 1.4 |
| Wordmark | x 200 · baseline y 103 |
| Descriptor | x 202 · baseline y 156 |
| Gap marchio/wordmark | 30 |

La specifica macchina completa è in `02-Final-Assets/Guide/PIX3LLAB-lockup-spec.json`; la tavola di costruzione è nella stessa cartella.

---

## 3. Palette

| Token | HEX | Ruolo |
|---|---|---|
| Ink | `#17201a` | struttura, testo, bordi, fondi scuri |
| Paper | `#f3f0e6` | fondo principale |
| Panel | `#fffdf5` | superfici e pannelli |
| Signal orange | `#ff6534` | firma PIX3LLAB e CTA principali |
| Blue | `#4277ff` | profondità, link e azioni secondarie |
| Green | `#2ba85b` | **solo** piccoli LED di stato positivo |
| Muted | `#4f574f` | testo secondario |

L’arancione è la firma, non una vernice da versare su ogni superficie. Ink, Paper e spazio vuoto fanno metà del lavoro.

---

## 4. Tipografia e testo

| Ruolo | Font | Regola d’uso |
|---|---|---|
| Display / wordmark | Dogica Bold | nome PIX3LLAB e titoli grandi, brevi |
| UI, label, microtesti | Arial / Helvetica | navigazione, badge, pulsanti, dati brevi |
| Corpo | Arial / Helvetica | paragrafi e contenuti leggibili |

- Il wordmark e il descriptor nei master SVG sono convertiti in tracciati: non dipendono dal font per essere usati.
- Dogica Bold resta riservato a titoli grandi o brevi; non usarlo per UI dense o testo lungo.
- Titoli compatti: tracking negativo controllato.
- Label e azioni in maiuscolo, senza trasformare ogni paragrafo in un terminale del 1987.
- Nelle tagline, l’ultima unità semantica — punteggiatura inclusa — usa Signal orange. Nella firma ufficiale: **pixel by pixel.**

I font, le informazioni e le licenze SIL OFL 1.1 sono in `03-Source-Files/Font/Dogica/`.

---

## 5. UI, materia e movimento

### Costruzione

- `border-radius: 0` per gli elementi principali.
- Bordi netti: 4 px per strutture, 3 px per controlli.
- Ombre solide offset, mai sfumate.
- Griglia tecnica discreta da 24 px, solo come texture di supporto.
- Icone/illustrazioni in SVG dalla geometria netta; pixel art solo quando aggiunge significato.

### Movimento

- Micro-interazioni a scatti con `steps()`.
- Supportare sempre `prefers-reduced-motion`.
- Il movimento deve comunicare stato, progresso o interazione.
- Niente gradienti decorativi, ombre morbide o animazioni che fanno il giocoliere senza motivo.

---

## 6. Regole di esclusione

Non:

- usare pixel ovunque solo perché il brand li ama;
- applicare elementi giocosi a discapito della chiarezza;
- usare il lockup in spazi troppo piccoli;
- imitare automaticamente il design system di Pixel Print Lab in prodotti diversi;
- usare Green come superficie o accento decorativo;
- pubblicare asset da `03-Source-Files/` al posto dei master in `02-Final-Assets/`.

---

## 7. Contenuto del pacchetto

```text
PIX3LLAB-Brand-Pack-v1/
├── 00-START-HERE.md               # istruzioni rapide e inventario
├── 01-Brand-Guide/                # questo manuale e documenti di riferimento
├── 02-Final-Assets/               # asset approvati per la pubblicazione
│   ├── SVG/                        # master vettoriali
│   ├── PNG/                        # esportazioni raster
│   └── Guide/                      # griglia e specifica geometrica
├── 03-Source-Files/               # token CSS, font, licenze e copie sorgente
├── 04-Reference-Documents/         # brief e sistema visivo originari
└── MANIFEST-SHA256.txt             # integrità del pacchetto
```

### Uso rapido

1. Per sito, social, documentazione e pubblicazione: prelevare solo da `02-Final-Assets/`.
2. Per implementazione web: usare i token in `03-Source-Files/Token CSS/`.
3. Per installare/usare Dogica: leggere prima le licenze incluse.
4. Per modificare il lockup: rispettare la specifica JSON e rigenerare gli export PNG dagli SVG master.

---

## 8. Checklist prima della pubblicazione

- [ ] Ho scelto l’asset adatto alla dimensione e allo sfondo.
- [ ] Per il lockup scuro ho usato la variante dark, senza aggiungere contorni.
- [ ] Ho mantenuto colori e geometria approvati.
- [ ] Il verde è usato soltanto per un indicatore positivo piccolo.
- [ ] Se uso un font sorgente, ho incluso/rispettato la relativa licenza.
- [ ] Gli asset pubblici provengono da `02-Final-Assets/`.
