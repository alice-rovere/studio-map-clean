import { useState } from "react";
import { X } from "lucide-react";

export default function AuthPanel({ onRequestMagicLink, onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Inserisci l'indirizzo email.");
      return;
    }

    setIsSending(true);
    setError("");
    try {
      const requestError = await onRequestMagicLink(normalizedEmail);
      if (requestError) {
        setError(requestError);
        return;
      }
      setLinkSent(true);
    } catch (requestError) {
      console.error("Impossibile richiedere il link di accesso.", requestError);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Errore imprevisto durante la richiesta del link.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section
      aria-labelledby="auth-panel-title"
      aria-modal="false"
      className="auth-panel"
      role="dialog"
    >
      <header className="auth-panel__header">
        <div>
          <h2 id="auth-panel-title">Accesso editor</h2>
          <p>Solo gli account invitati possono modificare la mappa.</p>
        </div>
        <button
          aria-label="Chiudi accesso"
          className="glossary-form__close"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={16} />
        </button>
      </header>
      <form className="auth-panel__form" onSubmit={handleSubmit}>
        <label htmlFor="auth-email">Email dell'account invitato</label>
        <input
          autoComplete="email"
          autoFocus
          disabled={isSending}
          id="auth-email"
          onChange={(event) => {
            setEmail(event.target.value);
            setLinkSent(false);
          }}
          required
          type="email"
          value={email}
        />
        {error && (
          <p aria-live="polite" className="glossary-form__error" role="alert">
            {error}
          </p>
        )}
        {linkSent && (
          <p aria-live="polite" className="auth-panel__success" role="status">
            Link inviato. Controlla la posta e aprilo per accedere alla mappa.
          </p>
        )}
        <button
          className="auth-panel__submit"
          disabled={isSending}
          type="submit"
        >
          {isSending ? "Invio…" : linkSent ? "Invia di nuovo il link" : "Invia link di accesso"}
        </button>
      </form>
    </section>
  );
}
