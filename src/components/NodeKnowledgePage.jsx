import { useState } from "react";
import { ArrowLeft, Pencil, Save, X } from "lucide-react";
import { getSubcategoryLabel } from "../lib/nodeSubcategories.js";
import { validateContent } from "../lib/nodeContent.js";

function ContentBlock({ block }) {
  if (!block || typeof block !== "object") {
    return <p className="node-knowledge__invalid">Sezione non disponibile.</p>;
  }

  if (block.type === "text" && typeof block.text === "string") {
    return <p className="node-knowledge__text">{block.text}</p>;
  }

  if (block.type === "list" && Array.isArray(block.items)) {
    return (
      <ul className="node-knowledge__list">
        {block.items.map((item, index) => (
          <li key={`${index}-${item}`}>{item}</li>
        ))}
      </ul>
    );
  }

  if (
    block.type === "table" &&
    Array.isArray(block.columns) &&
    Array.isArray(block.rows)
  ) {
    return (
      <div className="node-knowledge__table-wrap">
        <table className="node-knowledge__table">
          <thead>
            <tr>
              {block.columns.map((column) => <th key={column}>{column}</th>)}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === "timeline" && Array.isArray(block.entries)) {
    return (
      <ol className="node-knowledge__timeline">
        {block.entries.map((entry) => (
          <li key={`${entry.date}-${entry.title}`}>
            <span className="node-knowledge__timeline-date">{entry.date}</span>
            <h4>{entry.title}</h4>
            <p>{entry.description}</p>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "code" && typeof block.code === "string") {
    return (
      <pre className="node-knowledge__code">
        <code>{block.code}</code>
      </pre>
    );
  }

  return <p className="node-knowledge__invalid">Formato della sezione non riconosciuto.</p>;
}

export default function NodeKnowledgePage({
  node,
  content,
  canEdit,
  onBack,
  onClose,
  onSaveContent,
}) {
  const sections = Array.isArray(content) ? content : [];
  const category = node.data.category?.toLowerCase() || "tools";
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function startEditing() {
    setDraft(JSON.stringify(sections, null, 2));
    setError("");
    setIsEditing(true);
  }

  async function handleSave(event) {
    event.preventDefault();

    let parsedContent;
    try {
      parsedContent = JSON.parse(draft);
    } catch {
      setError("Il JSON non è valido. Controlla parentesi, virgole e virgolette.");
      return;
    }

    const validationError = validateContent(parsedContent);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    try {
      const saveError = await onSaveContent(parsedContent);
      if (saveError) {
        setError(saveError);
        return;
      }
      setIsEditing(false);
      setError("");
    } catch (saveError) {
      console.error("Impossibile salvare i contenuti estesi.", saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Errore imprevisto durante il salvataggio.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section
      aria-labelledby="node-knowledge-title"
      className={`node-knowledge studio-node--${category}`}
    >
      <header className="node-knowledge__header">
        <button
          className="node-knowledge__back"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Torna ai dettagli
        </button>
        <button
          aria-label="Chiudi e torna alla mappa"
          className="node-details__close"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={18} />
        </button>
      </header>

      <div className="node-knowledge__body">
        <div className="node-details__meta">
          <span className="node-details__category">{node.data.category}</span>
          {node.data.subcategory && (
            <span className="node-details__subcategory">
              {getSubcategoryLabel(node.data.subcategory)}
            </span>
          )}
        </div>
        <h2 id="node-knowledge-title">{node.data.label}</h2>
        {isEditing && canEdit ? (
          <form className="node-knowledge__editor" onSubmit={handleSave}>
            <label htmlFor="node-knowledge-json">Contenuto esteso (JSON)</label>
            <p>
              Usa blocchi con tipo <code>text</code>, <code>list</code>,{" "}
              <code>table</code>, <code>timeline</code> o <code>code</code>.
              Ogni sezione deve avere un titolo.
            </p>
            <details className="node-knowledge__editor-example">
              <summary>Mostra un esempio di struttura</summary>
              <pre>
                <code>{`[
  { "title": "Introduzione", "type": "text", "text": "Descrizione..." },
  { "title": "Concetti chiave", "type": "list", "items": ["Primo", "Secondo"] },
  { "title": "Riferimenti", "type": "table", "columns": ["Voce", "Uso"], "rows": [["HTML", "Struttura"]] },
  { "title": "Tappe", "type": "timeline", "entries": [{ "date": "2025", "title": "Titolo", "description": "Descrizione..." }] },
  { "title": "Esempio", "type": "code", "code": "const answer = 42;" }
]`}</code>
              </pre>
            </details>
            <textarea
              autoFocus
              disabled={isSaving}
              id="node-knowledge-json"
              onChange={(event) => setDraft(event.target.value)}
              spellCheck="false"
              value={draft}
            />
            {error && (
              <p aria-live="polite" className="node-knowledge__editor-error" role="alert">
                {error}
              </p>
            )}
            <div className="node-knowledge__editor-actions">
              <button
                className="node-knowledge__editor-cancel"
                disabled={isSaving}
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                }}
                type="button"
              >
                Annulla
              </button>
              <button className="node-knowledge__editor-save" disabled={isSaving} type="submit">
                <Save aria-hidden="true" size={15} />
                {isSaving ? "Salvataggio…" : "Salva contenuti"}
              </button>
            </div>
          </form>
        ) : canEdit ? (
          <button
            className="node-knowledge__edit"
            onClick={startEditing}
            type="button"
          >
            <Pencil aria-hidden="true" size={15} />
            Inserisci o modifica contenuti
          </button>
        ) : (
          <p className="node-knowledge__empty">
            Accedi con un account autorizzato per modificare questi contenuti.
          </p>
        )}
        {sections.length > 0 ? (
          <div className="node-knowledge__sections">
            {sections.map((section, index) => (
              <article className="node-knowledge__section" key={`${section.title}-${index}`}>
                <h3>{section.title}</h3>
                <ContentBlock block={section} />
              </article>
            ))}
          </div>
        ) : (
          <p className="node-knowledge__empty">
            Gli approfondimenti per questo nodo non sono ancora disponibili.
          </p>
        )}
      </div>
    </section>
  );
}
