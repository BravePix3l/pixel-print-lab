# PIX3LLAB — Brand Pack v1

Questo pacchetto è pensato per essere copiato su un altro computer, affidato a un collaboratore o conservato come handoff completo del brand.

## Da dove iniziare

1. Leggi `01-Brand-Guide/PIX3LLAB-Brand-Guidelines.md`.
2. Per usare il logo in pubblico, scegli un file in `02-Final-Assets/`.
3. Per sviluppo web, consulta `03-Source-Files/Token CSS/pix3llab-tokens.css`.
4. Per la geometria del lockup, usa `02-Final-Assets/Guide/PIX3LLAB-lockup-spec.json` e la griglia di costruzione.
5. Per i font, conserva sempre le licenze in `03-Source-Files/Font/Dogica/`.

## Autorità dei file

- **Asset pubblici autorevoli:** `02-Final-Assets/SVG/`.
- **PNG:** esportazioni raster derivate dagli SVG master.
- **Sorgenti:** `03-Source-Files/`; sono disponibili per modifica/implementazione, non sono la cartella da cui pubblicare.
- **Documenti di riferimento:** `04-Reference-Documents/`.

## Integrità

`MANIFEST-SHA256.txt` contiene gli hash SHA-256 dei file inclusi, generati al momento della creazione dell’archivio. Per verificare l’integrità su macOS/Linux:

```bash
shasum -a 256 -c MANIFEST-SHA256.txt
```

Su Windows PowerShell puoi confrontare gli hash con `Get-FileHash`.

## Licenze

Dogica è distribuito con la relativa documentazione e licenza SIL OFL 1.1 in `03-Source-Files/Font/Dogica/`. Leggi e conserva tali file con ogni ridistribuzione del font.
