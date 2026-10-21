alter table public.node_details
  add column if not exists extended_content jsonb not null default '[]'::jsonb;

update public.node_details
set extended_content = $content$
[
  {
    "title": "Comandi Git essenziali",
    "type": "table",
    "columns": ["Comando", "A cosa serve", "Esempio"],
    "rows": [
      ["git status", "Mostra file modificati e stato dell'area di staging.", "git status"],
      ["git add", "Aggiunge modifiche all'area di staging.", "git add src/App.jsx"],
      ["git commit", "Registra le modifiche preparate nella cronologia.", "git commit -m \"Aggiunge dettagli nodo\""],
      ["git log", "Mostra la cronologia dei commit.", "git log --oneline"],
      ["git switch", "Cambia branch oppure ne crea uno nuovo.", "git switch -c feature/node-details"],
      ["git pull", "Integra gli aggiornamenti del branch remoto.", "git pull origin main"],
      ["git push", "Invia i commit al repository remoto.", "git push -u origin feature/node-details"]
    ]
  },
  {
    "title": "Flusso di lavoro consigliato",
    "type": "list",
    "items": [
      "Controlla lo stato del repository prima di iniziare e prima di un commit.",
      "Crea un branch per ogni modifica circoscritta.",
      "Prepara commit piccoli con messaggi chiari e descrittivi.",
      "Controlla il diff prima di condividere le modifiche."
    ]
  }
]
$content$::jsonb
where node_id = 'git';

update public.node_details
set extended_content = $content$
[
  {
    "title": "Una breve storia",
    "type": "timeline",
    "entries": [
      {"date": "1989", "title": "Nasce il Web", "description": "Tim Berners-Lee propone al CERN un sistema ipertestuale per condividere informazioni."},
      {"date": "1991", "title": "Primo documento HTML", "description": "Viene pubblicata la prima descrizione pubblica di HTML e del Web."},
      {"date": "1995", "title": "HTML 2.0", "description": "HTML viene formalizzato come standard e si diffondono i moduli."},
      {"date": "1997–1999", "title": "HTML 4", "description": "Lo standard consolida struttura, presentazione e supporto agli script."},
      {"date": "2014", "title": "HTML5 diventa Recommendation", "description": "Il W3C pubblica HTML5 come Recommendation, con elementi semantici e API moderne."}
    ]
  },
  {
    "title": "Tag semantici e strutturali",
    "type": "table",
    "columns": ["Tag", "Uso principale", "Attributi comuni"],
    "rows": [
      ["<header>", "Intestazione di una pagina o sezione.", "id, class, aria-label"],
      ["<nav>", "Raggruppa i collegamenti di navigazione.", "id, class, aria-label"],
      ["<main>", "Contiene il contenuto principale della pagina.", "id, class"],
      ["<section>", "Raggruppa contenuti correlati con un titolo.", "id, class, aria-labelledby"],
      ["<article>", "Contenuto autonomo e riutilizzabile.", "id, class"],
      ["<footer>", "Piè di pagina di una pagina o sezione.", "id, class"]
    ]
  },
  {
    "title": "Attributi importanti",
    "type": "table",
    "columns": ["Attributo", "A cosa serve", "Esempio"],
    "rows": [
      ["alt", "Fornisce un testo alternativo per le immagini.", "<img src=\"logo.png\" alt=\"Logo dello studio\">"],
      ["href", "Indica la destinazione di un collegamento.", "<a href=\"/contatti\">Contatti</a>"],
      ["type", "Specifica il tipo di input o pulsante.", "<button type=\"button\">Apri</button>"],
      ["for", "Collega un'etichetta al controllo del form.", "<label for=\"email\">Email</label>"],
      ["aria-label", "Fornisce un nome accessibile quando manca un'etichetta visibile.", "<button aria-label=\"Chiudi\">×</button>"],
      ["data-*", "Memorizza dati personalizzati sugli elementi.", "<div data-state=\"open\"></div>"]
    ]
  }
]
$content$::jsonb
where node_id = 'html';

update public.node_details
set extended_content = $content$
[
  {
    "title": "CSS in breve",
    "type": "text",
    "text": "CSS (Cascading Style Sheets) descrive come presentare i documenti HTML. Le regole associano selettori a dichiarazioni: la cascata, la specificità e l'ereditarietà determinano quali stili vengono applicati."
  },
  {
    "title": "Flexbox: layout in una dimensione",
    "type": "text",
    "text": "Flexbox dispone gli elementi lungo un asse principale, orizzontale o verticale. È adatto ad allineare e distribuire elementi in una riga o colonna."
  },
  {
    "title": "Proprietà Flexbox utili",
    "type": "table",
    "columns": ["Proprietà", "Ruolo", "Valori tipici"],
    "rows": [
      ["display", "Attiva il layout flex sul contenitore.", "flex, inline-flex"],
      ["flex-direction", "Imposta l'asse principale.", "row, column"],
      ["justify-content", "Distribuisce gli elementi sull'asse principale.", "center, space-between, flex-end"],
      ["align-items", "Allinea gli elementi sull'asse trasversale.", "center, stretch, flex-start"],
      ["flex-wrap", "Consente agli elementi di andare a capo.", "wrap, nowrap"],
      ["gap", "Imposta lo spazio tra gli elementi.", "1rem, 12px"]
    ]
  },
  {
    "title": "Grid: layout in due dimensioni",
    "type": "text",
    "text": "CSS Grid organizza il contenuto in righe e colonne. È ideale per layout di pagina e griglie di elementi che devono allinearsi su entrambi gli assi."
  },
  {
    "title": "Esempio di griglia responsive",
    "type": "code",
    "code": ".cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 1rem;\n}"
  },
  {
    "title": "Proprietà Grid utili",
    "type": "table",
    "columns": ["Proprietà", "Ruolo", "Esempio"],
    "rows": [
      ["grid-template-columns", "Definisce le colonne della griglia.", "repeat(3, 1fr)"],
      ["grid-template-rows", "Definisce le righe della griglia.", "auto 1fr auto"],
      ["grid-column", "Posiziona un elemento tra linee di colonna.", "1 / 3"],
      ["grid-area", "Assegna un elemento a un'area nominata.", "main"],
      ["place-items", "Allinea gli elementi su entrambi gli assi.", "center"]
    ]
  }
]
$content$::jsonb
where node_id = 'css';
