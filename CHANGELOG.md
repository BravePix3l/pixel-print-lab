# Changelog

Le modifiche rilevanti del progetto sono raccolte in questo file.

## [0.6.1] - 2026-07-24

### Aggiunto

- Cache-busting per gli asset pubblici (`styles.css`, `admin.css`, `app.js`, `admin.js`) tramite query string con la versione.
- Effetto stripe animato sulla barra di completamento della stampante nella home.

### Modificato

- Testo della barra di progresso nella home: ora mostra `Livello <completati> / <totale>` invece di `<completati> / <pendenti>`.

## [0.6.0] - 2026-07-24

### Aggiunto

- Rate limit per upload file e invio ordini (5 richieste ogni 5 minuti).
- Stato `consegnato` per gli ordini e sezione **Archivio** nella Control Room.
- Limite di 15 ordini aperti (`in attesa`, `in lavorazione`, `completato`) con avviso pubblico.
- Pulsante **Elimina tutti** nella Control Room per rimuovere tutti gli ordini e i relativi file.
- Pulsante **Elimina** nello storico utente per eliminare un ordine proprio.
- File `AGENTS.md` con le convenzioni del progetto (solo locale).

### Corretto

- Variabile `orderSidebar` non definita in `public/admin.js` che bloccava i tasti di navigazione dopo aver archiviato un ordine.

## [0.5.1] - 2026-07-18

### Corretto

- Stesso problema di Bitwarden anche nel dialog checkout (campi nome/cognome): reso non modale con backdrop e chiusura con Esc o click fuori.
- Scrollabilità dei dialog account e checkout su mobile (`overflow: auto`) per evitare che il form venga tagliato o non si possa inviare.

## [0.5.0] - 2026-07-18

### Corretto

- Conflitto tra il menu inline di Bitwarden e i dialog modali nativi: i popup account e impostazioni admin si aprono ora come dialog non modali, così il menu di Bitwarden può sovrapporsi ai campi di login e password.

## [0.4.1] - 2026-07-18

### Aggiunto

- Cambio password dell'utente autenticato dal popup profilo, con API `PUT /api/account/password`.
- Animazione della stampante 3D nella hero: estrusore e filamento si muovono strato dopo strato mentre l'oggetto cresce dal basso verso l'alto.
- Barra "Livello X / Y" e screen con il codice dell'ordine in lavorazione collegati agli ordini reali.

## [0.4.0] - 2026-07-18

### Aggiunto

- Cambio del nome utente e della password amministrativi dal popup impostazioni della Control Room, con verifica della password attuale.
- Comando `admin:reset` per ripristinare le credenziali definite dalle variabili d'ambiente.

### Modificato

- Le credenziali personalizzate salvate nel database hanno la precedenza su quelle d'ambiente; ogni cambio invalida le sessioni amministrative attive.

## [0.3.0] - 2026-07-17

### Aggiunto

- Account opzionali con registrazione, login e storico personale degli ordini.
- Accesso unificato per l'amministratore e collegamento diretto alla Control Room.

### Modificato

- Sostituiti i bind mount Docker con named volumes per evitare configurazioni manuali dei permessi.
- Persistite in SQLite le sessioni cliente e l'associazione facoltativa tra account e ordini.

## [0.2.0] - 2026-07-17

### Aggiunto

- Invio SMTP opzionale per i nuovi ordini.
- Popup impostazioni amministrative richiamato dalla rotella.

### Modificato

- Rimossi outbox email simulato ed esercizi didattici.
- Semplificato Docker Compose usando bind mount per `data` e `storage`.

## [0.1.0] - 2026-07-17

### Aggiunto

- Catalogo persistente con prodotti, colori e viewer STL/3MF.
- Carrello e invio di richieste con file o link personali.
- Tracking pubblico limitato a codice e stato.
- Pannello amministrativo protetto per ordini, catalogo e colori.
- Ispezione sicura di STL, 3MF generici e progetti Bambu Studio.
- Distribuzione self-hosted con Docker Compose e volumi persistenti.
- Test automatici e build Docker tramite GitHub Actions.

[0.6.1]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.4.1...v0.5.0
[0.4.0]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.3.0...v0.4.0
[0.4.1]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.4.0...v0.4.1
[0.3.0]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Moffoletta/pixel-print-lab/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Moffoletta/pixel-print-lab/releases/tag/v0.1.0
