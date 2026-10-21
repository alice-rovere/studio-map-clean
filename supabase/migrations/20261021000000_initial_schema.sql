create table public.nodes (id text primary key, label text not null, category text not null check (category in ('frontend','backend','database','devops','tools')), position_x double precision not null, position_y double precision not null);

create table public.edges (id text primary key, source text not null references public.nodes(id) on delete cascade, target text not null references public.nodes(id) on delete cascade, type text not null);

create table public.node_details (id uuid primary key default gen_random_uuid(), node_id text not null unique references public.nodes(id) on delete cascade, description text not null default '', best_practices text not null default '', naming_conventions text[] not null default '{}', associated_software text[] not null default '{}', study_urls jsonb not null default '[]'::jsonb);

create table public.glossary (id uuid primary key default gen_random_uuid(), term text not null, definition text not null, constraint glossary_term_nonempty check (length(trim(term)) > 0), constraint glossary_definition_nonempty check (length(trim(definition)) > 0));

create unique index glossary_term_case_insensitive_idx on public.glossary (lower(term));

alter table public.nodes enable row level security; alter table public.edges enable row level security; alter table public.node_details enable row level security; alter table public.glossary enable row level security;

create policy "Public can read nodes" on public.nodes for select to anon using (true);

create policy "Public can update nodes" on public.nodes for update to anon using (true) with check (true);

create policy "Public can delete nodes" on public.nodes for delete to anon using (true);

create policy "Public can read edges" on public.edges for select to anon using (true);

create policy "Public can create edges" on public.edges for insert to anon with check (true);

create policy "Public can delete edges" on public.edges for delete to anon using (true);

create policy "Public can read node details" on public.node_details for select to anon using (true);

create policy "Public can read glossary" on public.glossary for select to anon using (true);

create policy "Public can add glossary terms" on public.glossary for insert to anon with check (true);

grant select, update, delete on public.nodes to anon; grant select, insert, delete on public.edges to anon; grant select on public.node_details to anon; grant select, insert on public.glossary to anon;

insert into public.nodes (id,label,category,position_x,position_y) values
('html','HTML5','frontend',100,150),
('css','CSS3','frontend',100,300),
('js','JavaScript Vanilla','frontend',250,220),
('ts','TypeScript','frontend',400,220),
('bootstrap','Bootstrap','frontend',250,400),
('tailwind','Tailwind CSS','frontend',400,400),
('react','React','frontend',550,220),
('react-flow','React Flow','frontend',700,120),
('nextjs','Next.js','frontend',700,220),
('vue','Vue.js (Da Studiare)','frontend',550,50),
('nuxt','Nuxt.js (Da Studiare)','frontend',700,20),
('angular','Angular (Da Studiare)','frontend',550,380),
('svelte','Svelte (Da Studiare)','frontend',550,480),
('nodejs','Node.js','backend',900,220),
('nestjs','NestJS (Da Studiare)','backend',1050,120),
('php','PHP','backend',900,350),
('python','Python','backend',900,480),
('fastapi','FastAPI (Da Studiare)','backend',1050,480),
('go','Go / Golang (Da Studiare)','backend',900,600),
('prisma','Prisma ORM','backend',1100,220),
('drizzle','Drizzle ORM','backend',1100,320),
('postgresql','PostgreSQL','database',1350,220),
('mysql','MySQL','database',1350,350),
('mongodb','MongoDB','database',1350,480),
('redis','Redis (Caching)','database',1100,100),
('supabase','Supabase (BaaS)','database',1550,220),
('firebase','Firebase (BaaS)','database',1550,480),
('milvus','Vector DB / AI (Da Studiare)','database',1100,580),
('git','Git','devops',250,20),
('github','GitHub','devops',400,20),
('docker','Docker','devops',1350,50),
('pnpm','pnpm','devops',900,100),
('github-actions','GitHub Actions (CI/CD)','devops',400,-80),
('vscode','VS Code','tools',100,20),
('dbeaver','DBeaver','tools',1550,350),
('figma','Figma','tools',400,520),
('postman','Postman / Bruno','tools',1250,600);

insert into public.edges (id,source,target,type) values
('e-html-css','html','css','smoothstep'),
('e-css-bootstrap','css','bootstrap','smoothstep'),
('e-css-tailwind','css','tailwind','smoothstep'),
('e-css-js','css','js','smoothstep'),
('e-js-ts','js','ts','smoothstep'),
('e-ts-react','ts','react','smoothstep'),
('e-react-nextjs','react','nextjs','smoothstep'),
('e-react-rf','react','react-flow','smoothstep'),
('e-ts-vue','ts','vue','smoothstep'),
('e-vue-nuxt','vue','nuxt','smoothstep'),
('e-ts-angular','ts','angular','smoothstep'),
('e-ts-svelte','ts','svelte','smoothstep'),
('e-js-node','js','nodejs','smoothstep'),
('e-ts-nestjs','ts','nestjs','smoothstep'),
('e-node-nestjs','nodejs','nestjs','smoothstep'),
('e-node-prisma','nodejs','prisma','smoothstep'),
('e-node-drizzle','nodejs','drizzle','smoothstep'),
('e-python-fastapi','python','fastapi','smoothstep'),
('e-prisma-postgres','prisma','postgresql','smoothstep'),
('e-drizzle-postgres','drizzle','postgresql','smoothstep'),
('e-prisma-mysql','prisma','mysql','smoothstep'),
('e-postgres-supabase','postgresql','supabase','smoothstep'),
('e-mongodb-firebase','mongodb','firebase','smoothstep'),
('e-python-milvus','python','milvus','smoothstep'),
('e-node-redis','nodejs','redis','smoothstep'),
('e-dbeaver-postgres','dbeaver','postgresql','smoothstep'),
('e-dbeaver-mysql','dbeaver','mysql','smoothstep'),
('e-postman-nestjs','postman','nestjs','smoothstep'),
('e-postman-fastapi','postman','fastapi','smoothstep'),
('e-figma-tailwind','figma','tailwind','smoothstep'),
('e-vscode-git','vscode','git','smoothstep'),
('e-git-github','git','github','smoothstep'),
('e-github-actions','github','github-actions','smoothstep'),
('e-pnpm-node','pnpm','nodejs','smoothstep'),
('e-docker-postgres','docker','postgresql','smoothstep');

insert into public.node_details (node_id,description,best_practices,naming_conventions,associated_software,study_urls) values
('html','Il linguaggio di markup che dà struttura e significato ai contenuti di una pagina web.',array_to_string(ARRAY['Preferisci componenti piccoli e riutilizzabili, con responsabilita chiare.', 'Verifica accessibilita, stati di caricamento ed errori oltre al caso ideale.', 'Mantieni dipendenze e bundle essenziali; testa l''interfaccia sui breakpoint supportati.']::text[], E'\n'),ARRAY['Attributi e data-attribute in kebab-case.', 'Usa id descrittivi e univoci; preferisci classi semantiche.']::text[],ARRAY[]::text[],'[{"label":"Documentazione HTML — MDN","url":"https://developer.mozilla.org/docs/Web/HTML"}]'::jsonb),
('css','Il linguaggio che definisce presentazione, layout e adattamento dell''interfaccia ai diversi dispositivi.',array_to_string(ARRAY['Preferisci componenti piccoli e riutilizzabili, con responsabilita chiare.', 'Verifica accessibilita, stati di caricamento ed errori oltre al caso ideale.', 'Mantieni dipendenze e bundle essenziali; testa l''interfaccia sui breakpoint supportati.']::text[], E'\n'),ARRAY['Classi e custom properties in kebab-case.', 'Raggruppa le classi per componente, ad esempio .user-card__title.']::text[],ARRAY[]::text[],'[{"label":"Documentazione CSS — MDN","url":"https://developer.mozilla.org/docs/Web/CSS"}]'::jsonb),
('js','Il linguaggio che aggiunge comportamento e interattività alle applicazioni web.',array_to_string(ARRAY['Preferisci componenti piccoli e riutilizzabili, con responsabilita chiare.', 'Verifica accessibilita, stati di caricamento ed errori oltre al caso ideale.', 'Mantieni dipendenze e bundle essenziali; testa l''interfaccia sui breakpoint supportati.']::text[], E'\n'),ARRAY['Variabili e funzioni in camelCase; costanti condivise in UPPER_SNAKE_CASE.', 'Usa nomi descrittivi per file e moduli, ad esempio user-service.js.']::text[],ARRAY[]::text[],'[{"label":"JavaScript Guide — MDN","url":"https://developer.mozilla.org/docs/Web/JavaScript/Guide"}]'::jsonb),
('ts','Un superset di JavaScript con tipi statici che aiuta a individuare errori e mantenere progetti complessi.',array_to_string(ARRAY['Preferisci componenti piccoli e riutilizzabili, con responsabilita chiare.', 'Verifica accessibilita, stati di caricamento ed errori oltre al caso ideale.', 'Mantieni dipendenze e bundle essenziali; testa l''interfaccia sui breakpoint supportati.']::text[], E'\n'),ARRAY['Variabili e funzioni in camelCase; tipi e interfacce in PascalCase.', 'Enum e classi in PascalCase; evita prefissi come I per le interfacce.']::text[],ARRAY[]::text[],'[{"label":"TypeScript Handbook","url":"https://www.typescriptlang.org/docs/handbook/intro.html"}]'::jsonb),
('bootstrap','Framework CSS con componenti e utility pronti per realizzare interfacce responsive.',array_to_string(ARRAY['Preferisci componenti piccoli e riutilizzabili, con responsabilita chiare.', 'Verifica accessibilita, stati di caricamento ed errori oltre al caso ideale.', 'Mantieni dipendenze e bundle essenziali; testa l''interfaccia sui breakpoint supportati.']::text[], E'\n'),ARRAY['Mantieni le classi Bootstrap in kebab-case come definite dal framework.', 'Per le classi personalizzate usa nomi semantici in kebab-case.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Bootstrap","url":"https://getbootstrap.com/docs/"}]'::jsonb),
('tailwind','Framework CSS utility-first per comporre stili direttamente nei componenti dell''interfaccia.',array_to_string(ARRAY['Preferisci componenti piccoli e riutilizzabili, con responsabilita chiare.', 'Verifica accessibilita, stati di caricamento ed errori oltre al caso ideale.', 'Mantieni dipendenze e bundle essenziali; testa l''interfaccia sui breakpoint supportati.']::text[], E'\n'),ARRAY['Componi le utility con le classi ufficiali in kebab-case.', 'Nomina componenti e variabili di stile in base al loro ruolo, non all''aspetto.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Tailwind CSS","url":"https://tailwindcss.com/docs"}]'::jsonb),
('react','Libreria per costruire interfacce componendo elementi riutilizzabili e gestendo lo stato in modo dichiarativo.',array_to_string(ARRAY['Preferisci componenti piccoli e riutilizzabili, con responsabilita chiare.', 'Verifica accessibilita, stati di caricamento ed errori oltre al caso ideale.', 'Mantieni dipendenze e bundle essenziali; testa l''interfaccia sui breakpoint supportati.']::text[], E'\n'),ARRAY['Componenti React in PascalCase; file del componente con lo stesso nome.', 'Hook personalizzati con prefisso use e funzioni in camelCase.']::text[],ARRAY[]::text[],'[{"label":"Documentazione React","url":"https://react.dev/learn"}]'::jsonb),
('react-flow','Libreria React per creare editor visuali, diagrammi interattivi e mappe di nodi connessi.',array_to_string(ARRAY['Preferisci componenti piccoli e riutilizzabili, con responsabilita chiare.', 'Verifica accessibilita, stati di caricamento ed errori oltre al caso ideale.', 'Mantieni dipendenze e bundle essenziali; testa l''interfaccia sui breakpoint supportati.']::text[], E'\n'),ARRAY['Usa ID stabili e descrittivi per nodi e archi, ad esempio user-service.', 'Componenti React custom in PascalCase; tipi e handler in camelCase.']::text[],ARRAY[]::text[],'[{"label":"Documentazione React Flow","url":"https://reactflow.dev/learn"}]'::jsonb),
('nextjs','Framework React per applicazioni web con routing, rendering server-side e funzionalità full-stack.',array_to_string(ARRAY['Preferisci componenti piccoli e riutilizzabili, con responsabilita chiare.', 'Verifica accessibilita, stati di caricamento ed errori oltre al caso ideale.', 'Mantieni dipendenze e bundle essenziali; testa l''interfaccia sui breakpoint supportati.']::text[], E'\n'),ARRAY['Componenti in PascalCase; file speciali rispettano i nomi convenzionali del framework.', 'Segmenti URL in kebab-case, ad esempio app/user-settings/page.jsx.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Next.js","url":"https://nextjs.org/docs"}]'::jsonb),
('vue','Framework progressivo per creare interfacce web con componenti e un modello reattivo.',array_to_string(ARRAY['Preferisci componenti piccoli e riutilizzabili, con responsabilita chiare.', 'Verifica accessibilita, stati di caricamento ed errori oltre al caso ideale.', 'Mantieni dipendenze e bundle essenziali; testa l''interfaccia sui breakpoint supportati.']::text[], E'\n'),ARRAY['Componenti in PascalCase; props e variabili in camelCase.', 'Nomina i file dei componenti in PascalCase, ad esempio UserCard.vue.']::text[],ARRAY[]::text[],'[{"label":"Guida Vue.js","url":"https://vuejs.org/guide/"}]'::jsonb),
('nuxt','Framework basato su Vue che offre routing, rendering server-side e convenzioni per applicazioni full-stack.',array_to_string(ARRAY['Preferisci componenti piccoli e riutilizzabili, con responsabilita chiare.', 'Verifica accessibilita, stati di caricamento ed errori oltre al caso ideale.', 'Mantieni dipendenze e bundle essenziali; testa l''interfaccia sui breakpoint supportati.']::text[], E'\n'),ARRAY['Componenti in PascalCase; file di route e pagine in kebab-case.', 'Rispetta i nomi convenzionali Nuxt per directory e file speciali.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Nuxt","url":"https://nuxt.com/docs"}]'::jsonb),
('angular','Framework completo basato su TypeScript per applicazioni web strutturate e scalabili.',array_to_string(ARRAY['Preferisci componenti piccoli e riutilizzabili, con responsabilita chiare.', 'Verifica accessibilita, stati di caricamento ed errori oltre al caso ideale.', 'Mantieni dipendenze e bundle essenziali; testa l''interfaccia sui breakpoint supportati.']::text[], E'\n'),ARRAY['Classi e componenti in PascalCase con suffissi descrittivi, come UserCardComponent.', 'File e selettori dei componenti in kebab-case.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Angular","url":"https://angular.dev/overview"}]'::jsonb),
('svelte','Framework UI compiler-based che trasforma componenti dichiarativi in JavaScript efficiente.',array_to_string(ARRAY['Preferisci componenti piccoli e riutilizzabili, con responsabilita chiare.', 'Verifica accessibilita, stati di caricamento ed errori oltre al caso ideale.', 'Mantieni dipendenze e bundle essenziali; testa l''interfaccia sui breakpoint supportati.']::text[], E'\n'),ARRAY['Componenti in PascalCase; variabili, props e funzioni in camelCase.', 'Nomina i file dei componenti in PascalCase, ad esempio UserCard.svelte.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Svelte","url":"https://svelte.dev/docs"}]'::jsonb),
('nodejs','Runtime JavaScript per eseguire codice lato server e costruire servizi e strumenti.',array_to_string(ARRAY['Valida gli input al confine dell''API e restituisci errori coerenti.', 'Tieni segreti e configurazione fuori dal codice e applica il principio del minimo privilegio.', 'Aggiungi test per i casi limite e log strutturati senza dati sensibili.']::text[], E'\n'),ARRAY['Variabili e funzioni in camelCase; moduli in kebab-case.', 'Variabili d''ambiente in UPPER_SNAKE_CASE.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Node.js","url":"https://nodejs.org/docs/latest/api/"}]'::jsonb),
('nestjs','Framework Node.js per API server-side modulari, basate su TypeScript e dependency injection.',array_to_string(ARRAY['Valida gli input al confine dell''API e restituisci errori coerenti.', 'Tieni segreti e configurazione fuori dal codice e applica il principio del minimo privilegio.', 'Aggiungi test per i casi limite e log strutturati senza dati sensibili.']::text[], E'\n'),ARRAY['Classi in PascalCase con suffisso del ruolo, come UsersService o UsersController.', 'File in kebab-case con suffisso corrispondente, come users.service.ts.']::text[],ARRAY[]::text[],'[{"label":"Documentazione NestJS","url":"https://docs.nestjs.com/"}]'::jsonb),
('php','Linguaggio general-purpose molto usato per lo sviluppo web lato server.',array_to_string(ARRAY['Valida gli input al confine dell''API e restituisci errori coerenti.', 'Tieni segreti e configurazione fuori dal codice e applica il principio del minimo privilegio.', 'Aggiungi test per i casi limite e log strutturati senza dati sensibili.']::text[], E'\n'),ARRAY['Classi in PascalCase; metodi e variabili in camelCase.', 'Costanti in UPPER_SNAKE_CASE e file con nomi descrittivi.']::text[],ARRAY[]::text[],'[{"label":"Manuale PHP","url":"https://www.php.net/manual/en/"}]'::jsonb),
('python','Linguaggio general-purpose leggibile, utilizzato nello sviluppo backend, nell''automazione e nei dati.',array_to_string(ARRAY['Valida gli input al confine dell''API e restituisci errori coerenti.', 'Tieni segreti e configurazione fuori dal codice e applica il principio del minimo privilegio.', 'Aggiungi test per i casi limite e log strutturati senza dati sensibili.']::text[], E'\n'),ARRAY['Moduli, funzioni e variabili in snake_case; classi in PascalCase.', 'Costanti in UPPER_SNAKE_CASE; usa nomi brevi ma espliciti.']::text[],ARRAY[]::text[],'[{"label":"Tutorial ufficiale Python","url":"https://docs.python.org/3/tutorial/"}]'::jsonb),
('fastapi','Framework Python per creare API con validazione dei dati e documentazione OpenAPI automatizzata.',array_to_string(ARRAY['Valida gli input al confine dell''API e restituisci errori coerenti.', 'Tieni segreti e configurazione fuori dal codice e applica il principio del minimo privilegio.', 'Aggiungi test per i casi limite e log strutturati senza dati sensibili.']::text[], E'\n'),ARRAY['Moduli e funzioni endpoint in snake_case; classi e schemi in PascalCase.', 'Usa nomi plurali e coerenti per i router delle risorse, ad esempio users.']::text[],ARRAY[]::text[],'[{"label":"Documentazione FastAPI","url":"https://fastapi.tiangolo.com/"}]'::jsonb),
('go','Linguaggio compilato progettato per servizi efficienti, concorrenza semplice e distribuzione essenziale.',array_to_string(ARRAY['Valida gli input al confine dell''API e restituisci errori coerenti.', 'Tieni segreti e configurazione fuori dal codice e applica il principio del minimo privilegio.', 'Aggiungi test per i casi limite e log strutturati senza dati sensibili.']::text[], E'\n'),ARRAY['Package in minuscolo, brevi e senza underscore; identificatori esportati in PascalCase.', 'Usa camelCase per identificatori non esportati e conserva le maiuscole degli acronimi, come ServeHTTP.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Go","url":"https://go.dev/doc/"}]'::jsonb),
('prisma','ORM per modellare database e interrogare i dati con un client generato e tipizzato.',array_to_string(ARRAY['Valida gli input al confine dell''API e restituisci errori coerenti.', 'Tieni segreti e configurazione fuori dal codice e applica il principio del minimo privilegio.', 'Aggiungi test per i casi limite e log strutturati senza dati sensibili.']::text[], E'\n'),ARRAY['Modelli in PascalCase e campi in camelCase nello schema Prisma.', 'Mappa i nomi SQL con @@map e @map, mantenendo snake_case nel database se adottato.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Prisma","url":"https://www.prisma.io/docs"}]'::jsonb),
('drizzle','ORM TypeScript leggero che consente di definire schema e query con un approccio vicino a SQL.',array_to_string(ARRAY['Valida gli input al confine dell''API e restituisci errori coerenti.', 'Tieni segreti e configurazione fuori dal codice e applica il principio del minimo privilegio.', 'Aggiungi test per i casi limite e log strutturati senza dati sensibili.']::text[], E'\n'),ARRAY['Schema e proprietà TypeScript in camelCase; tabelle e colonne SQL in snake_case.', 'Nomina le tabelle al plurale in modo coerente, ad esempio user_profiles.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Drizzle ORM","url":"https://orm.drizzle.team/docs/overview"}]'::jsonb),
('postgresql','Database relazionale open source, estensibile e conforme agli standard SQL.',array_to_string(ARRAY['Definisci schema, vincoli e indici in base alle query reali.', 'Usa migrazioni versionate e verifica le modifiche prima di applicarle in produzione.', 'Applica permessi minimi e prevedi backup e procedure di ripristino.']::text[], E'\n'),ARRAY['Tabelle e colonne in snake_case, senza virgolette e in minuscolo.', 'Scegli nomi descrittivi e coerenti; evita parole riservate e abbreviazioni ambigue.']::text[],ARRAY[]::text[],'[{"label":"Documentazione PostgreSQL","url":"https://www.postgresql.org/docs/"}]'::jsonb),
('mysql','Database relazionale utilizzato per applicazioni web e servizi che richiedono dati strutturati.',array_to_string(ARRAY['Definisci schema, vincoli e indici in base alle query reali.', 'Usa migrazioni versionate e verifica le modifiche prima di applicarle in produzione.', 'Applica permessi minimi e prevedi backup e procedure di ripristino.']::text[], E'\n'),ARRAY['Tabelle e colonne in snake_case e minuscolo per favorire la portabilità.', 'Mantieni una convenzione uniforme per tabelle, indici e chiavi esterne.']::text[],ARRAY[]::text[],'[{"label":"Documentazione MySQL","url":"https://dev.mysql.com/doc/"}]'::jsonb),
('mongodb','Database documentale che archivia dati in documenti flessibili simili a JSON.',array_to_string(ARRAY['Definisci schema, vincoli e indici in base alle query reali.', 'Usa migrazioni versionate e verifica le modifiche prima di applicarle in produzione.', 'Applica permessi minimi e prevedi backup e procedure di ripristino.']::text[], E'\n'),ARRAY['Collezioni in minuscolo e al plurale; campi documento in camelCase.', 'Usa nomi coerenti e descrittivi per collezioni e indici.']::text[],ARRAY[]::text[],'[{"label":"Documentazione MongoDB","url":"https://www.mongodb.com/docs/"}]'::jsonb),
('redis','Data store in-memory usato per caching, code, sessioni e altri dati a bassa latenza.',array_to_string(ARRAY['Definisci schema, vincoli e indici in base alle query reali.', 'Usa migrazioni versionate e verifica le modifiche prima di applicarle in produzione.', 'Applica permessi minimi e prevedi backup e procedure di ripristino.']::text[], E'\n'),ARRAY['Chiavi in minuscolo con segmenti separati da due punti.', 'Usa uno schema coerente con prefisso del servizio e della risorsa, ad esempio app:user:42.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Redis","url":"https://redis.io/docs/latest/"}]'::jsonb),
('supabase','Piattaforma backend open source basata su PostgreSQL, con autenticazione, storage e API.',array_to_string(ARRAY['Definisci schema, vincoli e indici in base alle query reali.', 'Usa migrazioni versionate e verifica le modifiche prima di applicarle in produzione.', 'Applica permessi minimi e prevedi backup e procedure di ripristino.']::text[], E'\n'),ARRAY['Tabelle e colonne PostgreSQL in snake_case e minuscolo.', 'Nomina policy e bucket in modo descrittivo, indicando risorsa e azione.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Supabase","url":"https://supabase.com/docs"}]'::jsonb),
('firebase','Piattaforma Google con servizi gestiti per database, autenticazione, hosting e app mobile.',array_to_string(ARRAY['Definisci schema, vincoli e indici in base alle query reali.', 'Usa migrazioni versionate e verifica le modifiche prima di applicarle in produzione.', 'Applica permessi minimi e prevedi backup e procedure di ripristino.']::text[], E'\n'),ARRAY['Collezioni e campi in camelCase con nomi chiari e coerenti.', 'Usa ID documento stabili; evita di incorporare dati personali negli identificatori.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Firebase","url":"https://firebase.google.com/docs"}]'::jsonb),
('milvus','Database vettoriale per archiviare e cercare embedding in applicazioni di machine learning e AI.',array_to_string(ARRAY['Definisci schema, vincoli e indici in base alle query reali.', 'Usa migrazioni versionate e verifica le modifiche prima di applicarle in produzione.', 'Applica permessi minimi e prevedi backup e procedure di ripristino.']::text[], E'\n'),ARRAY['Collezioni e campi con nomi descrittivi in snake_case.', 'Usa nomi coerenti per vettori, metadati e identificatori, ad esempio document_embedding.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Milvus","url":"https://milvus.io/docs"}]'::jsonb),
('git','Sistema distribuito di controllo versione per tracciare modifiche e collaborare sul codice.',array_to_string(ARRAY['Automatizza i passaggi ripetibili con workflow versionati.', 'Non esporre segreti nei log o nei repository; limita i permessi dei token.', 'Monitora esecuzioni e distribuzioni e documenta il percorso di rollback.']::text[], E'\n'),ARRAY['Messaggi di commit secondo Conventional Commits, ad esempio feat: add user search.', 'Nomi dei branch in kebab-case con prefisso di lavoro, come feature/user-search.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Git","url":"https://git-scm.com/doc"}]'::jsonb),
('github','Piattaforma per ospitare repository Git, revisionare codice e collaborare sui progetti.',array_to_string(ARRAY['Automatizza i passaggi ripetibili con workflow versionati.', 'Non esporre segreti nei log o nei repository; limita i permessi dei token.', 'Monitora esecuzioni e distribuzioni e documenta il percorso di rollback.']::text[], E'\n'),ARRAY['Repository, branch e workflow in kebab-case e con nomi orientati allo scopo.', 'Issue e pull request con titoli chiari; commit secondo Conventional Commits.']::text[],ARRAY[]::text[],'[{"label":"Documentazione GitHub","url":"https://docs.github.com/"}]'::jsonb),
('docker','Piattaforma per creare ed eseguire applicazioni in container riproducibili.',array_to_string(ARRAY['Automatizza i passaggi ripetibili con workflow versionati.', 'Non esporre segreti nei log o nei repository; limita i permessi dei token.', 'Monitora esecuzioni e distribuzioni e documenta il percorso di rollback.']::text[], E'\n'),ARRAY['Usa Dockerfile con la grafia convenzionale e nomi descrittivi per immagini e servizi.', 'Tag delle immagini in minuscolo, evitando latest per release riproducibili.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Docker","url":"https://docs.docker.com/"}]'::jsonb),
('pnpm','Package manager efficiente per JavaScript, con supporto per workspace e monorepo.',array_to_string(ARRAY['Automatizza i passaggi ripetibili con workflow versionati.', 'Non esporre segreti nei log o nei repository; limita i permessi dei token.', 'Monitora esecuzioni e distribuzioni e documenta il percorso di rollback.']::text[], E'\n'),ARRAY['Package in kebab-case e con scope del workspace coerente.', 'Mantieni i nomi dei package allineati alla cartella e al ruolo del modulo.']::text[],ARRAY[]::text[],'[{"label":"Documentazione pnpm","url":"https://pnpm.io/motivation"}]'::jsonb),
('github-actions','Servizio di automazione integrato in GitHub per test, build e distribuzioni tramite workflow.',array_to_string(ARRAY['Automatizza i passaggi ripetibili con workflow versionati.', 'Non esporre segreti nei log o nei repository; limita i permessi dei token.', 'Monitora esecuzioni e distribuzioni e documenta il percorso di rollback.']::text[], E'\n'),ARRAY['File workflow in kebab-case; assegna a workflow e job nomi espliciti.', 'Usa ID step brevi e descrittivi e nomi coerenti per gli input personalizzati.']::text[],ARRAY[]::text[],'[{"label":"Documentazione GitHub Actions","url":"https://docs.github.com/actions"}]'::jsonb),
('vscode','Editor di codice estensibile con strumenti integrati per sviluppo, debugging e controllo versione.',array_to_string(ARRAY['Condividi configurazioni e convenzioni utili nel repository del team.', 'Mantieni strumenti e plugin aggiornati e installa solo cio che serve.', 'Proteggi credenziali e dati di progetto anche negli strumenti locali.']::text[], E'\n'),ARRAY['File e cartelle del progetto in kebab-case; simboli seguono la convenzione del linguaggio.', 'Nelle impostazioni, usa gli identificatori ufficiali delle estensioni e degli editor.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Visual Studio Code","url":"https://code.visualstudio.com/docs"}]'::jsonb),
('dbeaver','Applicazione desktop per connettersi a database, esplorare schemi ed eseguire query.',array_to_string(ARRAY['Condividi configurazioni e convenzioni utili nel repository del team.', 'Mantieni strumenti e plugin aggiornati e installa solo cio che serve.', 'Proteggi credenziali e dati di progetto anche negli strumenti locali.']::text[], E'\n'),ARRAY['Dai alle connessioni nomi che identificano ambiente, progetto e database.', 'Usa alias descrittivi per script e query salvate, ad esempio report-monthly-sales.sql.']::text[],ARRAY[]::text[],'[{"label":"Documentazione DBeaver","url":"https://dbeaver.com/docs/dbeaver/"}]'::jsonb),
('figma','Strumento collaborativo per progettare interfacce, prototipi e sistemi di design.',array_to_string(ARRAY['Condividi configurazioni e convenzioni utili nel repository del team.', 'Mantieni strumenti e plugin aggiornati e installa solo cio che serve.', 'Proteggi credenziali e dati di progetto anche negli strumenti locali.']::text[], E'\n'),ARRAY['Organizza pagine, componenti e varianti con nomi descrittivi e coerenti.', 'Usa slash per raggruppare componenti correlati, ad esempio Button/Primary.']::text[],ARRAY[]::text[],'[{"label":"Centro assistenza Figma","url":"https://help.figma.com/hc/en-us"}]'::jsonb),
('postman','Strumento per costruire, inviare e verificare richieste API durante lo sviluppo.',array_to_string(ARRAY['Condividi configurazioni e convenzioni utili nel repository del team.', 'Mantieni strumenti e plugin aggiornati e installa solo cio che serve.', 'Proteggi credenziali e dati di progetto anche negli strumenti locali.']::text[], E'\n'),ARRAY['Nomina collection, cartelle e richieste secondo risorsa e azione HTTP.', 'Usa variabili d''ambiente con nomi maiuscoli e chiari, senza inserire segreti nelle collection.']::text[],ARRAY[]::text[],'[{"label":"Documentazione Postman","url":"https://learning.postman.com/docs/"},{"label":"Documentazione Bruno","url":"https://docs.usebruno.com/"}]'::jsonb);

insert into public.glossary (term,definition) values
('API','Interfaccia che permette a software diversi di comunicare tra loro.'),
('bundle','File generato raggruppando codice e dipendenze per la distribuzione.'),
('cache','Memoria temporanea che conserva dati usati spesso per recuperarli più rapidamente.'),
('componenti','Parti riutilizzabili dell''interfaccia che possono contenere struttura e comportamento.'),
('container','Ambiente isolato e riproducibile in cui viene eseguita un''applicazione.'),
('framework','Insieme di strumenti e convenzioni che fornisce una struttura per sviluppare software.'),
('ORM','Strumento che collega i dati di un database a oggetti e modelli del codice.'),
('responsive','Capacità di un''interfaccia di adattarsi a dimensioni e dispositivi differenti.'),
('runtime','Ambiente che esegue un programma mentre è in funzione.'),
('server-side','Elaborazione eseguita sul server, anziché nel browser dell''utente.'),
('SQL','Linguaggio usato per definire, interrogare e modificare dati nei database relazionali.'),
('TypeScript','Linguaggio basato su JavaScript che aggiunge controlli di tipo statici.');
