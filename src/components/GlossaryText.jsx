import { glossario } from "../data/glossario.js";

const glossaryByTerm = new Map(
  glossario.map((entry) => [entry.term.toLowerCase(), entry]),
);
const glossaryPattern = glossario
  .map(({ term }) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .sort((a, b) => b.length - a.length)
  .join("|");

export default function GlossaryText({ children }) {
  const text = String(children);
  const matches = text.matchAll(
    new RegExp(`(?<![\\p{L}\\p{N}_])(${glossaryPattern})(?![\\p{L}\\p{N}_])`, "giu"),
  );
  const parts = [];
  let cursor = 0;

  for (const [index, match] of Array.from(matches).entries()) {
    const start = match.index;
    const term = glossaryByTerm.get(match[0].toLowerCase());
    if (!term) continue;

    parts.push(text.slice(cursor, start));
    parts.push(
      <span
        aria-label={`${term.term}: ${term.definition}`}
        className="glossary-term"
        key={`${start}-${index}`}
        tabIndex={0}
      >
        {match[0]}
        <span className="glossary-term__tooltip" role="tooltip">
          {term.definition}
        </span>
      </span>,
    );
    cursor = start + match[0].length;
  }

  if (parts.length === 0) return text;
  parts.push(text.slice(cursor));
  return parts;
}
