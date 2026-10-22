import { ArrowLeft } from "lucide-react";

const namingConventions = [
  {
    name: "camelCase",
    usage: "Variabili e funzioni JavaScript",
    example: "selectedNodeId, loadStudioMap()",
  },
  {
    name: "PascalCase",
    usage: "Componenti React e classi",
    example: "NodeDetailsPanel.jsx, function NodeDetailsPanel()",
  },
  {
    name: "snake_case",
    usage: "Colonne e campi del database, quando richiesto dallo schema",
    example: "position_x, best_practices",
  },
  {
    name: "kebab-case",
    usage: "Classi CSS e nomi di cartelle o file non-componenti",
    example: "studio-map__heading, user-settings/",
  },
  {
    name: "UPPER_SNAKE_CASE",
    usage: "Variabili d'ambiente e costanti globali davvero immutabili",
    example: "VITE_SUPABASE_URL",
  },
  {
    name: "Train-Case",
    usage: "Alcuni header HTTP e nomi composti in contesti specifici",
    example: "Content-Type",
  },
];

const fileConventions = [
  "Organizza il codice per responsabilità: componenti in src/components/, servizi e integrazioni in src/lib/ e dati condivisi in src/data/.",
  "Usa PascalCase per i file dei componenti React; mantieni i nomi degli altri moduli brevi e descrittivi, in kebab-case o camelCase secondo il ruolo e le convenzioni già presenti.",
  "Mantieni componenti, funzioni e file focalizzati; estrai un modulo solo quando ha una responsabilità chiara e riutilizzabile.",
];

const qualityPractices = [
  "Segui la formattazione e i pattern già usati nel progetto; evita variazioni di stile nello stesso modulo.",
  "Esegui pnpm lint e pnpm build prima di condividere una modifica.",
  "Aggiungi o aggiorna test per comportamenti e casi limite interessati dalla modifica.",
  "Preferisci cambiamenti piccoli e leggibili; rimuovi codice inutilizzato e dipendenze non necessarie.",
];

const accessibilityPractices = [
  "Usa elementi HTML semantici, etichette associate ai campi e nomi accessibili per i controlli.",
  "Assicurati che tutte le funzioni siano utilizzabili da tastiera e che il focus sia visibile.",
  "Non comunicare informazioni solo tramite colore; gestisci chiaramente caricamento, successo ed errore.",
  "Verifica contrasto, testi alternativi pertinenti e layout su schermi piccoli.",
];

const securityPractices = [
  "Non inserire segreti nel codice, nei commit o nel frontend; usa variabili d'ambiente per la configurazione.",
  "Le variabili VITE_* sono incluse nel bundle client: usale solo per valori pubblici, mai per password o chiavi service_role.",
  "Per Supabase, proteggi i dati con autenticazione e policy RLS appropriate; una chiave anon pubblica non sostituisce le policy.",
  "Valida i dati in ingresso e mostra errori espliciti senza esporre credenziali o dettagli interni non necessari.",
];

function GuidelineList({ items }) {
  return (
    <ul className="guidelines-page__list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function GeneralGuidelinesPage({ onClose }) {
  return (
    <section
      aria-labelledby="guidelines-page-title"
      className="guidelines-page"
    >
      <header className="guidelines-page__header">
        <button
          className="node-knowledge__back"
          onClick={onClose}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Torna alla mappa
        </button>
        <span className="guidelines-page__eyebrow">STUDIO PLAYBOOK</span>
      </header>

      <div className="guidelines-page__body">
        <span className="node-details__eyebrow">RIFERIMENTO GENERALE</span>
        <h2 id="guidelines-page-title">Linee guida dello studio</h2>
        <p className="guidelines-page__intro">
          Convenzioni condivise per mantenere il codice leggibile, accessibile e
          sicuro. Le regole specifiche di una tecnologia possono essere
          approfondite nella relativa scheda della mappa.
        </p>

        <section
          aria-labelledby="guidelines-naming-title"
          className="guidelines-page__section"
        >
          <h3 id="guidelines-naming-title">Naming convention</h3>
          <p>
            Scegli la forma in base al contesto e mantienila coerente nel
            progetto. Non cambiare la convenzione richiesta da un framework o da
            uno schema esistente.
          </p>
          <p>
            <a
              href="https://aulab.it/blog/le-convenzioni-del-naming-nella-programmazione-informatica"
              rel="noreferrer"
              target="_blank"
            >
              Approfondisci le convenzioni del naming ---&gt; vai al link
            </a>
          </p>
          <div className="node-knowledge__table-wrap">
            <table className="node-knowledge__table">
              <thead>
                <tr>
                  <th>Stile</th>
                  <th>Uso tipico</th>
                  <th>Esempio</th>
                </tr>
              </thead>
              <tbody>
                {namingConventions.map(({ name, usage, example }) => (
                  <tr key={name}>
                    <td>
                      <code>{name}</code>
                    </td>
                    <td>{usage}</td>
                    <td>
                      <code>{example}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          aria-labelledby="guidelines-files-title"
          className="guidelines-page__section"
        >
          <h3 id="guidelines-files-title">File e cartelle</h3>
          <GuidelineList items={fileConventions} />
        </section>

        <section
          aria-labelledby="guidelines-quality-title"
          className="guidelines-page__section"
        >
          <h3 id="guidelines-quality-title">Qualità del codice</h3>
          <GuidelineList items={qualityPractices} />
        </section>

        <section
          aria-labelledby="guidelines-accessibility-title"
          className="guidelines-page__section"
        >
          <h3 id="guidelines-accessibility-title">Accessibilità e UX</h3>
          <GuidelineList items={accessibilityPractices} />
        </section>

        <section
          aria-labelledby="guidelines-security-title"
          className="guidelines-page__section"
        >
          <h3 id="guidelines-security-title">Sicurezza di base</h3>
          <GuidelineList items={securityPractices} />
        </section>
      </div>
    </section>
  );
}
