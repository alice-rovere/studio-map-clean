# Studio Map - Specifica Semplice

## Autenticazione

L'autenticazione email + password è attiva in `src/App.jsx`. La lettura dei dati
resta pubblica; le modifiche richiedono una sessione autenticata.

In sviluppo, **Confirm email** del provider Email in Supabase può restare
disattivato; riattivarlo in produzione. Verificare che le migrazioni RLS siano
applicate e testare login e modifiche. Non abilitare scritture anonime nel
database.

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
