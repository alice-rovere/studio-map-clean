export const DEFAULT_NODE_SUBCATEGORY = "software";

export const NODE_SUBCATEGORIES = {
  "linguaggio-markup": {
    label: "Linguaggio di markup",
    description:
      "Definisce struttura e significato dei contenuti, come HTML.",
  },
  "linguaggio-di-stile": {
    label: "Linguaggio di stile",
    description:
      "Descrive presentazione e layout dell'interfaccia, come CSS.",
  },
  "linguaggio-programmazione": {
    label: "Linguaggio di programmazione",
    description:
      "Linguaggio con cui si scrive la logica di applicazioni e servizi.",
  },
  framework: {
    label: "Framework",
    description:
      "Struttura e convenzioni che guidano la costruzione di un'applicazione.",
  },
  libreria: {
    label: "Libreria",
    description:
      "Insieme di funzionalità riutilizzabili che si integrano nel codice.",
  },
  runtime: {
    label: "Runtime",
    description:
      "Ambiente che esegue il codice di un linguaggio mentre è in funzione.",
  },
  orm: {
    label: "ORM",
    description:
      "Strumento che collega database e modelli del codice.",
  },
  "database-relazionale": {
    label: "Database relazionale",
    description:
      "Database organizzato in tabelle con relazioni e vincoli.",
  },
  "database-documentale": {
    label: "Database documentale",
    description:
      "Database che archivia dati in documenti flessibili.",
  },
  "database-chiave-valore": {
    label: "Database chiave-valore",
    description:
      "Database che associa valori a chiavi, usato anche per cache e sessioni.",
  },
  "database-vettoriale": {
    label: "Database vettoriale",
    description:
      "Database ottimizzato per archiviare e cercare embedding.",
  },
  baas: {
    label: "BaaS",
    description:
      "Backend as a Service: servizi gestiti per dati, autenticazione e API.",
  },
  "sistema-controllo-versione": {
    label: "Sistema di controllo versione",
    description:
      "Strumento che traccia modifiche e cronologia del codice.",
  },
  piattaforma: {
    label: "Piattaforma",
    description:
      "Servizio online che ospita repository, collaborazione o distribuzione.",
  },
  container: {
    label: "Container",
    description:
      "Ambiente isolato e riproducibile per eseguire applicazioni.",
  },
  "package-manager": {
    label: "Package manager",
    description:
      "Strumento per installare e gestire dipendenze e pacchetti.",
  },
  "ci-cd": {
    label: "CI/CD",
    description:
      "Automazione di test, build e distribuzione del software.",
  },
  editor: {
    label: "Editor",
    description:
      "Applicazione per scrivere, leggere e navigare il codice.",
  },
  software: {
    label: "Software",
    description:
      "Applicazione o strumento usato durante il lavoro quotidiano.",
  },
  "build-tool": {
    label: "Build tool",
    description:
      "Strumento che prepara il codice per lo sviluppo o la produzione.",
  },
};

export const NODE_SUBCATEGORY_OPTIONS = Object.entries(
  NODE_SUBCATEGORIES,
).map(([id, config]) => ({ id, ...config }));

export function getSubcategoryLabel(id) {
  return NODE_SUBCATEGORIES[id]?.label ?? id ?? "";
}
