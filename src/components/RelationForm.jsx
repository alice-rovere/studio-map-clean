import { useState } from "react";
import { ArrowLeftRight, X } from "lucide-react";
import {
  DEFAULT_EDGE_KIND,
  EDGE_KIND_OPTIONS,
  getEdgeKindConfig,
} from "../lib/edgeKinds.js";

export default function RelationForm({
  mode = "create",
  sourceLabel,
  targetLabel,
  initialKind = DEFAULT_EDGE_KIND,
  onConfirm,
  onClose,
  error = "",
  isSubmitting = false,
}) {
  const [kind, setKind] = useState(initialKind);
  const [isReversed, setIsReversed] = useState(false);
  const isEditing = mode === "edit";
  const fromLabel = isReversed ? targetLabel : sourceLabel;
  const toLabel = isReversed ? sourceLabel : targetLabel;
  const config = getEdgeKindConfig(kind);

  function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    onConfirm({ kind, isReversed });
  }

  return (
    <div className="relation-form">
      <button
        aria-label="Chiudi selettore relazione"
        className="relation-form__backdrop"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <section
        aria-labelledby="relation-form-title"
        aria-modal="true"
        className="relation-form__panel"
        role="dialog"
      >
        <header className="glossary-form__header">
          <div>
            <h2 id="relation-form-title">
              {isEditing ? "Modifica relazione" : "Nuova relazione"}
            </h2>
            <p className="relation-form__hint">
              Scegli il verbo che descrive il collegamento.
            </p>
          </div>
          <button
            aria-label="Chiudi form relazione"
            className="glossary-form__close"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={16} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="relation-form__endpoints">
            <span className="relation-form__endpoint">{fromLabel}</span>
            <button
              aria-label="Inverti direzione della relazione"
              className="relation-form__swap"
              disabled={isSubmitting}
              onClick={() => setIsReversed((current) => !current)}
              type="button"
            >
              <ArrowLeftRight aria-hidden="true" size={14} />
              <span>Inverti direzione</span>
            </button>
            <span className="relation-form__endpoint">{toLabel}</span>
          </div>

          <fieldset className="relation-form__fieldset">
            <legend>Tipo di relazione</legend>
            <div
              aria-label="Tipo di relazione"
              className="relation-form__kinds"
              role="radiogroup"
            >
              {EDGE_KIND_OPTIONS.map((option) => {
                const isSelected = kind === option.id;
                return (
                  <label
                    className={`relation-form__kind${isSelected ? " is-selected" : ""}`}
                    key={option.id}
                    style={{ "--kind-color": option.color }}
                  >
                    <input
                      checked={isSelected}
                      disabled={isSubmitting}
                      name="relation-kind"
                      onChange={() => setKind(option.id)}
                      type="radio"
                      value={option.id}
                    />
                    <svg
                      aria-hidden="true"
                      className="relation-form__kind-sample"
                      viewBox="0 0 28 8"
                    >
                      <line
                        stroke={option.color}
                        strokeDasharray={option.dasharray}
                        strokeLinecap="round"
                        strokeWidth={option.width}
                        x1="1"
                        x2="27"
                        y1="4"
                        y2="4"
                      />
                    </svg>
                    <span className="relation-form__kind-copy">
                      <span className="relation-form__kind-label">
                        {option.label}
                      </span>
                      <span className="relation-form__kind-description">
                        {option.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="relation-form__preview" aria-live="polite">
            <span className="relation-form__preview-label">Anteprima</span>
            <p
              className="relation-form__sentence"
              style={{ color: config.color }}
            >
              {config.sentence(fromLabel, toLabel)}
            </p>
          </div>

          {error && (
            <p aria-live="polite" className="glossary-form__error" role="alert">
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
            <button
              className="glossary-form__submit"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? "Salvataggio…"
                : isEditing
                  ? "Salva relazione"
                  : "Crea relazione"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
