# Prossimi passi

Questo documento raccoglie le attività per portare Studio Map da prototipo
funzionante a strumento affidabile e curato. Le prime sezioni riguardano il
consolidamento dell'app esistente; la seconda parte raccoglie le integrazioni
future: tutor AI, zona AI nella programmazione, zona Testing, immagini nei
contenuti e post-it nel dettaglio nodo.

## 1. Rendere verificabili i flussi principali

Stato: test automatici e procedura di verifica pronti. Resta da eseguire la
checklist manuale con il progetto Supabase reale e un account editor di prova.

- [x] Aggiungere test automatici per caricamento dei dati, accesso, creazione di
      nodi e termini, salvataggio dei contenuti e gestione degli errori.
- [ ] Verificare manualmente il comportamento con Supabase configurato e senza
      configurazione, sia come visitatore sia come utente autenticato.
- [x] Controllare che errori di rete o di autorizzazione siano visibili e che
      l'interfaccia permetta di riprovare senza perdere il contesto.
- [x] Documentare una breve procedura di verifica prima di ogni rilascio.

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

## 3. Spiegare i tipi di file

- [ ] Aggiungere alle Linee guida una breve sezione sui tipi di file, vicino a
      **Naming convention** o **File e cartelle**.
- [ ] Fare l'inventario delle estensioni effettivamente presenti nel progetto e
      spiegare a cosa servono, con esempi: `.js` e `.jsx`, `.md` e `.yaml`.
- [ ] Distinguere i formati di codice, documentazione e configurazione;
      includere altri formati solo se presenti e utili da conoscere.

**Completato quando:** chi legge sa riconoscere i principali file del progetto
e dove aspettarsi di trovare codice, documentazione e configurazione.

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
- [ ] Documentare la configurazione del progetto Supabase: tabelle, policy RLS
      e permessi necessari.
- [ ] Configurare build e lint automatici prima della pubblicazione.
- [ ] Definire una procedura per backup e ripristino dei dati.

**Completato quando:** una nuova installazione può essere configurata seguendo
la documentazione e una versione aggiornata può essere pubblicata e ripristinata
in modo ripetibile.

## Integrazioni future

Le sezioni seguenti descrivono funzionalità proposte e non ancora disponibili.
Il dettaglio tecnico del tutor è in [`PIANO-TUTOR-AI.md`](./PIANO-TUTOR-AI.md);
i possibili nuovi nodi della mappa sono in
[`SPUNTI-MAPPA.md`](./SPUNTI-MAPPA.md).

### 7. Tutor AI ed esercizi di codice

- [ ] Realizzare un tutor testuale a domande e risposte su un singolo nodo.
- [ ] Usare i contenuti del nodo in Supabase come contesto delle risposte.
- [ ] Inviare le richieste al provider AI tramite una Supabase Edge Function,
      senza esporre le chiavi nel frontend.
- [ ] Mostrare domanda, risposta e feedback nell'interfaccia.
- [ ] Valutare la persistenza di sessioni e progressi, se necessaria.
- [ ] Aggiungere esercizi brevi in JavaScript con test automatici.
- [ ] Eseguire il codice in un runner sandbox isolato, mai direttamente nel
      server dell'app.
- [ ] Definire limiti di tempo, memoria e dimensione del codice.

**Completato quando:** un utente può completare una sessione di studio con
riscontro del tutor e gli esercizi sono verificati dai test in un ambiente
isolato.

### 8. Zona AI nella programmazione

- [ ] Aggiungere una pagina statica accanto a **Linee guida** e **Sicurezza
      informatica**.
- [ ] Coprire prompt efficaci, revisione del codice generato, limiti e verifica
      delle risposte.
- [ ] Inserire indicazioni sull'uso responsabile e sui dati da non condividere.
- [ ] Collegare i contenuti ai nodi pertinenti della mappa.
- [ ] Definire criteri editoriali e fonti aggiornate.

**Completato quando:** la pagina offre un percorso chiaro sull'uso consapevole
dell'AI nello sviluppo ed è raggiungibile dalla testata dell'app.

### 9. Zona Testing

- [ ] Creare una sezione dedicata a test unitari, di integrazione ed
      end-to-end.
- [ ] Spiegare il ruolo dei test nelle pipeline CI/CD e in GitHub Actions.
- [ ] Aggiungere alla mappa i nodi **Testing**, **Vitest** e **Playwright** con
      descrizioni e collegamenti.
- [ ] Inserire esempi pratici, buone pratiche e criteri per scegliere il tipo
      di test.
- [ ] Allineare i contenuti con gli spunti già raccolti in
      [`SPUNTI-MAPPA.md`](./SPUNTI-MAPPA.md).

**Completato quando:** esiste una sezione consultabile sul testing e la mappa
collega gli strumenti principali ai nodi già presenti.

### 10. Immagini nei contenuti

- [ ] Aggiungere un blocco `image` a `node_details.extended_content` con URL,
      didascalia e testo alternativo obbligatorio.
- [ ] Aggiornare il renderer e la validazione dei contenuti estesi.
- [ ] Configurare un bucket Supabase Storage con lettura pubblica e scrittura
      autenticata.
- [ ] Definire formati, dimensioni massime e gestione degli errori di
      caricamento.
- [ ] Documentare il formato del blocco e le regole di accessibilità.

**Completato quando:** un editor può inserire un'immagine in una pagina di
approfondimento e il contenuto resta accessibile e verificabile.

### 11. Post-it nel dettaglio nodo

- [ ] Creare la tabella `node_notes` (`id`, `node_id`, `content`,
      `created_at`) con RLS: lettura pubblica e scrittura autenticata.
- [ ] Aggiungere un pannello laterale nella pagina di dettaglio del nodo,
      distinto dai contenuti estesi.
- [ ] Permettere di creare, modificare ed eliminare le note senza uscire dalla
      pagina.
- [ ] Gestire stati vuoti, errori, conferme e ordinamento cronologico.
- [ ] Verificare l'accessibilità del pannello e il comportamento su schermi
      piccoli.

**Completato quando:** un editor può annotare rapidamente un nodo e ritrovare
le note associate senza modificare i contenuti ufficiali.

## Ordine consigliato

1. Verificare i flussi e introdurre i test di base.
2. Completare e uniformare i contenuti esistenti.
3. Documentare le estensioni dei file direttamente nelle Linee guida.
4. Decidere quali operazioni di modifica servono agli amministratori.
5. Rifinire accessibilità e comportamento mobile.
6. Configurare rilascio, controlli automatici e backup.
7. Aggiungere la zona Testing e i relativi nodi, utile anche ai test futuri.
8. Introdurre immagini nei contenuti e post-it nel dettaglio nodo.
9. Pubblicare la zona AI nella programmazione.
10. Realizzare il tutor AI, partendo dall'MVP testuale e rimandando gli
    esercizi eseguibili alla fase successiva.
