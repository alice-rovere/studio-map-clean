# Studio Map

**Studio Map è una mappa concettuale interattiva dell'ecosistema di sviluppo e,
allo stesso tempo, un sito per raccogliere appunti.** Serve a orientarsi tra
linguaggi, framework, database, strumenti e processi, e a trasformare ogni
tecnologia in una scheda di studio consultabile.

## Il concetto

- **Mappa**: un canvas a tutto schermo in cui ogni nodo rappresenta una
  tecnologia o uno strumento e ogni collegamento esprime una relazione
  (`richiede`, `usa`, `estende`, `alternativa`, `si_integra`, `strumento`,
  `ospita`).
- **Appunti**: selezionando un nodo si apre un pannello con descrizione, buone
  pratiche, convenzioni di naming, software associato e risorse; da lì si può
  entrare in una pagina di approfondimento con sezioni testuali, elenchi,
  tabelle, timeline ed esempi di codice.
- **Studio**: glossario, Linee guida, una sezione dedicata alla sicurezza
  informatica e una vista 3D dell'architettura completano la consultazione.

La lettura è pubblica. La creazione e la modifica di nodi, relazioni, glossario
e contenuti richiedono un account editor autenticato.

## Cosa puoi fare

- Esplorare la mappa con zoom, trascinamento e minimappa.
- Cercare un nodo e filtrare per categoria o sottocategoria.
- Selezionare un nodo per attenuare il resto della mappa e vedere le relazioni
  raggruppate in prerequisiti, abilitazioni, alternative e correlati.
- Aprire la scheda di un nodo e la relativa pagina di approfondimento.
- Consultare il glossario dei termini ricorrenti.
- Leggere le Linee guida su naming, organizzazione dei file, qualità,
  accessibilità e sicurezza.
- Aprire la sezione su sicurezza informatica e hacking etico.
- Passare alla vista **Architettura 3D** per una lettura per livelli
  (frontend, backend, database, DevOps, tools).
- Come editor: aggiungere nodi e termini, creare o correggere relazioni,
  spostare i nodi e salvare i contenuti estesi.

## Strumenti usati

| Ambito          | Strumento                                                   | Ruolo nel progetto                                   |
| --------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| UI              | **React 19**                                                | Componenti, stato e composizione dell'interfaccia    |
| Mappa           | **React Flow** (`@xyflow/react`)                            | Canvas dei nodi, collegamenti, minimappa e controlli |
| 3D              | **Three.js**, **@react-three/fiber**, **@react-three/drei** | Vista tridimensionale dell'architettura              |
| Build           | **Vite 8**                                                  | Server di sviluppo e build di produzione             |
| Stili           | **Tailwind CSS v4** + CSS custom                            | Utility di base e sistema visivo dell'app            |
| Dati e auth     | **Supabase** (PostgreSQL, Auth, RLS)                        | Persistenza, autenticazione e permessi               |
| Icone           | **lucide-react**                                            | Iconografia dell'interfaccia                         |
| Package manager | **pnpm**                                                    | Installazione e gestione delle dipendenze            |
| Qualità         | **ESLint**                                                  | Analisi statica del codice                           |
| Test            | **Vitest**, **Testing Library**                             | Test unitari, di componente e di integrazione        |
| Deploy          | **GitHub Actions**                                          | Build e pubblicazione su GitHub Pages                |

## Dati e permessi

| Tabella        | Contenuto                                                                 |
| -------------- | ------------------------------------------------------------------------- |
| `nodes`        | Nodi della mappa: etichetta, categoria, sottocategoria e posizione        |
| `edges`        | Collegamenti tra nodi e tipo di relazione                                 |
| `node_details` | Descrizione, buone pratiche, naming, software, risorse e contenuti estesi |
| `glossary`     | Termini e definizioni                                                     |

Il progetto Supabase è già configurato. L'app richiede solo `VITE_SUPABASE_URL`
e `VITE_SUPABASE_ANON_KEY`; le policy RLS consentono la lettura pubblica e
limitano le scritture agli utenti autenticati.

Non inserire mai una chiave `service_role` nel frontend o nel repository.

## Avvio in locale

Requisiti: Node.js 22 o superiore e pnpm.

```powershell
pnpm install
```

Crea `.env.local` nella radice del progetto con i valori presi da **Supabase →
Project Settings → API**:

```dotenv
VITE_SUPABASE_URL=https://<progetto>.supabase.co
VITE_SUPABASE_ANON_KEY=<chiave-anon-o-publishable>
```

Avvia l'app:

```powershell
pnpm dev
```

Altri comandi:

| Comando             | Effetto                                      |
| ------------------- | -------------------------------------------- |
| `pnpm build`        | Crea la build di produzione in `dist/`       |
| `pnpm preview`      | Anteprima locale della build                 |
| `pnpm lint`         | Esegue ESLint                                |
| `pnpm test`         | Esegue i test automatici                     |
| `pnpm test:watch`   | Riesegue i test al salvataggio               |
| `pnpm test:coverage`| Esegue i test e genera il report di copertura |

Se le variabili Supabase mancano, l'app mostra un messaggio di configurazione
invece della mappa.

I test usano **Vitest** e **Testing Library** con Supabase e React Flow
simulati. Coprono caricamento ed errori, accesso, creazione di nodi e termini,
salvataggio dei contenuti e gestione delle relazioni. La procedura manuale per
verificare i flussi reali è descritta in
[`VERIFICA-RILASCIO.md`](./VERIFICA-RILASCIO.md).

## Uso dell'app

I visitatori non autenticati possono esplorare mappa, contenuti e glossario. Le
azioni di modifica sono nascoste finché non si accede con un account editor.

Con una sessione attiva è possibile:

1. Aggiungere un nodo scegliendo etichetta, categoria e sottocategoria.
2. Trascinare un nodo per riposizionarlo; la posizione viene salvata.
3. Creare un collegamento trascinando da un nodo all'altro e scegliendo il tipo
   di relazione nella modale.
4. Cliccare su un collegamento per correggerne tipo e direzione.
5. Aggiungere termini al glossario.
6. Modificare i contenuti estesi di un nodo dalla relativa pagina di
   approfondimento.

La grammatica completa delle relazioni è descritta in
[`RELAZIONI-MAPPA.md`](./RELAZIONI-MAPPA.md).

## Pubblicazione su GitHub Pages

Il workflow [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)
compila e pubblica l'app quando arriva un push sul branch `main`; può essere
avviato anche manualmente dalla scheda **Actions**.

Per lavorare senza pubblicare subito, segui il
[flusso di lavoro Git](./FLUSSO-LAVORO-GIT.md).

## Struttura del progetto

```text
src/
  components/   Componenti della mappa, dei pannelli e delle pagine
  lib/          Client Supabase, relazioni, sottocategorie e livelli 3D
  App.jsx       Stato principale e orchestratore dell'interfaccia
  index.css     Tema e stili dell'app
public/         Asset statici
.github/        Workflow di deploy
```

## Documentazione

- [`AGENTS.md`](./AGENTS.md) — specifica del progetto e integrazioni future.
- [`PROMPT-SQL-DETTAGLI-NODO.md`](./PROMPT-SQL-DETTAGLI-NODO.md) — prompt per
  generare SQL dei dettagli di un nodo.
- [`PIANO-TUTOR-AI.md`](./PIANO-TUTOR-AI.md) — tutor AI ed esercizi di codice.
- [`NEXT-STEPS.md`](./NEXT-STEPS.md) — attività di consolidamento.
- [`VERIFICA-RILASCIO.md`](./VERIFICA-RILASCIO.md) — controlli automatici e
  manuali prima della pubblicazione.
- [`SPUNTI-MAPPA.md`](./SPUNTI-MAPPA.md) — possibili nuovi nodi e percorsi.
- [`RELAZIONI-MAPPA.md`](./RELAZIONI-MAPPA.md) — grammatica delle relazioni.
- [`FLUSSO-LAVORO-GIT.md`](./FLUSSO-LAVORO-GIT.md) — branch, commit e merge.
