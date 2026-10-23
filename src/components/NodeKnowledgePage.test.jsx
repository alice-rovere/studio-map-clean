import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import NodeKnowledgePage from "./NodeKnowledgePage.jsx";

const node = {
  id: "react",
  data: {
    label: "React",
    category: "frontend",
    subcategory: "libreria",
  },
};

const content = [
  { title: "Introduzione", type: "text", text: "Testo introduttivo." },
  { title: "Elenco", type: "list", items: ["Primo", "Secondo"] },
  {
    title: "Tabella",
    type: "table",
    columns: ["Voce", "Uso"],
    rows: [["HTML", "Struttura"]],
  },
  {
    title: "Tappe",
    type: "timeline",
    entries: [
      { date: "2025", title: "Rilascio", description: "Prima versione." },
    ],
  },
  { title: "Codice", type: "code", code: "const answer = 42;" },
];

function renderPage(overrides = {}) {
  const onSaveContent = overrides.onSaveContent ?? vi.fn().mockResolvedValue(null);
  render(
    <NodeKnowledgePage
      canEdit={overrides.canEdit ?? false}
      content={overrides.content ?? content}
      node={node}
      onBack={overrides.onBack ?? vi.fn()}
      onClose={overrides.onClose ?? vi.fn()}
      onSaveContent={onSaveContent}
    />,
  );
  return { onSaveContent };
}

describe("NodeKnowledgePage", () => {
  it("renders every content block", () => {
    renderPage();

    expect(screen.getByText("Testo introduttivo.")).toBeInTheDocument();
    expect(screen.getByText("Primo")).toBeInTheDocument();
    expect(screen.getByText("HTML")).toBeInTheDocument();
    expect(screen.getByText("Rilascio")).toBeInTheDocument();
    expect(screen.getByText("const answer = 42;")).toBeInTheDocument();
  });

  it("shows an empty state without content", () => {
    renderPage({ content: [] });
    expect(
      screen.getByText(
        "Gli approfondimenti per questo nodo non sono ancora disponibili.",
      ),
    ).toBeInTheDocument();
  });

  it("shows an invalid block message", () => {
    renderPage({ content: [{ title: "Errore", type: "sconosciuto" }] });
    expect(
      screen.getByText("Formato della sezione non riconosciuto."),
    ).toBeInTheDocument();
  });

  it("hides editing from visitors", () => {
    renderPage();
    expect(
      screen.getByText(
        "Accedi con un account autorizzato per modificare questi contenuti.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Inserisci o modifica contenuti/ }),
    ).not.toBeInTheDocument();
  });

  it("saves valid JSON content", async () => {
    const user = userEvent.setup();
    const { onSaveContent } = renderPage({ canEdit: true });

    await user.click(
      screen.getByRole("button", { name: /Inserisci o modifica contenuti/ }),
    );
    fireEvent.change(screen.getByLabelText("Contenuto esteso (JSON)"), {
      target: {
        value: JSON.stringify([
          { title: "Nuovo", type: "text", text: "Contenuto aggiornato." },
        ]),
      },
    });
    await user.click(screen.getByRole("button", { name: /Salva contenuti/ }));

    await waitFor(() => expect(onSaveContent).toHaveBeenCalled());
    expect(onSaveContent.mock.calls[0][0]).toEqual([
      { title: "Nuovo", type: "text", text: "Contenuto aggiornato." },
    ]);
  });

  it("rejects invalid JSON without saving", async () => {
    const user = userEvent.setup();
    const { onSaveContent } = renderPage({ canEdit: true });

    await user.click(
      screen.getByRole("button", { name: /Inserisci o modifica contenuti/ }),
    );
    fireEvent.change(screen.getByLabelText("Contenuto esteso (JSON)"), {
      target: { value: "{ non valido" },
    });
    await user.click(screen.getByRole("button", { name: /Salva contenuti/ }));

    expect(
      screen.getByText(/Il JSON non è valido/),
    ).toBeInTheDocument();
    expect(onSaveContent).not.toHaveBeenCalled();
  });

  it("shows the save error and keeps editing", async () => {
    const user = userEvent.setup();
    renderPage({
      canEdit: true,
      onSaveContent: vi.fn().mockResolvedValue("Errore di salvataggio."),
    });

    await user.click(
      screen.getByRole("button", { name: /Inserisci o modifica contenuti/ }),
    );
    fireEvent.change(screen.getByLabelText("Contenuto esteso (JSON)"), {
      target: {
        value: JSON.stringify([
          { title: "Nuovo", type: "text", text: "Contenuto." },
        ]),
      },
    });
    await user.click(screen.getByRole("button", { name: /Salva contenuti/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Errore di salvataggio.",
    );
    expect(screen.getByLabelText("Contenuto esteso (JSON)")).toBeInTheDocument();
  });

  it("calls back and close handlers", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    const onClose = vi.fn();
    renderPage({ onBack, onClose });

    await user.click(screen.getByRole("button", { name: /Torna ai dettagli/ }));
    await user.click(
      screen.getByRole("button", { name: "Chiudi e torna alla mappa" }),
    );

    expect(onBack).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
