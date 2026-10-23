import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GlossaryText from "./GlossaryText.jsx";

const glossary = [
  {
    id: "api",
    term: "API",
    definition: "Interfaccia per far comunicare due sistemi.",
  },
  {
    id: "react-flow",
    term: "React Flow",
    definition: "Libreria per costruire mappe a nodi.",
  },
  {
    id: "react",
    term: "React",
    definition: "Libreria per interfacce.",
  },
  {
    id: "cpp",
    term: "C++",
    definition: "Linguaggio compilato.",
  },
];

describe("GlossaryText", () => {
  it("returns plain text without glossary entries", () => {
    const { container } = render(<GlossaryText>Testo semplice</GlossaryText>);
    expect(container).toHaveTextContent("Testo semplice");
  });

  it("marks glossary terms inside the text", () => {
    render(<GlossaryText glossary={glossary}>Usa l'API con React.</GlossaryText>);
    expect(
      screen.getByLabelText(
        "API: Interfaccia per far comunicare due sistemi.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("React: Libreria per interfacce.")).toBeInTheDocument();
  });

  it("matches the longest term first", () => {
    render(
      <GlossaryText glossary={glossary}>
        React Flow semplifica la mappa.
      </GlossaryText>,
    );
    expect(
      screen.getByLabelText(
        "React Flow: Libreria per costruire mappe a nodi.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("React: Libreria per interfacce."),
    ).not.toBeInTheDocument();
  });

  it("does not match terms inside other words", () => {
    const { container } = render(
      <GlossaryText glossary={glossary}>CAPITAL</GlossaryText>,
    );
    expect(container).toHaveTextContent("CAPITAL");
    expect(container.querySelector(".glossary-term")).toBeNull();
  });

  it("escapes regular expression characters in terms", () => {
    render(<GlossaryText glossary={glossary}>Il C++ è compilato.</GlossaryText>);
    expect(
      screen.getByLabelText("C++: Linguaggio compilato."),
    ).toBeInTheDocument();
  });
});
