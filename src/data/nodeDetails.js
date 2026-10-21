export const nodeDetails = {
  html: {
    description: "Il linguaggio di markup che dà struttura e significato ai contenuti di una pagina web.",
    links: [{ label: "Documentazione HTML — MDN", url: "https://developer.mozilla.org/docs/Web/HTML" }],
  },
  css: {
    description: "Il linguaggio che definisce presentazione, layout e adattamento dell'interfaccia ai diversi dispositivi.",
    links: [{ label: "Documentazione CSS — MDN", url: "https://developer.mozilla.org/docs/Web/CSS" }],
  },
  js: {
    description: "Il linguaggio che aggiunge comportamento e interattività alle applicazioni web.",
    links: [{ label: "JavaScript Guide — MDN", url: "https://developer.mozilla.org/docs/Web/JavaScript/Guide" }],
  },
  ts: {
    description: "Un superset di JavaScript con tipi statici che aiuta a individuare errori e mantenere progetti complessi.",
    links: [{ label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" }],
  },
  bootstrap: {
    description: "Framework CSS con componenti e utility pronti per realizzare interfacce responsive.",
    links: [{ label: "Documentazione Bootstrap", url: "https://getbootstrap.com/docs/" }],
  },
  tailwind: {
    description: "Framework CSS utility-first per comporre stili direttamente nei componenti dell'interfaccia.",
    links: [{ label: "Documentazione Tailwind CSS", url: "https://tailwindcss.com/docs" }],
  },
  react: {
    description: "Libreria per costruire interfacce componendo elementi riutilizzabili e gestendo lo stato in modo dichiarativo.",
    links: [{ label: "Documentazione React", url: "https://react.dev/learn" }],
  },
  "react-flow": {
    description: "Libreria React per creare editor visuali, diagrammi interattivi e mappe di nodi connessi.",
    links: [{ label: "Documentazione React Flow", url: "https://reactflow.dev/learn" }],
  },
  nextjs: {
    description: "Framework React per applicazioni web con routing, rendering server-side e funzionalità full-stack.",
    links: [{ label: "Documentazione Next.js", url: "https://nextjs.org/docs" }],
  },
  vue: {
    description: "Framework progressivo per creare interfacce web con componenti e un modello reattivo.",
    links: [{ label: "Guida Vue.js", url: "https://vuejs.org/guide/" }],
  },
  nuxt: {
    description: "Framework basato su Vue che offre routing, rendering server-side e convenzioni per applicazioni full-stack.",
    links: [{ label: "Documentazione Nuxt", url: "https://nuxt.com/docs" }],
  },
  angular: {
    description: "Framework completo basato su TypeScript per applicazioni web strutturate e scalabili.",
    links: [{ label: "Documentazione Angular", url: "https://angular.dev/overview" }],
  },
  svelte: {
    description: "Framework UI compiler-based che trasforma componenti dichiarativi in JavaScript efficiente.",
    links: [{ label: "Documentazione Svelte", url: "https://svelte.dev/docs" }],
  },
  nodejs: {
    description: "Runtime JavaScript per eseguire codice lato server e costruire servizi e strumenti.",
    links: [{ label: "Documentazione Node.js", url: "https://nodejs.org/docs/latest/api/" }],
  },
  nestjs: {
    description: "Framework Node.js per API server-side modulari, basate su TypeScript e dependency injection.",
    links: [{ label: "Documentazione NestJS", url: "https://docs.nestjs.com/" }],
  },
  php: {
    description: "Linguaggio general-purpose molto usato per lo sviluppo web lato server.",
    links: [{ label: "Manuale PHP", url: "https://www.php.net/manual/en/" }],
  },
  python: {
    description: "Linguaggio general-purpose leggibile, utilizzato nello sviluppo backend, nell'automazione e nei dati.",
    links: [{ label: "Tutorial ufficiale Python", url: "https://docs.python.org/3/tutorial/" }],
  },
  fastapi: {
    description: "Framework Python per creare API con validazione dei dati e documentazione OpenAPI automatizzata.",
    links: [{ label: "Documentazione FastAPI", url: "https://fastapi.tiangolo.com/" }],
  },
  go: {
    description: "Linguaggio compilato progettato per servizi efficienti, concorrenza semplice e distribuzione essenziale.",
    links: [{ label: "Documentazione Go", url: "https://go.dev/doc/" }],
  },
  prisma: {
    description: "ORM per modellare database e interrogare i dati con un client generato e tipizzato.",
    links: [{ label: "Documentazione Prisma", url: "https://www.prisma.io/docs" }],
  },
  drizzle: {
    description: "ORM TypeScript leggero che consente di definire schema e query con un approccio vicino a SQL.",
    links: [{ label: "Documentazione Drizzle ORM", url: "https://orm.drizzle.team/docs/overview" }],
  },
  postgresql: {
    description: "Database relazionale open source, estensibile e conforme agli standard SQL.",
    links: [{ label: "Documentazione PostgreSQL", url: "https://www.postgresql.org/docs/" }],
  },
  mysql: {
    description: "Database relazionale utilizzato per applicazioni web e servizi che richiedono dati strutturati.",
    links: [{ label: "Documentazione MySQL", url: "https://dev.mysql.com/doc/" }],
  },
  mongodb: {
    description: "Database documentale che archivia dati in documenti flessibili simili a JSON.",
    links: [{ label: "Documentazione MongoDB", url: "https://www.mongodb.com/docs/" }],
  },
  redis: {
    description: "Data store in-memory usato per caching, code, sessioni e altri dati a bassa latenza.",
    links: [{ label: "Documentazione Redis", url: "https://redis.io/docs/latest/" }],
  },
  supabase: {
    description: "Piattaforma backend open source basata su PostgreSQL, con autenticazione, storage e API.",
    links: [{ label: "Documentazione Supabase", url: "https://supabase.com/docs" }],
  },
  firebase: {
    description: "Piattaforma Google con servizi gestiti per database, autenticazione, hosting e app mobile.",
    links: [{ label: "Documentazione Firebase", url: "https://firebase.google.com/docs" }],
  },
  milvus: {
    description: "Database vettoriale per archiviare e cercare embedding in applicazioni di machine learning e AI.",
    links: [{ label: "Documentazione Milvus", url: "https://milvus.io/docs" }],
  },
  git: {
    description: "Sistema distribuito di controllo versione per tracciare modifiche e collaborare sul codice.",
    links: [{ label: "Documentazione Git", url: "https://git-scm.com/doc" }],
  },
  github: {
    description: "Piattaforma per ospitare repository Git, revisionare codice e collaborare sui progetti.",
    links: [{ label: "Documentazione GitHub", url: "https://docs.github.com/" }],
  },
  docker: {
    description: "Piattaforma per creare ed eseguire applicazioni in container riproducibili.",
    links: [{ label: "Documentazione Docker", url: "https://docs.docker.com/" }],
  },
  pnpm: {
    description: "Package manager efficiente per JavaScript, con supporto per workspace e monorepo.",
    links: [{ label: "Documentazione pnpm", url: "https://pnpm.io/motivation" }],
  },
  "github-actions": {
    description: "Servizio di automazione integrato in GitHub per test, build e distribuzioni tramite workflow.",
    links: [{ label: "Documentazione GitHub Actions", url: "https://docs.github.com/actions" }],
  },
  vscode: {
    description: "Editor di codice estensibile con strumenti integrati per sviluppo, debugging e controllo versione.",
    links: [{ label: "Documentazione Visual Studio Code", url: "https://code.visualstudio.com/docs" }],
  },
  dbeaver: {
    description: "Applicazione desktop per connettersi a database, esplorare schemi ed eseguire query.",
    links: [{ label: "Documentazione DBeaver", url: "https://dbeaver.com/docs/dbeaver/" }],
  },
  figma: {
    description: "Strumento collaborativo per progettare interfacce, prototipi e sistemi di design.",
    links: [{ label: "Centro assistenza Figma", url: "https://help.figma.com/hc/en-us" }],
  },
  postman: {
    description: "Strumento per costruire, inviare e verificare richieste API durante lo sviluppo.",
    links: [
      { label: "Documentazione Postman", url: "https://learning.postman.com/docs/" },
      { label: "Documentazione Bruno", url: "https://docs.usebruno.com/" },
    ],
  },
};

export const nodeNamingConventions = {
  html: ["Attributi e data-attribute in kebab-case.", "Usa id descrittivi e univoci; preferisci classi semantiche."],
  css: ["Classi e custom properties in kebab-case.", "Raggruppa le classi per componente, ad esempio .user-card__title."],
  js: ["Variabili e funzioni in camelCase; costanti condivise in UPPER_SNAKE_CASE.", "Usa nomi descrittivi per file e moduli, ad esempio user-service.js."],
  ts: ["Variabili e funzioni in camelCase; tipi e interfacce in PascalCase.", "Enum e classi in PascalCase; evita prefissi come I per le interfacce."],
  bootstrap: ["Mantieni le classi Bootstrap in kebab-case come definite dal framework.", "Per le classi personalizzate usa nomi semantici in kebab-case."],
  tailwind: ["Componi le utility con le classi ufficiali in kebab-case.", "Nomina componenti e variabili di stile in base al loro ruolo, non all'aspetto."],
  react: ["Componenti React in PascalCase; file del componente con lo stesso nome.", "Hook personalizzati con prefisso use e funzioni in camelCase."],
  "react-flow": ["Usa ID stabili e descrittivi per nodi e archi, ad esempio user-service.", "Componenti React custom in PascalCase; tipi e handler in camelCase."],
  nextjs: ["Componenti in PascalCase; file speciali rispettano i nomi convenzionali del framework.", "Segmenti URL in kebab-case, ad esempio app/user-settings/page.jsx."],
  vue: ["Componenti in PascalCase; props e variabili in camelCase.", "Nomina i file dei componenti in PascalCase, ad esempio UserCard.vue."],
  nuxt: ["Componenti in PascalCase; file di route e pagine in kebab-case.", "Rispetta i nomi convenzionali Nuxt per directory e file speciali."],
  angular: ["Classi e componenti in PascalCase con suffissi descrittivi, come UserCardComponent.", "File e selettori dei componenti in kebab-case."],
  svelte: ["Componenti in PascalCase; variabili, props e funzioni in camelCase.", "Nomina i file dei componenti in PascalCase, ad esempio UserCard.svelte."],
  nodejs: ["Variabili e funzioni in camelCase; moduli in kebab-case.", "Variabili d'ambiente in UPPER_SNAKE_CASE."],
  nestjs: ["Classi in PascalCase con suffisso del ruolo, come UsersService o UsersController.", "File in kebab-case con suffisso corrispondente, come users.service.ts."],
  php: ["Classi in PascalCase; metodi e variabili in camelCase.", "Costanti in UPPER_SNAKE_CASE e file con nomi descrittivi."],
  python: ["Moduli, funzioni e variabili in snake_case; classi in PascalCase.", "Costanti in UPPER_SNAKE_CASE; usa nomi brevi ma espliciti."],
  fastapi: ["Moduli e funzioni endpoint in snake_case; classi e schemi in PascalCase.", "Usa nomi plurali e coerenti per i router delle risorse, ad esempio users."],
  go: ["Package in minuscolo, brevi e senza underscore; identificatori esportati in PascalCase.", "Usa camelCase per identificatori non esportati e conserva le maiuscole degli acronimi, come ServeHTTP."],
  prisma: ["Modelli in PascalCase e campi in camelCase nello schema Prisma.", "Mappa i nomi SQL con @@map e @map, mantenendo snake_case nel database se adottato."],
  drizzle: ["Schema e proprietà TypeScript in camelCase; tabelle e colonne SQL in snake_case.", "Nomina le tabelle al plurale in modo coerente, ad esempio user_profiles."],
  postgresql: ["Tabelle e colonne in snake_case, senza virgolette e in minuscolo.", "Scegli nomi descrittivi e coerenti; evita parole riservate e abbreviazioni ambigue."],
  mysql: ["Tabelle e colonne in snake_case e minuscolo per favorire la portabilità.", "Mantieni una convenzione uniforme per tabelle, indici e chiavi esterne."],
  mongodb: ["Collezioni in minuscolo e al plurale; campi documento in camelCase.", "Usa nomi coerenti e descrittivi per collezioni e indici."],
  redis: ["Chiavi in minuscolo con segmenti separati da due punti.", "Usa uno schema coerente con prefisso del servizio e della risorsa, ad esempio app:user:42."],
  supabase: ["Tabelle e colonne PostgreSQL in snake_case e minuscolo.", "Nomina policy e bucket in modo descrittivo, indicando risorsa e azione."],
  firebase: ["Collezioni e campi in camelCase con nomi chiari e coerenti.", "Usa ID documento stabili; evita di incorporare dati personali negli identificatori."],
  milvus: ["Collezioni e campi con nomi descrittivi in snake_case.", "Usa nomi coerenti per vettori, metadati e identificatori, ad esempio document_embedding."],
  git: ["Messaggi di commit secondo Conventional Commits, ad esempio feat: add user search.", "Nomi dei branch in kebab-case con prefisso di lavoro, come feature/user-search."],
  github: ["Repository, branch e workflow in kebab-case e con nomi orientati allo scopo.", "Issue e pull request con titoli chiari; commit secondo Conventional Commits."],
  docker: ["Usa Dockerfile con la grafia convenzionale e nomi descrittivi per immagini e servizi.", "Tag delle immagini in minuscolo, evitando latest per release riproducibili."],
  pnpm: ["Package in kebab-case e con scope del workspace coerente.", "Mantieni i nomi dei package allineati alla cartella e al ruolo del modulo."],
  "github-actions": ["File workflow in kebab-case; assegna a workflow e job nomi espliciti.", "Usa ID step brevi e descrittivi e nomi coerenti per gli input personalizzati."],
  vscode: ["File e cartelle del progetto in kebab-case; simboli seguono la convenzione del linguaggio.", "Nelle impostazioni, usa gli identificatori ufficiali delle estensioni e degli editor."],
  dbeaver: ["Dai alle connessioni nomi che identificano ambiente, progetto e database.", "Usa alias descrittivi per script e query salvate, ad esempio report-monthly-sales.sql."],
  figma: ["Organizza pagine, componenti e varianti con nomi descrittivi e coerenti.", "Usa slash per raggruppare componenti correlati, ad esempio Button/Primary."],
  postman: ["Nomina collection, cartelle e richieste secondo risorsa e azione HTTP.", "Usa variabili d'ambiente con nomi maiuscoli e chiari, senza inserire segreti nelle collection."],
};
