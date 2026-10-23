import { useState } from "react";
import { X } from "lucide-react";

export default function AuthPanel({ onSignIn, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim();

    setIsSigningIn(true);
    setError("");
    try {
      const signInError = await onSignIn({
        email: normalizedEmail,
        password,
      });
      if (signInError) setError(signInError);
    } catch (signInError) {
      console.error("Impossibile accedere.", signInError);
      setError(
        signInError instanceof Error
          ? signInError.message
          : "Errore imprevisto durante l'accesso.",
      );
    } finally {
      setIsSigningIn(false);
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
          disabled={isSigningIn}
          id="auth-email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
        <label htmlFor="auth-password">Password</label>
        <input
          autoComplete="current-password"
          disabled={isSigningIn}
          id="auth-password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
        {error && (
          <p aria-live="polite" className="glossary-form__error" role="alert">
            {error}
          </p>
        )}
        <button
          className="auth-panel__submit"
          disabled={isSigningIn}
          type="submit"
        >
          {isSigningIn ? "Accesso…" : "Accedi"}
        </button>
      </form>
    </section>
  );
}
