import { describe, expect, it } from "vitest";
import { validateContent } from "./nodeContent.js";

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

describe("validateContent", () => {
  it("accepts every supported block", () => {
    expect(validateContent(content)).toBe("");
  });

  it("rejects content that is not an array", () => {
    expect(validateContent({})).toBe(
      "Il contenuto deve essere un array JSON di sezioni.",
    );
  });

  it("rejects non-object sections", () => {
    expect(validateContent([null])).toBe(
      "La sezione 1 deve essere un oggetto.",
    );
  });

  it("requires a title", () => {
    expect(validateContent([{ type: "text", text: "Senza titolo" }])).toBe(
      "Inserisci un titolo per la sezione 1.",
    );
    expect(
      validateContent([{ title: "   ", type: "text", text: "Senza titolo" }]),
    ).toBe("Inserisci un titolo per la sezione 1.");
  });

  it("rejects malformed blocks", () => {
    expect(
      validateContent([{ title: "Intestazione", type: "list", items: [1] }]),
    ).toContain("non rispetta il formato previsto");
    expect(
      validateContent([{ title: "Sconosciuto", type: "video" }]),
    ).toContain('"video"');
  });

  it("rejects table rows with the wrong number of cells", () => {
    expect(
      validateContent([
        {
          title: "Tabella",
          type: "table",
          columns: ["A", "B"],
          rows: [["solo una"]],
        },
      ]),
    ).toContain("non rispetta il formato previsto");
  });
});
