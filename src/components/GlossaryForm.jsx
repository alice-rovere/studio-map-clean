import { useState } from "react";
import { X } from "lucide-react";

export default function GlossaryForm({ error, onAddTerm, onClose }) {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [validationError, setValidationError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const normalizedTerm = term.trim();
    const normalizedDefinition = definition.trim();

    if (!normalizedTerm || !normalizedDefinition) {
      setValidationError("Inserisci sia il termine sia la definizione.");
      return;
    }

    const addError = onAddTerm({
      term: normalizedTerm,
      definition: normalizedDefinition,
    });
    if (addError) {
      setValidationError(addError);
      return;
    }

    onClose();
  }

  return (
    <section
      aria-labelledby="glossary-form-title"
      aria-modal="false"
      className="glossary-form"
      role="dialog"
    >
      <header className="glossary-form__header">
        <h2 id="glossary-form-title">Nuovo termine</h2>
        <button
          aria-label="Chiudi form"
          className="glossary-form__close"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={16} />
        </button>
      </header>
      <form className="glossary-form__fields" onSubmit={handleSubmit}>
        <label htmlFor="glossary-term">Nome del termine</label>
        <input
          autoFocus
          id="glossary-term"
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Es. deployment"
          value={term}
        />
        <label htmlFor="glossary-definition">Definizione</label>
        <textarea
          id="glossary-definition"
          onChange={(event) => setDefinition(event.target.value)}
          placeholder="Descrivi brevemente il termine"
          rows={3}
          value={definition}
        />
        {(validationError || error) && (
          <p aria-live="polite" className="glossary-form__error">
            {validationError || error}
          </p>
        )}
        <div className="glossary-form__actions">
          <button
            className="glossary-form__cancel"
            onClick={onClose}
            type="button"
          >
            Annulla
          </button>
          <button className="glossary-form__submit" type="submit">
            Aggiungi termine
          </button>
        </div>
      </form>
    </section>
  );
}
