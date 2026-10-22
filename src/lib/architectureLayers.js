import { getSubcategoryLabel } from "./nodeSubcategories.js";

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

const TOOL_SHAPES = [
  "octahedron",
  "box",
  "tetrahedron",
  "torusKnot",
  "dodecahedron",
  "icosahedron",
];

function buildToolPosition(index, total) {
  const side = index % 2;
  const rank = Math.floor(index / 2);
  const perSide = Math.ceil(total / 2);
  const step = perSide > 1 ? 5.5 / (perSide - 1) : 0;
  const y = perSide > 1 ? 2.75 - step * rank : 0;

  return [side === 0 ? 3.35 : -3.35, y, side === 0 ? 0.5 : -0.5];
}

function buildDevOpsPosition(index, total) {
  const side = index % 2;
  const rank = Math.floor(index / 2);
  const perSide = Math.ceil(total / 2);
  const step = perSide > 1 ? 4.6 / (perSide - 1) : 0;
  const y = perSide > 1 ? 2.3 - step * rank : 0;

  return [side === 0 ? 2.85 : -2.85, y, 1.84];
}

function buildNodeTagline(prefix, subcategory) {
  const label = getSubcategoryLabel(subcategory);
  return label ? `${prefix} \u00b7 ${label}` : prefix;
}

function buildNodeDescription(details, category) {
  const description = details?.description?.trim();
  if (description) return description;

  return category === "tools"
    ? "Strumento di supporto della mappa, usato nel lavoro quotidiano dello studio."
    : "Nodo DevOps della mappa: infrastruttura, automazione o processo di distribuzione.";
}

function getArchitectureNodes(nodes, categoryId) {
  return [...nodes]
    .filter((node) => node.data?.category?.toLowerCase() === categoryId)
    .sort((first, second) =>
      (first.data?.label ?? "").localeCompare(
        second.data?.label ?? "",
        "it",
      ),
    );
}

export function buildArchitectureToolItems(nodes = [], detailsByNode = {}) {
  const category = getArchitectureCategory("tools");
  if (!category) return [];

  const toolNodes = getArchitectureNodes(nodes, category.id);

  return toolNodes.map((node, index) => ({
    id: node.id,
    nodeId: node.id,
    label: node.data.label,
    category: category.id,
    accent: category.accent,
    tagline: buildNodeTagline("Tool", node.data.subcategory),
    description: buildNodeDescription(detailsByNode[node.id], category.id),
    shape: TOOL_SHAPES[index % TOOL_SHAPES.length],
    position: buildToolPosition(index, toolNodes.length),
  }));
}

export function buildArchitectureDevOpsItems(nodes = [], detailsByNode = {}) {
  const category = getArchitectureCategory("devops");
  if (!category) return [];

  const devopsNodes = getArchitectureNodes(nodes, category.id);

  return devopsNodes.map((node, index) => ({
    id: node.id,
    nodeId: node.id,
    label: node.data.label,
    category: category.id,
    accent: category.accent,
    tagline: buildNodeTagline("DevOps", node.data.subcategory),
    description: buildNodeDescription(detailsByNode[node.id], category.id),
    position: buildDevOpsPosition(index, devopsNodes.length),
  }));
}

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
