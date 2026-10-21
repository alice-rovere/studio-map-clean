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
