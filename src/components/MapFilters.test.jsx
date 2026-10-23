import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import MapFilters from "./MapFilters.jsx";

const categories = ["frontend", "backend"];
const subcategories = [
  { id: "framework", label: "Framework" },
  { id: "runtime", label: "Runtime" },
];

function renderFilters(overrides = {}) {
  const handlers = {
    onReset: vi.fn(),
    onSearchChange: vi.fn(),
    onSubcategoryChange: vi.fn(),
    onToggleCategory: vi.fn(),
  };
  render(
    <MapFilters
      categories={categories}
      hiddenCategories={overrides.hiddenCategories ?? new Set()}
      onReset={handlers.onReset}
      onSearchChange={handlers.onSearchChange}
      onSubcategoryChange={handlers.onSubcategoryChange}
      onToggleCategory={handlers.onToggleCategory}
      searchTerm={overrides.searchTerm ?? ""}
      selectedSubcategory={overrides.selectedSubcategory ?? ""}
      subcategories={subcategories}
    />,
  );
  return handlers;
}

describe("MapFilters", () => {
  it("toggles category visibility", async () => {
    const user = userEvent.setup();
    const { onToggleCategory } = renderFilters();

    const backend = screen.getByRole("button", { name: "backend" });
    expect(backend).toHaveAttribute("aria-pressed", "true");

    await user.click(backend);
    expect(onToggleCategory).toHaveBeenCalledWith("backend");
  });

  it("updates the search term", async () => {
    const user = userEvent.setup();
    const { onSearchChange } = renderFilters();

    await user.type(screen.getByLabelText("Cerca un nodo"), "react");
    expect(onSearchChange).toHaveBeenCalled();
  });

  it("updates the subcategory", async () => {
    const user = userEvent.setup();
    const { onSubcategoryChange } = renderFilters();

    await user.selectOptions(
      screen.getByLabelText("Filtra per sottocategoria"),
      "runtime",
    );
    expect(onSubcategoryChange).toHaveBeenCalledWith("runtime");
  });

  it("shows the reset action only with active filters", () => {
    const { unmount } = render(
      <MapFilters
        categories={categories}
        hiddenCategories={new Set()}
        onReset={vi.fn()}
        onSearchChange={vi.fn()}
        onSubcategoryChange={vi.fn()}
        onToggleCategory={vi.fn()}
        searchTerm=""
        selectedSubcategory=""
        subcategories={subcategories}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Azzera filtri" }),
    ).not.toBeInTheDocument();
    unmount();

    renderFilters({ searchTerm: "react" });
    expect(
      screen.getByRole("button", { name: "Azzera filtri" }),
    ).toBeInTheDocument();
  });

  it("resets the filters", async () => {
    const user = userEvent.setup();
    const { onReset } = renderFilters({ hiddenCategories: new Set(["frontend"]) });

    await user.click(screen.getByRole("button", { name: "Azzera filtri" }));
    expect(onReset).toHaveBeenCalled();
  });
});
