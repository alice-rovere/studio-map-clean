import { useState } from "react";
import { X } from "lucide-react";

export default function NodeForm({
  categories,
  subcategories,
  onAddNode,
  onClose,
}) {
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [subcategory, setSubcategory] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedLabel = label.trim();
    if (!normalizedLabel) {
      setError("Inserisci il nome del nodo.");
      return;
    }
    if (!subcategory) {
      setError("Seleziona la sottocategoria del nodo.");
      return;
    }

    setIsSubmitting(true);
    try {
      const addError = await onAddNode({
        label: normalizedLabel,
        category,
        subcategory,
      });
      if (addError) {
        setError(addError);
        return;
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="node-form-title" className="node-form" role="dialog">
      <header className="glossary-form__header">
        <h2 id="node-form-title">Nuovo nodo</h2>
        <button
          aria-label="Chiudi form"
          className="glossary-form__close"
          disabled={isSubmitting}
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={16} />
        </button>
      </header>
      <form className="glossary-form__fields" onSubmit={handleSubmit}>
        <label htmlFor="node-label">Nome del nodo</label>
        <input
          autoFocus
          disabled={isSubmitting}
          id="node-label"
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Es. React"
          value={label}
        />
        <label htmlFor="node-category">Categoria</label>
        <select
          disabled={isSubmitting}
          id="node-category"
          onChange={(event) => setCategory(event.target.value)}
          value={category}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <label htmlFor="node-subcategory">Sottocategoria</label>
        <select
          disabled={isSubmitting}
          id="node-subcategory"
          onChange={(event) => setSubcategory(event.target.value)}
          value={subcategory}
        >
          <option disabled value="">
            Seleziona una sottocategoria
          </option>
          {subcategories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        {error && (
          <p aria-live="polite" className="glossary-form__error">
            {error}
          </p>
        )}
        <div className="glossary-form__actions">
          <button
            className="glossary-form__cancel"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            Annulla
          </button>
          <button className="glossary-form__submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Salvataggio…" : "Aggiungi nodo"}
          </button>
        </div>
      </form>
    </section>
  );
}
