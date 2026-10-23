import { describe, expect, it } from "vitest";
import {
  buildDisplayEdges,
  buildDisplayNodes,
  buildFocus,
  filterVisibleEdges,
  filterVisibleNodes,
  getIsolatedCategory,
  getRelationKind,
  resolveHandleSides,
} from "./mapGraph.js";

const categories = ["frontend", "backend", "database", "devops", "tools"];

function node(id, category = "frontend", subcategory = "framework", label = id) {
  return {
    id,
    position: { x: 0, y: 0 },
    data: { label, category, subcategory },
  };
}

function edge(id, source, target, kind = "usa") {
  return { id, source, target, data: { kind } };
}

describe("resolveHandleSides", () => {
  it("uses right to left when the source is on the left", () => {
    expect(resolveHandleSides({ x: 0, y: 0 }, { x: 10, y: 0 })).toEqual({
      sourceHandle: "source-right",
      targetHandle: "target-left",
    });
  });

  it("uses left to right when the source is on the right", () => {
    expect(resolveHandleSides({ x: 10, y: 0 }, { x: 0, y: 0 })).toEqual({
      sourceHandle: "source-left",
      targetHandle: "target-right",
    });
  });

  it("falls back to right handles when positions are aligned", () => {
    expect(resolveHandleSides({ x: 0, y: 0 }, { x: 0, y: 10 })).toEqual({
      sourceHandle: "source-right",
      targetHandle: "target-right",
    });
  });

  it("returns no handles without both positions", () => {
    expect(resolveHandleSides(null, { x: 0, y: 0 })).toEqual({});
    expect(resolveHandleSides({ x: 0, y: 0 }, undefined)).toEqual({});
  });
});

describe("getRelationKind", () => {
  it("returns the stored kind or the default", () => {
    expect(getRelationKind({ data: { kind: "richiede" } })).toBe("richiede");
    expect(getRelationKind({})).toBe("usa");
  });
});

describe("getIsolatedCategory", () => {
  it("returns the only visible category", () => {
    expect(
      getIsolatedCategory(
        categories,
        new Set(["frontend", "backend", "database", "devops"]),
        "",
        "",
      ),
    ).toBe("tools");
  });

  it("returns null when another filter is active", () => {
    const hidden = new Set(["frontend", "backend", "database", "devops"]);
    expect(getIsolatedCategory(categories, hidden, "react", "")).toBeNull();
    expect(
      getIsolatedCategory(categories, hidden, "", "framework"),
    ).toBeNull();
  });

  it("returns null when more than one category is visible", () => {
    expect(
      getIsolatedCategory(categories, new Set(["frontend"]), "", ""),
    ).toBeNull();
  });
});

describe("filterVisibleNodes", () => {
  const nodes = [
    node("react", "frontend", "libreria", "React"),
    node("vite", "frontend", "build-tool", "Vite"),
    node("node", "backend", "runtime", "Node.js"),
  ];

  it("returns every node on mobile", () => {
    const result = filterVisibleNodes(nodes, {
      isMobile: true,
      hiddenCategories: new Set(["frontend", "backend"]),
      selectedSubcategory: "framework",
      searchTerm: "missing",
    });
    expect(result).toHaveLength(3);
  });

  it("filters by category, subcategory and search term", () => {
    expect(
      filterVisibleNodes(nodes, {
        isMobile: false,
        hiddenCategories: new Set(["frontend"]),
        selectedSubcategory: "",
        searchTerm: "",
      }).map((item) => item.id),
    ).toEqual(["node"]);

    expect(
      filterVisibleNodes(nodes, {
        isMobile: false,
        hiddenCategories: new Set(),
        selectedSubcategory: "libreria",
        searchTerm: "",
      }).map((item) => item.id),
    ).toEqual(["react"]);

    expect(
      filterVisibleNodes(nodes, {
        isMobile: false,
        hiddenCategories: new Set(),
        selectedSubcategory: "",
        searchTerm: "build tool",
      }).map((item) => item.id),
    ).toEqual(["vite"]);
  });

  it("searches the label case-insensitively", () => {
    const result = filterVisibleNodes(nodes, {
      isMobile: false,
      hiddenCategories: new Set(),
      selectedSubcategory: "",
      searchTerm: "node",
    });
    expect(result.map((item) => item.id)).toEqual(["node"]);
  });
});

describe("filterVisibleEdges", () => {
  it("keeps only edges between visible nodes", () => {
    const nodes = [node("a"), node("b")];
    const edges = [edge("ab", "a", "b"), edge("ac", "a", "c")];
    expect(filterVisibleEdges(edges, nodes).map((item) => item.id)).toEqual([
      "ab",
    ]);
  });
});

describe("buildFocus", () => {
  const nodes = ["a", "b", "c", "d", "e", "f"].map((id) => node(id));
  const edges = [
    edge("a-b", "a", "b", "usa"),
    edge("c-a", "c", "a", "richiede"),
    edge("a-d", "a", "d", "alternativa"),
    edge("a-e", "a", "e", "si_integra"),
    edge("a-f", "a", "f", "sconosciuto"),
    edge("b-d", "b", "d", "usa"),
  ];

  it("returns null without a selected node", () => {
    expect(buildFocus(null, nodes, edges)).toBeNull();
  });

  it("groups neighbors by relation direction and kind", () => {
    const focus = buildFocus("a", nodes, edges);
    expect(focus.prerequisites.map((item) => item.id)).toEqual(["b"]);
    expect(focus.enables.map((item) => item.id)).toEqual(["c"]);
    expect(focus.alternatives.map((item) => item.id)).toEqual(["d"]);
    expect(focus.related.map((item) => item.id)).toEqual(["e"]);
    expect(focus.edgeIds).toEqual(new Set(["a-b", "c-a", "a-d", "a-e"]));
    expect(focus.nodeIds).toEqual(new Set(["a", "b", "c", "d", "e"]));
  });

  it("ignores unknown relation kinds", () => {
    const focus = buildFocus("a", nodes, edges);
    expect(focus.nodeIds.has("f")).toBe(false);
  });

  it("does not duplicate nodes reached by multiple relations", () => {
    const focus = buildFocus("a", nodes, [
      edge("a-b-1", "a", "b", "usa"),
      edge("a-b-2", "b", "a", "usa"),
    ]);
    expect(focus.prerequisites.map((item) => item.id)).toEqual(["b"]);
    expect(focus.enables).toEqual([]);
  });
});

describe("display helpers", () => {
  const nodes = [
    { ...node("a"), position: { x: 0, y: 0 } },
    { ...node("b"), position: { x: 100, y: 0 } },
    { ...node("c"), position: { x: 200, y: 0 } },
  ];
  const edges = [edge("a-b", "a", "b")];
  const focus = buildFocus("a", nodes, edges);

  it("dims nodes outside the focus", () => {
    const display = buildDisplayNodes(nodes, focus);
    expect(display[0].className).toBeUndefined();
    expect(display[1].className).toBeUndefined();
    expect(display[2].className).toBe("is-dimmed");
  });

  it("adds handle sides and dims unrelated edges", () => {
    const display = buildDisplayEdges(nodes, edges, focus);
    expect(display[0]).toMatchObject({
      sourceHandle: "source-right",
      targetHandle: "target-left",
      className: undefined,
    });

    const dimmed = buildDisplayEdges(
      nodes,
      edges,
      { ...focus, edgeIds: new Set() },
    );
    expect(dimmed[0].className).toBe("is-dimmed");
  });
});
