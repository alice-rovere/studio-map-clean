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
4. Esegui
   [`supabase/migrations/20261021020000_node_extended_content.sql`](./supabase/migrations/20261021020000_node_extended_content.sql)
   per aggiungere gli approfondimenti estesi di Git, HTML e CSS.
5. Esegui
   [`supabase/migrations/20261021030000_allow_node_extended_content_updates.sql`](./supabase/migrations/20261021030000_allow_node_extended_content_updates.sql)
   per consentire il salvataggio dei contenuti estesi.
6. Esegui
   [`supabase/migrations/20261021040000_add_vite.sql`](./supabase/migrations/20261021040000_add_vite.sql)
   per aggiungere Vite alla mappa e i relativi dettagli.
7. Esegui
   [`supabase/migrations/20261021050000_restrict_anonymous_writes.sql`](./supabase/migrations/20261021050000_restrict_anonymous_writes.sql)
   per mantenere la lettura pubblica e richiedere un utente autenticato per ogni
   modifica.
8. In **Authentication → Sign In / Providers**, abilita Email; nelle
   impostazioni Auth disattiva le registrazioni pubbliche. In
   **Authentication → Users**, invita o crea gli account autorizzati.
9. In **Authentication → URL Configuration**, aggiungi l'URL dell'app locale e
   quello di produzione tra i redirect consentiti per i magic link.
10. Crea `.env.local` con l'URL del progetto (`VITE_SUPABASE_URL`) e la chiave
    `anon`/publishable (`VITE_SUPABASE_ANON_KEY`) da **Project Settings → API**.
11. Installa le dipendenze con `pnpm install` e avvia con `pnpm dev`.

Non inserire mai una `service_role` key nel frontend. Gli script abilitano la
lettura pubblica; solo gli utenti autenticati possono creare, modificare o
eliminare dati. L'accesso avviene tramite link inviato all'email di un account
invitato. L'interfaccia nasconde le azioni di modifica agli utenti anonimi, ma
sono le policy RLS e i privilegi SQL a proteggere effettivamente i dati.

I nuovi nodi, le posizioni spostate, i collegamenti creati/eliminati e i nuovi
termini del glossario sono salvati immediatamente su Supabase. I contenuti dei
nodi e i relativi dettagli vengono letti dalle rispettive tabelle. Dalla modale
di un nodo si può aprire una vista interna a schermo intero; i contenuti estesi
sono sezioni strutturate archiviate in `node_details.extended_content`. Al
momento sono inclusi approfondimenti per Git, HTML e CSS; gli altri nodi
mostrano un avviso finché non vengono aggiunti contenuti. Dalla vista di
approfondimento è possibile inserire o modificare le sezioni in formato JSON e
salvarle su Supabase.

La pagina **Linee guida**, accessibile dalla testata della mappa, raccoglie
convenzioni generali su naming, organizzazione dei file, qualità del codice,
accessibilità e sicurezza. Un pulsante separato nella testata apre la pagina
introduttiva su sicurezza informatica e hacking etico, con risorse per
esercitarsi in ambienti autorizzati. I contenuti sono statici nel progetto e
non richiedono tabelle o migrazioni Supabase.
