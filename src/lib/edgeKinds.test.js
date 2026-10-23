import { describe, expect, it } from "vitest";
import {
  DEFAULT_EDGE_KIND,
  EDGE_KINDS,
  EDGE_KIND_OPTIONS,
  createFlowEdge,
  getEdgeKindConfig,
  getEdgeSentence,
} from "./edgeKinds.js";

describe("edge kinds", () => {
  it("exposes every configured kind as an option", () => {
    expect(EDGE_KIND_OPTIONS).toHaveLength(Object.keys(EDGE_KINDS).length);
    expect(EDGE_KIND_OPTIONS[0]).toMatchObject({ id: "richiede" });
  });

  it("falls back to the default kind", () => {
    expect(getEdgeKindConfig("sconosciuto")).toBe(
      EDGE_KINDS[DEFAULT_EDGE_KIND],
    );
  });

  it("builds readable sentences", () => {
    expect(getEdgeSentence("richiede", "React", "Node.js")).toBe(
      "React richiede Node.js",
    );
    expect(getEdgeSentence("sconosciuto", "A", "B")).toBe("A usa B");
  });
});

describe("createFlowEdge", () => {
  const labels = new Map([
    ["a", "React"],
    ["b", "Node.js"],
  ]);

  it("maps labels, styles and relation data", () => {
    const result = createFlowEdge(
      { id: "e1", source: "a", target: "b", kind: "usa" },
      labels,
    );

    expect(result).toMatchObject({
      id: "e1",
      source: "a",
      target: "b",
      type: "relation",
      data: {
        kind: "usa",
        kindLabel: "usa",
        sentence: "React usa Node.js",
      },
    });
    expect(result.style).toMatchObject({
      stroke: EDGE_KINDS.usa.color,
      strokeWidth: EDGE_KINDS.usa.width,
    });
    expect(result.markerEnd).toBeDefined();
  });

  it("omits the marker for undirected relations", () => {
    const result = createFlowEdge(
      { id: "e2", source: "a", target: "b", kind: "alternativa" },
      labels,
    );
    expect(result.markerEnd).toBeUndefined();
    expect(result.data.sentence).toBe("React è un'alternativa a Node.js");
  });

  it("falls back to the default kind and node ids", () => {
    const result = createFlowEdge(
      { id: "e3", source: "x", target: "y", kind: "sconosciuto" },
      undefined,
    );
    expect(result.data.kind).toBe(DEFAULT_EDGE_KIND);
    expect(result.data.sentence).toBe("x usa y");
  });
});
