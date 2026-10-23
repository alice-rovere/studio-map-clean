import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import GlossaryForm from "./GlossaryForm.jsx";

describe("GlossaryForm", () => {
  it("requires both term and definition", async () => {
    const user = userEvent.setup();
    const onAddTerm = vi.fn();
    render(<GlossaryForm onAddTerm={onAddTerm} onClose={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Aggiungi termine" }));

    expect(
      screen.getByText("Inserisci sia il termine sia la definizione."),
    ).toBeInTheDocument();
    expect(onAddTerm).not.toHaveBeenCalled();
  });

  it("submits trimmed data and closes on success", async () => {
    const user = userEvent.setup();
    const onAddTerm = vi.fn().mockResolvedValue(null);
    const onClose = vi.fn();
    render(<GlossaryForm onAddTerm={onAddTerm} onClose={onClose} />);

    await user.type(screen.getByLabelText("Nome del termine"), "  CDN ");
    await user.type(
      screen.getByLabelText("Definizione"),
      "  Rete di distribuzione dei contenuti. ",
    );
    await user.click(screen.getByRole("button", { name: "Aggiungi termine" }));

    expect(onAddTerm).toHaveBeenCalledWith({
      term: "CDN",
      definition: "Rete di distribuzione dei contenuti.",
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("shows duplicates returned by the handler", async () => {
    const user = userEvent.setup();
    const onAddTerm = vi
      .fn()
      .mockResolvedValue("Questo termine è già presente nel glossario.");
    const onClose = vi.fn();
    render(<GlossaryForm onAddTerm={onAddTerm} onClose={onClose} />);

    await user.type(screen.getByLabelText("Nome del termine"), "API");
    await user.type(screen.getByLabelText("Definizione"), "Interfaccia.");
    await user.click(screen.getByRole("button", { name: "Aggiungi termine" }));

    expect(
      screen.getByText("Questo termine è già presente nel glossario."),
    ).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows an external error when provided", () => {
    render(
      <GlossaryForm
        error="Errore esterno"
        onAddTerm={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("Errore esterno")).toBeInTheDocument();
  });

  it("closes from the header button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<GlossaryForm onAddTerm={vi.fn()} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Chiudi form" }));
    expect(onClose).toHaveBeenCalled();
  });
});
