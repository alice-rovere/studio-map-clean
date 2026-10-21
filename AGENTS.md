# Studio Map - Specifica Semplice

## Obiettivo

Un'app React (Vite + Tailwind v4) con un canvas di React Flow a tutto schermo come sfondo navigabile. I nodi e i collegamenti rappresentano l'ecosistema dello studio e sono caricati dinamicamente da Supabase.

## Database (3 Tabelle)

1. `nodes` (id [TEXT, PK], label [TEXT], category [TEXT], position_x [FLOAT], position_y [FLOAT])
2. `edges` (id [TEXT, PK], source [TEXT], target [TEXT], type [TEXT])
3. `node_details` (id [UUID, PK], node_id [TEXT], best_practices [TEXT], associated_software [TEXT[]], study_urls [JSONB], extended_content [JSONB])

## Categorie ammesse

frontend, backend, database, devops, tools
