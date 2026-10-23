import { describe, expect, it } from "vitest";
import {
  DEFAULT_NODE_SUBCATEGORY,
  NODE_SUBCATEGORIES,
  NODE_SUBCATEGORY_OPTIONS,
  getSubcategoryLabel,
} from "./nodeSubcategories.js";

describe("node subcategories", () => {
  it("exposes every subcategory as an option", () => {
    expect(NODE_SUBCATEGORY_OPTIONS).toHaveLength(
      Object.keys(NODE_SUBCATEGORIES).length,
    );
    expect(DEFAULT_NODE_SUBCATEGORY).toBe("software");
  });

  it("returns the human readable label", () => {
    expect(getSubcategoryLabel("database-vettoriale")).toBe(
      "Database vettoriale",
    );
  });

  it("falls back to the id and then to an empty string", () => {
    expect(getSubcategoryLabel("custom")).toBe("custom");
    expect(getSubcategoryLabel(undefined)).toBe("");
    expect(getSubcategoryLabel(null)).toBe("");
  });
});
