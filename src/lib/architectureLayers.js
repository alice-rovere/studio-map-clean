export const ARCHITECTURE_CATEGORIES = [
  {
    id: "frontend",
    label: "Frontend",
    tagline: "Interfaccia vetro / neon",
    accent: "#7ab8ff",
    description:
      "Lo strato visibile del sistema: pagine, componenti e interazioni che traducono i dati in un'esperienza utilizzabile.",
  },
  {
    id: "backend",
    label: "Backend",
    tagline: "Motore logico",
    accent: "#c49aff",
    description:
      "Il blocco che elabora le richieste, applica le regole del dominio e coordina dati, servizi e integrazioni.",
  },
  {
    id: "database",
    label: "Database",
    tagline: "Matrice di stoccaggio",
    accent: "#64d9bd",
    description:
      "La matrice persistente del sistema: organizza, protegge e rende interrogabili le informazioni del prodotto.",
  },
  {
    id: "devops",
    label: "DevOps",
    tagline: "Guscio e binari",
    accent: "#ffbd70",
    description:
      "Il guscio esterno che avvolge i tre livelli: pipeline, container, ambienti e automazioni che portano il software in produzione.",
  },
  {
    id: "tools",
    label: "Tools",
    tagline: "Satelliti di supporto",
    accent: "#ff89a7",
    description:
      "Strumenti geometrici che fluttuano lungo i flussi di lavoro: editor, versionamento, dipendenze e automazione quotidiana.",
  },
];

export const ARCHITECTURE_LAYERS = ARCHITECTURE_CATEGORIES.filter((item) =>
  ["frontend", "backend", "database"].includes(item.id),
);

export const ARCHITECTURE_TOOLS = [
  {
    id: "git",
    label: "Git",
    description:
      "Controllo versione distribuito per tracciare l'evoluzione del codice.",
    shape: "octahedron",
    position: [3.35, 2.65, 0.45],
  },
  {
    id: "docker",
    label: "Docker",
    description:
      "Container riproducibili per eseguire servizi e ambienti di sviluppo.",
    shape: "box",
    position: [-3.4, 1.5, -0.55],
  },
  {
    id: "vite",
    label: "Vite",
    description:
      "Build tool e dev server rapido per il frontend moderno.",
    shape: "tetrahedron",
    position: [3.4, 0.05, -0.5],
  },
  {
    id: "pnpm",
    label: "pnpm",
    description:
      "Package manager efficiente per installare e gestire le dipendenze.",
    shape: "torusKnot",
    position: [-3.35, -0.85, 0.5],
  },
  {
    id: "vscode",
    label: "VS Code",
    description:
      "Editor di codice con estensioni per scrittura, debug e revisione.",
    shape: "dodecahedron",
    position: [3.3, -1.95, 0.55],
  },
  {
    id: "actions",
    label: "GitHub Actions",
    description:
      "Automazione CI/CD per test, build e distribuzione dei progetti.",
    shape: "icosahedron",
    position: [-3.35, -2.6, -0.45],
  },
];

export const ARCHITECTURE_FLOWS = [
  {
    id: "api",
    label: "Richieste / API",
    color: "#7ab8ff",
    x: -1.05,
    z: 0.45,
    from: 1.95,
    to: 0.22,
    speed: 0.22,
    labelOffset: [-1.05, 0.7],
  },
  {
    id: "query",
    label: "Query SQL / NoSQL",
    color: "#64d9bd",
    x: 1.05,
    z: -0.45,
    from: -0.22,
    to: -1.95,
    speed: 0.18,
    labelOffset: [1.05, -0.4],
  },
];

export function getArchitectureCategory(id) {
  return ARCHITECTURE_CATEGORIES.find((item) => item.id === id) ?? null;
}
