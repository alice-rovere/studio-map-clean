# Studio Map - Specifica Semplice

## TODO: Autenticazione disattivata (sviluppo)

In `src/App.jsx` la costante `AUTH_DISABLED_FOR_DEV` è attualmente `true`:
il login è disattivato, la UI di accesso è nascosta e le modifiche restano solo
in memoria (nessuna scrittura su Supabase). Il caricamento dei dati resta
pubblico.

**Da fare prima della pubblicazione:** impostare `AUTH_DISABLED_FOR_DEV = false`,
verificare le policy RLS e testare il magic link. Non abilitare scritture anonime
nel database.

## Obiettivo

Un'app React (Vite + Tailwind v4) con un canvas di React Flow a tutto schermo come sfondo navigabile. I nodi e i collegamenti rappresentano l'ecosistema dello studio e sono caricati dinamicamente da Supabase.

## Database (3 Tabelle)

1. `nodes` (id [TEXT, PK], label [TEXT], category [TEXT], subcategory [TEXT], position_x [FLOAT], position_y [FLOAT])
2. `edges` (id [TEXT, PK], source [TEXT], target [TEXT], type [TEXT], kind [TEXT: richiede, usa, estende, alternativa, si_integra, strumento, ospita])
3. `node_details` (id [UUID, PK], node_id [TEXT], best_practices [TEXT], associated_software [TEXT[]], study_urls [JSONB], extended_content [JSONB])

## Categorie ammesse

frontend, backend, database, devops, tools

## Sottocategorie ammesse

linguaggio-markup, linguaggio-di-stile, linguaggio-programmazione, framework, libreria, runtime, orm, database-relazionale, database-documentale, database-chiave-valore, database-vettoriale, baas, sistema-controllo-versione, piattaforma, container, package-manager, ci-cd, editor, software, build-tool
