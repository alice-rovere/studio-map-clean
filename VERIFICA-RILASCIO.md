# Verifica prima del rilascio

Questa procedura raccoglie i controlli minimi da eseguire prima di pubblicare
una nuova versione di Studio Map. I test automatici coprono i flussi principali
con Supabase simulato; la checklist manuale verifica l'integrazione reale.

## Controlli automatici

Eseguire dalla radice del progetto:

```powershell
pnpm lint
pnpm test
pnpm build
```

Esito atteso:

- `pnpm lint` termina senza errori.
- `pnpm test` esegue tutti i test con esito positivo.
- `pnpm build` crea la build in `dist/`.

Per il report di copertura:

```powershell
pnpm test:coverage
```

## Configurazione di prova

Preparare due configurazioni:

1. **Senza Supabase**: rinominare temporaneamente `.env.local` (ad esempio in
   `.env.local.bak`) e riavviare `pnpm dev`.
2. **Con Supabase**: ripristinare `.env.local` con `VITE_SUPABASE_URL` e
   `VITE_SUPABASE_ANON_KEY` e riavviare `pnpm dev`.

Usare un account editor di prova per i controlli di scrittura. Non usare dati
reali e non inserire chiavi `service_role` nel repository o nel frontend.

## Checklist senza Supabase

- [ ] La pagina mostra il messaggio di configurazione mancante.
- [ ] Non viene mostrato il pulsante `Riprova`.
- [ ] La console non espone chiavi o segreti.

## Checklist visitatore

Con Supabase configurato, senza effettuare l'accesso:

- [ ] La mappa si carica senza errori.
- [ ] Ricerca, filtri per categoria e sottocategoria funzionano.
- [ ] Selezionando un nodo si aprono i dettagli e il focus sulle relazioni.
- [ ] Il pulsante `Apri approfondimento` mostra i contenuti estesi.
- [ ] Glossario, Linee guida, Sicurezza informatica e Architettura 3D si aprono.
- [ ] I pulsanti `Aggiungi nodo`, `Aggiungi termine` ed `Esci` non sono visibili.
- [ ] I nodi non sono trascinabili e non è possibile creare collegamenti.

## Checklist editor

Effettuare l'accesso con l'account di prova:

- [ ] Il login mostra gli errori in caso di credenziali errate.
- [ ] Dopo il login compaiono `Aggiungi nodo`, `Aggiungi termine` ed `Esci`.
- [ ] Creando un nodo, etichetta, categoria e sottocategoria vengono salvate.
- [ ] Creando un termine, il glossario si aggiorna subito.
- [ ] Un termine duplicato viene rifiutato con un messaggio chiaro.
- [ ] Trascinando un nodo, la posizione viene salvata e resta dopo il refresh.
- [ ] Creando una relazione, il tipo scelto viene salvato.
- [ ] Modificando una relazione, tipo e direzione vengono aggiornati.
- [ ] Salvando i contenuti estesi, il JSON valido viene accettato.
- [ ] Un JSON non valido viene rifiutato senza perdere il contenuto digitato.
- [ ] Eliminando un nodo, i collegamenti associati non restano visibili.
- [ ] Dopo il logout le azioni di modifica scompaiono.

## Errori, retry e stato dell'interfaccia

- [ ] Con rete assente o database non raggiungibile, il caricamento mostra un
      errore leggibile e il pulsante `Riprova`.
- [ ] Dopo `Riprova`, con la rete ripristinata, la mappa si carica senza
      perdere filtri e ricerca.
- [ ] Un errore di scrittura resta visibile accanto al modulo interessato.
- [ ] Un errore di eliminazione ripristina nodo o collegamento nella mappa.
- [ ] Il banner degli errori può essere chiuso senza bloccare l'interfaccia.
- [ ] Un errore di sessione non impedisce di riprovare l'accesso.

## Controlli finali

- [ ] Nessuna chiave o credenziale è presente nel repository.
- [ ] Il workflow GitHub Actions usa solo variabili del repository.
- [ ] La build pubblicata apre la mappa e i contenuti senza errori in console.
- [ ] Le modifiche sono state provate su una finestra desktop e una mobile.

## Esito

Annotare data, versione o commit verificato e l'esito dei controlli. Se un punto
fallisce, correggere il problema e ripetere almeno la sezione interessata.
