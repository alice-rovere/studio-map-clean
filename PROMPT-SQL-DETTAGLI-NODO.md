# Prompt per generare SQL dei dettagli di un nodo

Usa il prompt qui sotto per chiedere a un assistente AI di preparare una query
per i dettagli di un nodo. Compila prima tutti i dati tra parentesi quadre,
soprattutto l'ID esatto già presente in `nodes.id`.

La query aggiorna esclusivamente `node_details`: non crea il nodo e non
modifica relazioni, glossario, schema o policy. In caso di conflitto su
`node_id`, sostituisce tutti i campi di contenuto specificati: controlla prima
se esiste già una scheda e conserva i contenuti correnti se devono essere
mantenuti.

## Prompt da copiare

```text
Agisci come un assistente esperto di PostgreSQL, Supabase e documentazione
tecnica. Devi generare una singola query SQL completa, eseguibile nel SQL
Editor di Supabase, per inserire o aggiornare i dettagli di un nodo già
esistente nell'app Studio Map.

DATI DEL NODO
- ID esatto (`nodes.id`, non inventarlo): [NODE_ID]
- Nome (`nodes.label`): [NOME]
- Categoria: [frontend | backend | database | devops | tools]
- Sottocategoria: [linguaggio-markup | linguaggio-di-stile | linguaggio-programmazione | framework | libreria | runtime | orm | database-relazionale | database-documentale | database-chiave-valore | database-vettoriale | baas | sistema-controllo-versione | piattaforma | container | package-manager | ci-cd | editor | software | build-tool]
- Versione o contesto da documentare, se rilevante: [VERSIONE/CONTESTO oppure "non specificato"]
- Esigenze o livello di approfondimento desiderato: [DETTAGLI oppure "panoramica pratica"]
- Scheda esistente e sovrascrittura: [nessuna scheda / ho verificato e confermo la sostituzione completa / non verificato]

SCHEMA ESISTENTE
La tabella è `public.node_details` e ha questi campi:
- `id UUID` (chiave primaria; omettila se il database ne assegna un valore
  predefinito)
- `node_id TEXT` (riferimento all'ID del nodo; è univoco)
- `description TEXT`
- `best_practices TEXT`
- `naming_conventions TEXT[]`
- `associated_software TEXT[]`
- `study_urls JSONB`
- `extended_content JSONB`

Non creare o modificare tabelle, colonne, indici, trigger, funzioni o policy.
Non inserire o aggiornare righe in `nodes`, `edges` o `glossary`.
Non richiedere né inserire chiavi o credenziali.

CONTENUTI DA PREPARARE
1. Scrivi una descrizione breve, precisa e in italiano che spieghi cos'è il
   nodo e quale ruolo ha nello sviluppo software.
2. Inserisci in `best_practices` una stringa TEXT con pratiche concrete
   separate da newline, senza numerazione obbligatoria. Non usare un array
   JSON per questo campo.
3. Inserisci `naming_conventions` come array PostgreSQL `TEXT[]` di stringhe.
   Includi solo convenzioni pertinenti al nodo; se non esistono o non sono
   applicabili usa `ARRAY[]::text[]`.
4. Inserisci `associated_software` come array PostgreSQL `TEXT[]` di nomi di
   strumenti effettivamente collegati al nodo. Non confonderli con alternative
   o tecnologie non direttamente associate; se non ce ne sono usa
   `ARRAY[]::text[]`.
5. Inserisci `study_urls` come array JSONB di oggetti con esattamente queste
   chiavi:
   [{"label":"Documentazione ufficiale","url":"https://..."}]
   Preferisci documentazione ufficiale e risorse autorevoli, con URL
   canonici, pubblici e pertinenti. Se non puoi verificare l'URL non
   inventarlo; usa `[]` se non hai link affidabili.
6. Inserisci `extended_content` come array JSONB di sezioni di
   approfondimento. Ogni sezione deve avere un `title` non vuoto e usare
   esclusivamente uno dei formati supportati:
   - Testo: `{"title":"...","type":"text","text":"..."}`
   - Elenco: `{"title":"...","type":"list","items":["...","..."]}`
   - Tabella: `{"title":"...","type":"table","columns":["...","..."],"rows":[["...","..."]]}`
     Ogni riga deve avere lo stesso numero di celle delle colonne.
   - Timeline: `{"title":"...","type":"timeline","entries":[{"date":"...","title":"...","description":"..."}]}`
   - Codice: `{"title":"...","type":"code","code":"..."}`
   Tutti i valori devono rispettare i tipi indicati: testo come stringhe,
   elenchi come array di stringhe, righe di tabella come array di stringhe e
   campi `date`, `title`, `description` della timeline come stringhe. Non
   usare altri tipi (per esempio `image`), campi obbligatori mancanti o forme
   JSON diverse. Se non c'è un approfondimento attendibile, usa `[]`.

CORRETTEZZA E FONTI
- Non inventare caratteristiche, versioni, comandi, compatibilità, convenzioni
  o date. Se un dato essenziale non è disponibile, chiedimi prima di generare
  SQL invece di indovinare.
- Basa le informazioni tecniche su fonti affidabili e aggiornate, dando
  priorità alla documentazione ufficiale. Non dichiarare di aver verificato
  una fonte se non l'hai consultata; dopo la query, elenca brevemente le fonti
  effettivamente consultate. Le fonti non vanno inserite in colonne diverse da
  `study_urls`.
- Mantieni i contenuti pratici, specifici del nodo e non ridondanti tra i
  campi. Non aggiungere dati segnaposto.

REQUISITI SQL
- Prima di generare la query, verifica che `node_id` sia valorizzato e
  corrisponda esattamente all'ID fornito; non dedurlo dal nome e non dichiarare
  di averne verificato l'esistenza nel database se non vi hai accesso. Se manca,
  fermati e chiedimelo.
- Se lo stato della scheda esistente è `non verificato`, non generare subito
  l'upsert: chiedimi prima di controllare la riga esistente e confermare
  l'eventuale sostituzione. `ON CONFLICT ... DO UPDATE` sovrascrive i valori
  correnti dei campi di contenuto.
- Genera un `INSERT INTO public.node_details (...) VALUES (...)` che nomini
  esplicitamente soltanto `node_id`, `description`, `best_practices`,
  `naming_conventions`, `associated_software`, `study_urls` ed
  `extended_content`. Ometti `id`.
- Rendi la scrittura ripetibile con
  `ON CONFLICT (node_id) DO UPDATE SET ...`, aggiornando i campi di contenuto
  ma non `id` né `node_id`. Non usare `REPLACE`, `DELETE`, `TRUNCATE` o
  istruzioni che cancellano dati.
- Usa cast espliciti `::text[]` e `::jsonb` dove opportuno. La query deve
  essere SQL valido PostgreSQL: JSON valido, virgolette singole SQL raddoppiate
  nei literal testuali, newline rappresentati correttamente e valori stringa
  correttamente escapati.
- Ometti `id` come fa il flusso di salvataggio dell'app. Se non puoi assumere
  che il database assegni un valore predefinito a `id`, fermati e chiedi di
  verificare lo schema: non inventare una funzione per generare UUID.
- Non usare `NULL` per sostituire dati sconosciuti e non svuotare campi con
  informazioni inventate. Per campi legittimamente non applicabili usa le
  rappresentazioni vuote specificate sopra.
- Non affermare che la query è stata eseguita. Ricorda che il nodo deve già
  esistere e che l'esecuzione va fatta nel progetto e con un account
  autorizzato corretti.

FORMATO DELLA RISPOSTA
Se tutti i dati necessari sono disponibili, restituisci:
1. Un breve riepilogo del nodo e di eventuali assunzioni.
2. La singola query SQL in un blocco ```sql```, pronta da copiare.
3. Le fonti effettivamente consultate, con URL.
4. Una breve nota che ricordi di controllare l'ID e il progetto Supabase prima
   di eseguirla.

Se manca l'ID o un'altra informazione necessaria per non indovinare, non
generare una query parziale: chiedi soltanto i chiarimenti indispensabili.
```

## Controlli prima dell'esecuzione

- Verifica in Supabase che `nodes.id` corrisponda al nodo voluto.
- Controlla se esiste già una riga in `node_details` per `node_id`: l'upsert
  aggiorna tutti i campi di contenuto indicati.
- Controlla che la query tocchi solo `public.node_details` e che gli array
  JSON rispettino i formati sopra.
- Esegui la query nel progetto corretto con un account autorizzato alla
  scrittura. Non abilitare scritture anonime e non usare una chiave
  `service_role` nell'app o nel repository.
