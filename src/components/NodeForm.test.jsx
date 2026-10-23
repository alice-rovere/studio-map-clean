import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import NodeForm from "./NodeForm.jsx";
import { NODE_SUBCATEGORY_OPTIONS } from "../lib/nodeSubcategories.js";

const categories = ["frontend", "backend"];

function renderForm(overrides = {}) {
  const onAddNode = overrides.onAddNode ?? vi.fn().mockResolvedValue(null);
  const onClose = overrides.onClose ?? vi.fn();
  render(
    <NodeForm
      categories={categories}
      onAddNode={onAddNode}
      onClose={onClose}
      subcategories={NODE_SUBCATEGORY_OPTIONS}
    />,
  );
  return { onAddNode, onClose };
}

describe("NodeForm", () => {
  it("requires a node name", async () => {
    const user = userEvent.setup();
    const { onAddNode } = renderForm();

    await user.click(screen.getByRole("button", { name: "Aggiungi nodo" }));

    expect(screen.getByText("Inserisci il nome del nodo.")).toBeInTheDocument();
    expect(onAddNode).not.toHaveBeenCalled();
  });

  it("requires a subcategory", async () => {
    const user = userEvent.setup();
    const { onAddNode } = renderForm();

    await user.type(screen.getByLabelText("Nome del nodo"), "Vite");
    await user.click(screen.getByRole("button", { name: "Aggiungi nodo" }));

    expect(
      screen.getByText("Seleziona la sottocategoria del nodo."),
    ).toBeInTheDocument();
    expect(onAddNode).not.toHaveBeenCalled();
  });

  it("submits trimmed data and closes on success", async () => {
    const user = userEvent.setup();
    const { onAddNode, onClose } = renderForm();

    await user.type(screen.getByLabelText("Nome del nodo"), "  Vite  ");
    await user.selectOptions(screen.getByLabelText("Sottocategoria"), "build-tool");
    await user.selectOptions(screen.getByLabelText("Categoria"), "backend");
    await user.click(screen.getByRole("button", { name: "Aggiungi nodo" }));

    expect(onAddNode).toHaveBeenCalledWith({
      label: "Vite",
      category: "backend",
      subcategory: "build-tool",
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("keeps the form open and shows the error", async () => {
    const user = userEvent.setup();
    const { onAddNode, onClose } = renderForm({
      onAddNode: vi.fn().mockResolvedValue("Impossibile salvare il nodo."),
    });

    await user.type(screen.getByLabelText("Nome del nodo"), "Vite");
    await user.selectOptions(screen.getByLabelText("Sottocategoria"), "build-tool");
    await user.click(screen.getByRole("button", { name: "Aggiungi nodo" }));

    expect(onAddNode).toHaveBeenCalled();
    expect(
      screen.getByText("Impossibile salvare il nodo."),
    ).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes from the cancel button", async () => {
    const user = userEvent.setup();
    const { onClose } = renderForm();

    await user.click(screen.getByRole("button", { name: "Annulla" }));
    expect(onClose).toHaveBeenCalled();
  });
});
