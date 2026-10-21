# Spunti per ampliare la Studio Map

Questi spunti partono dai nodi e dai collegamenti gia presenti nella mappa
(React, JavaScript, TypeScript, HTML, CSS, Supabase, Git, GitHub, Docker,
GitHub Actions e altri). Sono proposte da valutare, non nodi gia aggiunti al
database.

## Priorita alta

| Spunto | Categoria | Perche inserirlo | Collegamenti possibili |
| --- | --- | --- | --- |
| **Emmet** | tools | Abbreviazioni per scrivere rapidamente HTML e CSS negli editor; completa bene il nodo VS Code. | VS Code, HTML, CSS |
| **Accessibilita web (a11y)** | frontend | Principi pratici per rendere interfacce e contenuti utilizzabili da piu persone: semantica, tastiera, focus e nomi accessibili. | HTML, React, CSS |
| **Testing** | tools | La mappa mostra come costruire applicazioni, ma non ancora come verificarle in modo sistematico. Si puo partire da un nodo generale e aggiungere strumenti in seguito. | JavaScript, TypeScript, React, GitHub Actions |
| **Vitest** | tools | Test unitari e di integrazione rapidi, adatti all'attuale stack Vite. | Vite, JavaScript, TypeScript, Testing |
| **Playwright** | tools | Test end-to-end nel browser per verificare i flussi utente reali. | React, Testing, GitHub Actions |
| **HTTP e API REST** | backend | Collega frontend, strumenti API gia presenti e servizi backend; copre richieste, metodi, status code e formati JSON. | JavaScript, React, Node.js, FastAPI, Postman / Bruno |
| **Autenticazione e autorizzazione** | backend | Concetti distinti e importanti per applicazioni con account e permessi, gia rilevanti nell'app tramite Supabase Auth e RLS. | React, Supabase, PostgreSQL, HTTP e API REST |
| **Deploy e hosting** | devops | Completa il percorso oltre lo sviluppo locale: build, configurazione, ambienti e pubblicazione. Conviene scegliere un provider effettivamente usato dallo studio. | Vite, GitHub, GitHub Actions |
| **Chrome DevTools** | tools | Strumenti per ispezionare DOM e CSS, diagnosticare errori JavaScript e analizzare rete e prestazioni. | HTML, CSS, JavaScript, React |

## Priorita media

| Spunto | Categoria | Perche inserirlo | Collegamenti possibili |
| --- | --- | --- | --- |
| **Formattazione e linting (Prettier / ESLint)** | tools | Rende espliciti gli strumenti di qualita del codice gia configurati in molti progetti e distingue formattazione da analisi statica. | VS Code, JavaScript, TypeScript, GitHub Actions |
| **Design responsive** | frontend | Approfondisce layout adattivi, breakpoint e approccio mobile-first oltre ai singoli framework CSS. | CSS, Tailwind CSS, Bootstrap, Figma |
| **Gestione dello stato** | frontend | Aiuta a capire dove tenere lo stato dell'interfaccia e quando servono strumenti dedicati; si puo iniziare dai concetti React senza scegliere subito una libreria. | React, JavaScript, TypeScript |
| **Autenticazione con sessioni e token** | backend | Approfondimento pratico di autenticazione, sessioni, token e protezione delle rotte, distinto dall'autorizzazione. | HTTP e API REST, Supabase, Node.js |
| **Migrazioni e modellazione dati** | database | Rende visibili schema, vincoli, migrazioni e politiche di accesso; temi gia presenti nel progetto ma non come nodi autonomi. | PostgreSQL, Supabase, Prisma ORM, Drizzle ORM |
| **Logging e monitoraggio** | devops | Introduce diagnosi degli errori e osservabilita dopo il deploy, non solo build e automazione. | Node.js, Docker, Deploy e hosting, GitHub Actions |
| **Gestione delle dipendenze e versioni Node.js** | devops | Collega pnpm e Node.js a lockfile, script, aggiornamenti e versioni runtime riproducibili. | pnpm, Node.js, Vite, GitHub Actions |

## Possibili percorsi nella mappa

1. **Dall'idea all'interfaccia:** Figma → HTML/CSS → Accessibilita web →
   React → Testing → Deploy e hosting.
2. **Dalla UI ai dati:** React → HTTP e API REST → Autenticazione e
   autorizzazione → Supabase → PostgreSQL.
3. **Dal codice alla produzione:** Git → GitHub → ESLint / Prettier →
   GitHub Actions → Testing → Deploy e hosting → Logging e monitoraggio.
4. **Scrittura frontend:** VS Code → Emmet → HTML/CSS → React.

## Suggerimento per l'inserimento

Per mantenere leggibile la mappa, aggiungerei prima **Emmet, Accessibilita
web, Testing, Vitest, Playwright, HTTP e API REST, Autenticazione e
autorizzazione, Deploy e hosting e Chrome DevTools**. Per i nuovi nodi,
definirei subito una breve descrizione, le risorse di studio e pochi
collegamenti diretti; gli approfondimenti piu specialistici possono arrivare
in seguito.

Per **Deploy e hosting** e **Formattazione e linting**, sceglierei prodotti
concreti solo dopo aver verificato quali usa davvero lo studio, evitando di
riempire la mappa di alternative equivalenti.
