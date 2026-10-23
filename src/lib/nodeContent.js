export function validateContent(content) {
  if (!Array.isArray(content)) {
    return "Il contenuto deve essere un array JSON di sezioni.";
  }

  for (const [index, block] of content.entries()) {
    const section = index + 1;
    if (!block || typeof block !== "object" || Array.isArray(block)) {
      return `La sezione ${section} deve essere un oggetto.`;
    }
    if (typeof block.title !== "string" || !block.title.trim()) {
      return `Inserisci un titolo per la sezione ${section}.`;
    }

    if (block.type === "text" && typeof block.text === "string") continue;
    if (
      block.type === "list" &&
      Array.isArray(block.items) &&
      block.items.every((item) => typeof item === "string")
    ) continue;
    if (
      block.type === "table" &&
      Array.isArray(block.columns) &&
      block.columns.every((column) => typeof column === "string") &&
      Array.isArray(block.rows) &&
      block.rows.every(
        (row) =>
          Array.isArray(row) &&
          row.length === block.columns.length &&
          row.every((cell) => typeof cell === "string"),
      )
    ) continue;
    if (
      block.type === "timeline" &&
      Array.isArray(block.entries) &&
      block.entries.every(
        (entry) =>
          entry &&
          typeof entry.date === "string" &&
          typeof entry.title === "string" &&
          typeof entry.description === "string",
      )
    ) continue;
    if (block.type === "code" && typeof block.code === "string") continue;

    return `La sezione ${section} non rispetta il formato previsto per "${block.type || "tipo mancante"}".`;
  }

  return "";
}
