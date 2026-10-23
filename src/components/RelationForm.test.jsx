import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import RelationForm from "./RelationForm.jsx";

function renderForm(overrides = {}) {
  const onConfirm = overrides.onConfirm ?? vi.fn();
  const onClose = overrides.onClose ?? vi.fn();
  render(
    <RelationForm
      error={overrides.error}
      isSubmitting={overrides.isSubmitting}
      mode={overrides.mode}
      onClose={onClose}
      onConfirm={onConfirm}
      sourceLabel="React"
      targetLabel="Node.js"
    />,
  );
  return { onConfirm, onClose };
}

describe("RelationForm", () => {
  it("creates the default relation", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderForm();

    expect(screen.getByText("React usa Node.js")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Crea relazione" }));

    expect(onConfirm).toHaveBeenCalledWith({
      kind: "usa",
      isReversed: false,
    });
  });

  it("changes relation kind and direction", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderForm();

    await user.click(screen.getByRole("radio", { name: /richiede/ }));
    await user.click(
      screen.getByRole("button", { name: "Inverti direzione della relazione" }),
    );

    expect(screen.getByText("Node.js richiede React")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Crea relazione" }));

    expect(onConfirm).toHaveBeenCalledWith({
      kind: "richiede",
      isReversed: true,
    });
  });

  it("uses edit labels in edit mode", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderForm({ mode: "edit" });

    expect(
      screen.getByRole("heading", { name: "Modifica relazione" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Salva relazione" }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("shows an error and disables the submit while saving", () => {
    renderForm({ error: "Impossibile salvare la relazione.", isSubmitting: true });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Impossibile salvare la relazione.",
    );
    expect(screen.getByRole("button", { name: "Salvataggio…" })).toBeDisabled();
  });

  it("closes from the close button", async () => {
    const user = userEvent.setup();
    const { onClose } = renderForm();

    await user.click(
      screen.getByRole("button", { name: "Chiudi form relazione" }),
    );
    expect(onClose).toHaveBeenCalled();
  });
});
