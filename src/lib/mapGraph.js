import { getSubcategoryLabel } from "./nodeSubcategories.js";

const dependencyRelationKinds = new Set(["richiede", "usa", "estende"]);
const relatedRelationKinds = new Set(["si_integra", "strumento", "ospita"]);

export function getRelationKind(edge) {
  return edge.data?.kind ?? "usa";
}

export function resolveHandleSides(sourcePosition, targetPosition) {
  if (!sourcePosition || !targetPosition) return {};
  if (sourcePosition.x < targetPosition.x) {
    return { sourceHandle: "source-right", targetHandle: "target-left" };
  }
  if (sourcePosition.x > targetPosition.x) {
    return { sourceHandle: "source-left", targetHandle: "target-right" };
  }
  return { sourceHandle: "source-right", targetHandle: "target-right" };
}

export function getIsolatedCategory(
  categories,
  hiddenCategories,
  searchTerm,
  selectedSubcategory,
) {
  if (searchTerm.trim() || selectedSubcategory) return null;
  if (hiddenCategories.size !== categories.length - 1) return null;

  const visibleCategories = categories.filter(
    (category) => !hiddenCategories.has(category),
  );
  return visibleCategories.length === 1 ? visibleCategories[0] : null;
}

export function filterVisibleNodes(
  nodes,
  { isMobile, hiddenCategories, selectedSubcategory, searchTerm },
) {
  if (isMobile) return nodes;

  const query = searchTerm.trim().toLocaleLowerCase();
  return nodes.filter((node) => {
    const category = node.data.category?.toLowerCase();
    if (hiddenCategories.has(category)) return false;
    if (
      selectedSubcategory &&
      node.data.subcategory !== selectedSubcategory
    ) {
      return false;
    }
    if (query) {
      const searchable = `${node.data.label} ${getSubcategoryLabel(
        node.data.subcategory,
      )}`.toLocaleLowerCase();
      if (!searchable.includes(query)) return false;
    }
    return true;
  });
}

export function filterVisibleEdges(edges, visibleNodes) {
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  return edges.filter(
    (edge) =>
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
  );
}

export function buildFocus(selectedNodeId, visibleNodes, visibleEdges) {
  if (!selectedNodeId) return null;

  const nodesById = new Map(visibleNodes.map((node) => [node.id, node]));
  const prerequisites = [];
  const enables = [];
  const alternatives = [];
  const related = [];
  const assigned = new Set([selectedNodeId]);
  const edgeIds = new Set();

  function collect(list, id) {
    if (assigned.has(id)) return;
    const node = nodesById.get(id);
    if (!node) return;
    assigned.add(id);
    list.push(node);
  }

  visibleEdges.forEach((edge) => {
    const isSource = edge.source === selectedNodeId;
    const isTarget = edge.target === selectedNodeId;
    if (!isSource && !isTarget) return;

    const kind = getRelationKind(edge);
    const neighborId = isSource ? edge.target : edge.source;

    if (dependencyRelationKinds.has(kind)) {
      collect(isSource ? prerequisites : enables, neighborId);
    } else if (kind === "alternativa") {
      collect(alternatives, neighborId);
    } else if (relatedRelationKinds.has(kind)) {
      collect(related, neighborId);
    } else {
      return;
    }
    edgeIds.add(edge.id);
  });

  return {
    prerequisites,
    enables,
    alternatives,
    related,
    nodeIds: assigned,
    edgeIds,
  };
}

export function buildDisplayNodes(visibleNodes, focus) {
  if (!focus) return visibleNodes;
  return visibleNodes.map((node) =>
    focus.nodeIds.has(node.id)
      ? node
      : { ...node, className: "is-dimmed" },
  );
}

export function buildDisplayEdges(visibleNodes, visibleEdges, focus) {
  const positions = new Map(
    visibleNodes.map((node) => [node.id, node.position]),
  );
  return visibleEdges.map((edge) => {
    const handles = resolveHandleSides(
      positions.get(edge.source),
      positions.get(edge.target),
    );
    const isDimmed = focus && !focus.edgeIds.has(edge.id);
    return {
      ...edge,
      ...handles,
      className: isDimmed ? "is-dimmed" : undefined,
    };
  });
}
