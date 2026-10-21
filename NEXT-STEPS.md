# Prossimi passi

Questo documento raccoglie le attività per portare Studio Map da prototipo
funzionante a strumento affidabile e curato. Non include il tutor AI, descritto
in [`PIANO-TUTOR-AI.md`](./PIANO-TUTOR-AI.md), né l'aggiunta di argomenti alla
mappa, raccolta in [`SPUNTI-MAPPA.md`](./SPUNTI-MAPPA.md).

## 1. Rendere verificabili i flussi principali

- [ ] Aggiungere test automatici per caricamento dei dati, accesso, creazione di
  nodi e termini, salvataggio dei contenuti e gestione degli errori.
- [ ] Verificare manualmente il comportamento con Supabase configurato e senza
  configurazione, sia come visitatore sia come utente autenticato.
- [ ] Controllare che errori di rete o di autorizzazione siano visibili e che
  l'interfaccia permetta di riprovare senza perdere il contesto.
- [ ] Documentare una breve procedura di verifica prima di ogni rilascio.

**Completato quando:** i flussi essenziali sono coperti da test o da una
procedura ripetibile e gli errori non lasciano l'interfaccia in uno stato
ambiguo.

## 2. Completare i contenuti dei nodi esistenti

- [ ] Definire un formato editoriale comune: descrizione, buone pratiche,
  convenzioni, software associato, risorse e approfondimento.
- [ ] Completare i dettagli mancanti per i nodi già presenti, senza introdurre
  nuovi nodi.
- [ ] Controllare accuratezza e aggiornamento delle risorse esterne.
- [ ] Aggiungere un esempio di contenuto valido e indicazioni di compilazione
  per chi amministra la mappa.

**Completato quando:** ogni nodo ha almeno una descrizione utile e le sezioni
non compilate sono intenzionali e riconoscibili.

## 3. Spiegare i tipi di file del progetto

- [ ] Aggiungere alle Linee guida una breve sezione sui tipi di file, vicino a
  **Naming convention** o **File e cartelle**.
- [ ] Fare l'inventario delle estensioni effettivamente presenti nel progetto e
  spiegare a cosa servono, con esempi: `.js` e `.jsx`, `.md`, `.yaml` e `.sql`.
- [ ] Distinguere i formati di codice, documentazione, configurazione e database;
  includere altri formati solo se presenti e utili da conoscere.

**Completato quando:** chi legge sa riconoscere i principali file del progetto
e dove aspettarsi di trovare codice, documentazione, configurazione e migrazioni.

## 4. Completare la gestione dei dati

- [ ] Valutare e implementare la modifica dei dati di nodi e termini già
  inseriti.
- [ ] Aggiungere conferme per le eliminazioni e messaggi chiari in caso di
  operazioni non riuscite.
- [ ] Verificare che eliminare un nodo gestisca correttamente collegamenti e
  dettagli associati.
- [ ] Controllare che le operazioni disponibili nell'interfaccia corrispondano
  ai permessi definiti nelle policy Supabase.

**Completato quando:** chi è autorizzato può correggere i dati senza
intervenire direttamente sul database e le eliminazioni non lasciano dati
orfani.

## 5. Rifinire usabilità e accessibilità

- [ ] Verificare l'uso da tastiera di menu, modali, pagine di approfondimento e
  controlli della mappa.
- [ ] Controllare focus visibile, etichette accessibili, contrasto e messaggi
  degli errori.
- [ ] Provare l'interfaccia su schermi piccoli e rendere utilizzabili
  navigazione, pannelli e moduli.
- [ ] Rendere coerenti gli stati di caricamento, salvataggio, successo e
  assenza di contenuti.

**Completato quando:** le funzioni essenziali sono utilizzabili senza mouse e
su viewport mobile, senza contenuti o azioni nascosti.

## 6. Preparare il rilascio e la manutenzione

- [ ] Scegliere l'ambiente di hosting e configurare le variabili Supabase senza
  includere segreti nel repository o nel bundle client.
- [ ] Verificare URL di redirect, inviti e accesso in produzione.
- [ ] Provare tutte le migrazioni su un progetto Supabase pulito e documentare
  la sequenza di aggiornamento.
- [ ] Configurare build e lint automatici prima della pubblicazione.
- [ ] Definire una procedura per backup e ripristino dei dati.

**Completato quando:** una nuova installazione può essere configurata seguendo
la documentazione e una versione aggiornata può essere pubblicata e ripristinata
in modo ripetibile.

## Ordine consigliato

1. Verificare i flussi e introdurre i test di base.
2. Completare e uniformare i contenuti esistenti.
3. Documentare le estensioni dei file direttamente nelle Linee guida.
4. Decidere quali operazioni di modifica servono agli amministratori.
5. Rifinire accessibilità e comportamento mobile.
6. Configurare rilascio, controlli automatici e backup.
