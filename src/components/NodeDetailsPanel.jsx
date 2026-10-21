import { BookOpen, ExternalLink, X } from "lucide-react";
import { nodeDetails } from "../data/nodeDetails.js";

const categoryPractices = {
  frontend: [
    "Preferisci componenti piccoli e riutilizzabili, con responsabilita chiare.",
    "Verifica accessibilita, stati di caricamento ed errori oltre al caso ideale.",
    "Mantieni dipendenze e bundle essenziali; testa l'interfaccia sui breakpoint supportati.",
  ],
  backend: [
    "Valida gli input al confine dell'API e restituisci errori coerenti.",
    "Tieni segreti e configurazione fuori dal codice e applica il principio del minimo privilegio.",
    "Aggiungi test per i casi limite e log strutturati senza dati sensibili.",
  ],
  database: [
    "Definisci schema, vincoli e indici in base alle query reali.",
    "Usa migrazioni versionate e verifica le modifiche prima di applicarle in produzione.",
    "Applica permessi minimi e prevedi backup e procedure di ripristino.",
  ],
  devops: [
    "Automatizza i passaggi ripetibili con workflow versionati.",
    "Non esporre segreti nei log o nei repository; limita i permessi dei token.",
    "Monitora esecuzioni e distribuzioni e documenta il percorso di rollback.",
  ],
  tools: [
    "Condividi configurazioni e convenzioni utili nel repository del team.",
    "Mantieni strumenti e plugin aggiornati e installa solo cio che serve.",
    "Proteggi credenziali e dati di progetto anche negli strumenti locali.",
  ],
};

const fallbackDetails = {
  description: "Esplora questa tecnologia e il suo ruolo nell'ecosistema dello studio.",
  links: [],
};

export default function NodeDetailsPanel({ node, onClose }) {
  const details = nodeDetails[node.id] || fallbackDetails;
  const category = node.data.category?.toLowerCase() || "tools";
  const practices = categoryPractices[category] || categoryPractices.tools;

  return (
    <div className="node-details">
      <button
        aria-label="Chiudi dettagli"
        className="node-details__backdrop"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <aside
        aria-labelledby="node-details-title"
        aria-modal="true"
        className={`node-details__panel studio-node--${category}`}
        role="dialog"
      >
        <header className="node-details__header">
          <div>
            <span className="node-details__eyebrow">NODE INSPECTOR</span>
            <div className="node-details__category">{node.data.category}</div>
          </div>
          <button
            aria-label="Chiudi pannello"
            className="node-details__close"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </header>

        <div className="node-details__content">
          <div className="node-details__title-row">
            <span className="node-details__prompt" aria-hidden="true">&gt;_</span>
            <h2 id="node-details-title">{node.data.label}</h2>
          </div>
          <p className="node-details__description">{details.description}</p>

          <section className="node-details__section" aria-labelledby="best-practices-title">
            <h3 id="best-practices-title">
              <BookOpen aria-hidden="true" size={15} />
              Best practice
            </h3>
            <ul>
              {practices.map((practice) => <li key={practice}>{practice}</li>)}
            </ul>
          </section>

          <section className="node-details__section" aria-labelledby="resources-title">
            <h3 id="resources-title">
              <ExternalLink aria-hidden="true" size={15} />
              Link utili
            </h3>
            {details.links.length > 0 ? (
              <ul className="node-details__links">
                {details.links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} rel="noreferrer" target="_blank">
                      <span>{link.label}</span>
                      <ExternalLink aria-hidden="true" size={13} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="node-details__empty">Nessun link disponibile per questo nodo.</p>
            )}
          </section>
        </div>
        <footer className="node-details__footer">
          <span className="node-details__status" aria-hidden="true" />
          STUDIO MAP <span>·</span> INSPECTOR
        </footer>
      </aside>
    </div>
  );
}
