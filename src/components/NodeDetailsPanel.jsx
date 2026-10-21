import { BookOpen, Code2, ExternalLink, X } from "lucide-react";
import GlossaryText from "./GlossaryText.jsx";

const emptyDetails = {
  description: "Esplora questa tecnologia e il suo ruolo nell'ecosistema dello studio.",
  best_practices: [],
  naming_conventions: [],
  associated_software: [],
  study_urls: [],
};

export default function NodeDetailsPanel({ node, details, glossary, onClose }) {
  const nodeInfo = details || emptyDetails;
  const category = node.data.category?.toLowerCase() || "tools";
  const studyUrls = Array.isArray(nodeInfo.study_urls) ? nodeInfo.study_urls : [];
  const bestPractices =
    typeof nodeInfo.best_practices === "string"
      ? nodeInfo.best_practices.split(/\r?\n/).filter(Boolean)
      : [];

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
          <p className="node-details__description">
            <GlossaryText glossary={glossary}>{nodeInfo.description || emptyDetails.description}</GlossaryText>
          </p>

          <section className="node-details__section" aria-labelledby="best-practices-title">
            <h3 id="best-practices-title">
              <BookOpen aria-hidden="true" size={15} />
              Best practice
            </h3>
            <ul>
              {bestPractices.map((practice) => (
                <li key={practice}><GlossaryText glossary={glossary}>{practice}</GlossaryText></li>
              ))}
            </ul>
          </section>

          <section className="node-details__section" aria-labelledby="naming-conventions-title">
            <h3 id="naming-conventions-title">
              <Code2 aria-hidden="true" size={15} />
              Naming convention
            </h3>
            <ul>
              {(nodeInfo.naming_conventions || []).map((convention) => (
                <li key={convention}><GlossaryText glossary={glossary}>{convention}</GlossaryText></li>
              ))}
            </ul>
          </section>

          <section className="node-details__section" aria-labelledby="resources-title">
            <h3 id="resources-title">
              <ExternalLink aria-hidden="true" size={15} />
              Link utili
            </h3>
            {studyUrls.length > 0 ? (
              <ul className="node-details__links">
                {studyUrls.map((link) => (
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
          {nodeInfo.associated_software?.length > 0 && (
            <section className="node-details__section" aria-labelledby="associated-software-title">
              <h3 id="associated-software-title">Software associati</h3>
              <ul>
                {nodeInfo.associated_software.map((software) => (
                  <li key={software}>{software}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <footer className="node-details__footer">
          <span className="node-details__status" aria-hidden="true" />
          STUDIO MAP <span>·</span> INSPECTOR
        </footer>
      </aside>
    </div>
  );
}
