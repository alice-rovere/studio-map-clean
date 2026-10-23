# Studio Map - Specifica Semplice

## Obiettivo

Studio Map è una mappa concettuale navigabile dell'ecosistema di sviluppo e un
sito per raccogliere appunti. I nodi rappresentano tecnologie e strumenti, i
collegamenti descrivono le relazioni tra loro, le pagine di dettaglio
raccolgono descrizioni, buone pratiche e approfondimenti.

L'app è un frontend React a tutto schermo con un canvas React Flow come sfondo
navigabile, una vista 3D dell'architettura e pagine statiche di consultazione.

## Stack

- **React 19** + **Vite 8** per interfaccia e build.
- **React Flow** (`@xyflow/react`) per nodi, archi, minimappa e controlli.
- **Three.js**, **@react-three/fiber** e **@react-three/drei** per la vista
  Architettura 3D.
- **Tailwind CSS v4** con CSS custom per il tema.
- **Supabase** (PostgreSQL, Auth, RLS) per dati, sessioni e permessi.
- **lucide-react** per le icone, **pnpm** per le dipendenze, **ESLint** per la
  qualità del codice.
- **GitHub Actions** per pubblicare su GitHub Pages.

## Autenticazione

L'autenticazione email + password è attiva in `src/App.jsx`. La lettura dei dati
resta pubblica; le modifiche richiedono una sessione autenticata.

In sviluppo, **Confirm email** del provider Email in Supabase può restare
disattivato; riattivarlo in produzione. Lo schema del database e le policy RLS
sono già applicati al progetto Supabase e non vanno ricreati. Testare login,
logout e modifiche con un account editor.

Non abilitare scritture anonime nel database. Non inserire mai una chiave
`service_role` nel frontend o nel repository.

## Database (4 Tabelle)

1. `nodes` (id [TEXT, PK], label [TEXT], category [TEXT], subcategory [TEXT],
   position_x [FLOAT], position_y [FLOAT])
2. `edges` (id [TEXT, PK], source [TEXT], target [TEXT], type [TEXT], kind
   [TEXT: richiede, usa, estende, alternativa, si_integra, strumento, ospita])
3. `node_details` (id [UUID, PK], node_id [TEXT, unique], description [TEXT],
   best_practices [TEXT], naming_conventions [TEXT[]], associated_software
   [TEXT[]], study_urls [JSONB], extended_content [JSONB])
4. `glossary` (id [UUID, PK], term [TEXT], definition [TEXT])

`extended_content` è un array JSON di sezioni renderizzate come testo, elenco,
tabella, timeline o codice.

## Categorie ammesse

frontend, backend, database, devops, tools

## Sottocategorie ammesse

linguaggio-markup, linguaggio-di-stile, linguaggio-programmazione, framework,
libreria, runtime, orm, database-relazionale, database-documentale,
database-chiave-valore, database-vettoriale, baas, sistema-controllo-versione,
piattaforma, container, package-manager, ci-cd, editor, software, build-tool

## Struttura del progetto

- `src/App.jsx`: stato principale, caricamento dati, autenticazione e azioni.
- `src/components/`: mappa, pannelli, modali e pagine di consultazione.
- `src/lib/`: client Supabase, tipi di relazione, sottocategorie e livelli 3D.
- `src/index.css`: tema e stili.
- `public/`: asset statici.
- `.github/workflows/deploy.yml`: build e deploy su GitHub Pages.

## Integrazioni future

Le voci seguenti sono proposte, non funzionalità già disponibili.

### Tutor AI

Tutor a domande e risposte sui nodi della mappa, con esercizi di codice
verificati in un ambiente isolato. Il piano completo è in
[`PIANO-TUTOR-AI.md`](./PIANO-TUTOR-AI.md): provider AI chiamato tramite
Supabase Edge Function, chiavi solo lato server, test come riferimento per la
correttezza del codice.

### Zona AI nella programmazione

Una sezione dedicata all'uso consapevole dell'AI nello sviluppo: prompt,
revisione del codice generato, limiti, verifica delle risposte e uso
responsabile. Può vivere come pagina statica accanto a **Linee guida** e
**Sicurezza informatica**, con collegamenti ai nodi della mappa.

### Zona Testing

Una sezione dedicata al testing e nuovi nodi nella mappa (ad esempio Testing,
Vitest e Playwright, già proposti in [`SPUNTI-MAPPA.md`](./SPUNTI-MAPPA.md)).
Deve coprire test unitari, di integrazione ed end-to-end, oltre al ruolo dei
test nelle pipeline CI/CD.

### Immagini nei contenuti

Aggiungere un blocco `image` a `node_details.extended_content`, con URL,
didascalia e testo alternativo obbligatorio. Le immagini vanno archiviate in
Supabase Storage con policy di lettura pubblica e scrittura autenticata.

### Post-it nel dettaglio nodo

Note rapide aggiungibili lateralmente alla pagina di dettaglio di un nodo,
distinte dai contenuti estesi. Richiedono una nuova tabella `node_notes`
(id, node_id, content, created_at) con RLS: lettura pubblica e scrittura
autenticata. L'interfaccia deve permettere di creare, modificare ed eliminare
le note senza uscire dalla pagina del nodo.
