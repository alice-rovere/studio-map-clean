import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import NodeDetailsPanel from "./NodeDetailsPanel.jsx";

const node = {
  id: "react",
  data: {
    label: "React",
    category: "frontend",
    subcategory: "libreria",
  },
};

const baseProps = {
  glossary: [],
  node,
  onClose: vi.fn(),
  onOpenKnowledge: vi.fn(),
  onSelectRelated: vi.fn(),
  relations: null,
};

describe("NodeDetailsPanel", () => {
  it("shows fallback content without details", () => {
    render(<NodeDetailsPanel {...baseProps} details={undefined} />);

    expect(
      screen.getByText(/Esplora questa tecnologia/),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Nessun link disponibile per questo nodo."),
    ).toBeInTheDocument();
    expect(screen.getByText("Libreria")).toBeInTheDocument();
  });

  it("shows saved details and links", () => {
    render(
      <NodeDetailsPanel
        {...baseProps}
        details={{
          description: "Libreria per interfacce.",
          best_practices:
            "Componi in componenti piccoli.\nEvita stato duplicato.",
          naming_conventions: ["PascalCase per i componenti"],
          associated_software: ["Vite"],
          study_urls: [{ label: "Documentazione", url: "https://react.dev" }],
        }}
      />,
    );

    expect(screen.getByText("Libreria per interfacce.")).toBeInTheDocument();
    expect(screen.getByText("Componi in componenti piccoli.")).toBeInTheDocument();
    expect(screen.getByText("Evita stato duplicato.")).toBeInTheDocument();
    expect(screen.getByText("PascalCase per i componenti")).toBeInTheDocument();
    expect(screen.getByText("Vite")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Documentazione/ }),
    ).toHaveAttribute("href", "https://react.dev");
  });

  it("renders relation groups and selects a related node", async () => {
    const user = userEvent.setup();
    const onSelectRelated = vi.fn();
    render(
      <NodeDetailsPanel
        {...baseProps}
        details={{}}
        onSelectRelated={onSelectRelated}
        relations={{
          prerequisites: [
            {
              id: "node",
              data: { label: "Node.js", category: "backend" },
            },
          ],
          enables: [],
          alternatives: [],
          related: [],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Prerequisiti" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Node.js" }));
    expect(onSelectRelated).toHaveBeenCalledWith("node");
  });

  it("opens the knowledge page", async () => {
    const user = userEvent.setup();
    const onOpenKnowledge = vi.fn();
    render(
      <NodeDetailsPanel
        {...baseProps}
        details={{}}
        onOpenKnowledge={onOpenKnowledge}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Apri approfondimento/ }));
    expect(onOpenKnowledge).toHaveBeenCalled();
  });

  it("closes from the panel button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <NodeDetailsPanel {...baseProps} details={{}} onClose={onClose} />,
    );

    await user.click(screen.getByRole("button", { name: "Chiudi pannello" }));
    expect(onClose).toHaveBeenCalled();
  });
});
