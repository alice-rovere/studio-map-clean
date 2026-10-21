# Studio Map

Mappa React Flow con dati persistenti su Supabase: nodi, collegamenti, dettagli
tecnici e glossario.

## Configurazione

1. Crea un progetto Supabase.
2. In **SQL Editor**, esegui il file
   [`supabase/migrations/20261021000000_initial_schema.sql`](./supabase/migrations/20261021000000_initial_schema.sql).
   Crea le tabelle e inserisce i dati iniziali attualmente presenti nella mappa.
3. Esegui anche
   [`supabase/migrations/20261021010000_allow_node_creation.sql`](./supabase/migrations/20261021010000_allow_node_creation.sql)
   per consentire la creazione dei nodi dall'app.
4. Copia `.env.example` in `.env.local` e inserisci l'URL del progetto e la
   chiave `anon`/publishable trovati in **Project Settings → API**.
5. Installa le dipendenze con `pnpm install` e avvia con `pnpm dev`.

Non inserire mai una `service_role` key nel frontend. Gli script abilitano la
lettura pubblica e consentono agli utenti anonimi di creare e modificare nodi,
gestire collegamenti e aggiungere termini al glossario, in linea con l'app senza
login. Se la mappa non deve essere modificabile pubblicamente, configura
autenticazione e restringi le policy RLS prima della pubblicazione.

I nuovi nodi, le posizioni spostate, i collegamenti creati/eliminati e i nuovi
termini del glossario sono salvati immediatamente su Supabase. I contenuti dei
nodi e i relativi dettagli vengono letti dalle rispettive tabelle.
