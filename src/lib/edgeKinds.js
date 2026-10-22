import { MarkerType } from "@xyflow/react";

export const EDGE_KINDS = {
  richiede: {
    label: "richiede",
    description: "Il soggetto non funziona senza l'oggetto.",
    color: "#9fb3cc",
    width: 2,
    dasharray: undefined,
    directed: true,
    sentence: (source, target) => `${source} richiede ${target}`,
  },
  usa: {
    label: "usa",
    description: "Il soggetto si basa sull'oggetto.",
    color: "#7ab8ff",
    width: 1.5,
    dasharray: undefined,
    directed: true,
    sentence: (source, target) => `${source} usa ${target}`,
  },
  estende: {
    label: "estende",
    description: "Il soggetto amplia l'oggetto aggiungendo funzionalità.",
    color: "#64d9bd",
    width: 2.5,
    dasharray: undefined,
    directed: true,
    sentence: (source, target) => `${source} estende ${target}`,
  },
  alternativa: {
    label: "alternativa",
    description: "Il soggetto è un'opzione alternativa all'oggetto.",
    color: "#ffbd70",
    width: 1.5,
    dasharray: "7 5",
    directed: false,
    sentence: (source, target) => `${source} è un'alternativa a ${target}`,
  },
  si_integra: {
    label: "si integra",
    description: "Il soggetto collabora con l'oggetto.",
    color: "#c49aff",
    width: 1.8,
    dasharray: undefined,
    directed: false,
    sentence: (source, target) =>
      `${source} si integra con ${target}`,
  },
  strumento: {
    label: "strumento",
    description: "Il soggetto è uno strumento usato con l'oggetto.",
    color: "#ff89a7",
    width: 1.5,
    dasharray: "3 4",
    directed: false,
    sentence: (source, target) =>
      `${source} è uno strumento per ${target}`,
  },
  ospita: {
    label: "ospita",
    description: "Il soggetto esegue o contiene l'oggetto.",
    color: "#f2d16b",
    width: 2,
    dasharray: "10 4",
    directed: true,
    sentence: (source, target) => `${source} ospita ${target}`,
  },
};

export const DEFAULT_EDGE_KIND = "usa";

export function getEdgeKindConfig(kind) {
  return EDGE_KINDS[kind] ?? EDGE_KINDS[DEFAULT_EDGE_KIND];
}

export function createFlowEdge(edge, labels) {
  const kind = EDGE_KINDS[edge.kind] ? edge.kind : DEFAULT_EDGE_KIND;
  const config = EDGE_KINDS[kind];
  const sourceLabel = labels?.get(edge.source) ?? edge.source;
  const targetLabel = labels?.get(edge.target) ?? edge.target;

  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: "relation",
    style: {
      stroke: config.color,
      strokeWidth: config.width,
      strokeDasharray: config.dasharray,
    },
    markerEnd: config.directed
      ? {
          type: MarkerType.ArrowClosed,
          color: config.color,
          width: 18,
          height: 18,
        }
      : undefined,
    data: {
      kind,
      kindLabel: config.label,
      color: config.color,
      sentence: config.sentence(sourceLabel, targetLabel),
    },
  };
}
