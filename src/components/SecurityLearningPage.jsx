import { ArrowLeft, ExternalLink } from "lucide-react";

const learningResources = [
  {
    label: "OWASP Top 10",
    description: "Panoramica dei principali rischi per le applicazioni web.",
    href: "https://owasp.org/www-project-top-ten/",
  },
  {
    label: "PortSwigger Web Security Academy",
    description: "Percorsi e laboratori interattivi in un ambiente didattico.",
    href: "https://portswigger.net/web-security",
  },
  {
    label: "OWASP Web Security Testing Guide",
    description: "Guida ai test di sicurezza da svolgere con autorizzazione.",
    href: "https://owasp.org/www-project-web-security-testing-guide/",
  },
];

export default function SecurityLearningPage({ onClose }) {
  return (
    <section
      aria-labelledby="security-learning-title"
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
        <span className="node-details__eyebrow">PERCORSO INTRODUTTIVO</span>
        <h2 id="security-learning-title">Sicurezza informatica e hacking etico</h2>
        <p className="guidelines-page__intro">
          La sicurezza informatica studia come proteggere applicazioni, dati e
          infrastrutture. L’hacking etico applica le stesse conoscenze per
          individuare e correggere problemi, ma solo con un’autorizzazione
          esplicita e entro un perimetro concordato.
        </p>

        <section
          aria-labelledby="security-injection-title"
          className="guidelines-page__section"
        >
          <h3 id="security-injection-title">Che cos’è la script injection?</h3>
          <p>
            È una famiglia di vulnerabilità in cui contenuti controllati da un
            utente vengono interpretati dal browser come codice invece che come
            testo. Una forma nota è XSS (Cross-Site Scripting): può coinvolgere
            dati salvati, inviati in una richiesta o gestiti dal codice della
            pagina.
          </p>
          <ul className="guidelines-page__list">
            <li>Usa l’escaping automatico del framework per mostrare testo.</li>
            <li>
              Evita di inserire HTML non fidato; se serve HTML formattato,
              sanificalo con una libreria mantenuta.
            </li>
            <li>
              Valida i dati per il loro contesto e usa una Content Security
              Policy come difesa aggiuntiva, non come unica protezione.
            </li>
          </ul>
        </section>

        <section
          aria-labelledby="security-load-title"
          className="guidelines-page__section"
        >
          <h3 id="security-load-title">
            Cosa significa “bombardare” un server?
          </h3>
          <p>
            In genere ci si riferisce a un attacco denial of service (DoS), o
            DDoS quando il traffico proviene da più sistemi: il servizio può
            diventare lento o irraggiungibile. Generare traffico contro sistemi
            senza permesso può danneggiare servizi e utenti ed è illegale.
          </p>
          <p>
            Per imparare a misurare le prestazioni, usa test di carico solo su
            applicazioni locali o infrastrutture per cui hai un’autorizzazione
            esplicita. Concorda prima obiettivo e limiti, aumenta il carico in
            modo controllato, monitora il sistema e interrompi il test se
            emergono anomalie.
          </p>
        </section>

        <section
          aria-labelledby="security-practice-title"
          className="guidelines-page__section"
        >
          <h3 id="security-practice-title">Un percorso sicuro per iniziare</h3>
          <ol className="guidelines-page__list">
            <li>Impara le basi di HTTP, browser, JavaScript e reti.</li>
            <li>Studia le vulnerabilità e le contromisure, partendo da OWASP.</li>
            <li>
              Fai pratica in laboratori didattici progettati per essere
              vulnerabili, non su siti o reti pubbliche.
            </li>
            <li>
              Testa solo sistemi tuoi o coperti da un’autorizzazione scritta che
              definisca chiaramente perimetro e metodi consentiti.
            </li>
          </ol>
        </section>

        <section
          aria-labelledby="security-resources-title"
          className="guidelines-page__section"
        >
          <h3 id="security-resources-title">Risorse per approfondire</h3>
          <ul className="guidelines-page__resources">
            {learningResources.map(({ label, description, href }) => (
              <li key={href}>
                <a href={href} rel="noreferrer" target="_blank">
                  {label}
                  <ExternalLink aria-hidden="true" size={14} />
                  <span className="guidelines-page__resource-description">
                    {description}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </section>
  );
}
