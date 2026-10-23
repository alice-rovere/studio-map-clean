import { vi } from "vitest";

export const reactFlowPropsRef = { current: null };

export const flowApi = {
  fitView: vi.fn(),
  screenToFlowPosition: vi.fn((position) => position),
  getZoom: vi.fn(() => 1),
  setCenter: vi.fn(),
};

export const MarkerType = {
  ArrowClosed: "arrowclosed",
};

export function ReactFlow(props) {
  reactFlowPropsRef.current = props;
  return <div data-testid="react-flow">{props.children}</div>;
}

export function Panel({ children, className, role, "aria-label": ariaLabel }) {
  return (
    <div aria-label={ariaLabel} className={className} role={role}>
      {children}
    </div>
  );
}

export function Controls() {
  return null;
}

export function MiniMap() {
  return null;
}

export function Background() {
  return null;
}

export function Handle() {
  return null;
}

export function BaseEdge() {
  return null;
}

export function EdgeLabelRenderer({ children }) {
  return <>{children}</>;
}

export function useReactFlow() {
  return flowApi;
}

export const Position = {
  Left: "left",
  Right: "right",
  Top: "top",
  Bottom: "bottom",
};

export function getSmoothStepPath() {
  return ["M0,0", 0, 0];
}

export function applyNodeChanges(changes, nodes) {
  let next = [...nodes];
  changes.forEach((change) => {
    if (change.type === "remove") {
      next = next.filter((node) => node.id !== change.id);
      return;
    }
    if (change.type === "position" && change.position) {
      next = next.map((node) =>
        node.id === change.id ? { ...node, position: change.position } : node,
      );
      return;
    }
    if (change.type === "dimensions" && change.dimensions) {
      next = next.map((node) =>
        node.id === change.id
          ? { ...node, measured: change.dimensions }
          : node,
      );
      return;
    }
    if (change.type === "select") {
      next = next.map((node) =>
        node.id === change.id ? { ...node, selected: change.selected } : node,
      );
    }
  });
  return next;
}

export function applyEdgeChanges(changes, edges) {
  let next = [...edges];
  changes.forEach((change) => {
    if (change.type === "remove") {
      next = next.filter((edge) => edge.id !== change.id);
    }
  });
  return next;
}

export function addEdge(edge, edges) {
  return [...edges, edge];
}
