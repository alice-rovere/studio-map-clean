# Grammatica delle relazioni

Ogni collegamento della Studio Map ha un significato esplicito. La regola di
lettura è:

> **`source → target` si legge "source [verbo] target"**

Il verbo è determinato dal campo `edges.kind`. La resa visiva (colore, spessore,
tratteggio, freccia) serve solo a rendere riconoscibile il tipo di relazione.

## Tipi di relazione

| `kind` | Etichetta | Frase di esempio | Stile |
| --- | --- | --- | --- |
| `richiede` | richiede | "TypeScript richiede JavaScript" | linea piena con freccia |
| `usa` | usa | "React usa JavaScript" | linea sottile con freccia |
| `estende` | estende | "Next.js estende React" | linea spessa con freccia |
| `alternativa` | alternativa | "Vue è un'alternativa a React" | tratteggio lungo, senza freccia |
| `si_integra` | si integra | "Supabase si integra con PostgreSQL" | linea piena, senza freccia |
| `strumento` | strumento | "DBeaver è uno strumento per PostgreSQL" | puntinato, senza freccia |
| `ospita` | ospita | "Docker ospita PostgreSQL" | tratteggio, con freccia |

## Revisione degli archi esistenti

Gli id storici non cambiano, anche quando la direzione viene corretta. In questo
modo le migrazioni restano ripetibili e i riferimenti non si rompono.

| id | Prima | Dopo | `kind` | Nota |
| --- | --- | --- | --- | --- |
| `e-html-css` | html → css | html → css | `usa` | HTML usa CSS per la presentazione |
| `e-css-bootstrap` | css → bootstrap | bootstrap → css | `estende` | Bootstrap estende CSS |
| `e-css-tailwind` | css → tailwind | tailwind → css | `estende` | Tailwind estende CSS |
| `e-css-js` | css → js | css → js | `si_integra` | JavaScript modifica DOM e stili |
| `e-js-ts` | js → ts | ts → js | `richiede` | TypeScript richiede JavaScript |
| `e-ts-react` | ts → react | react → js | `usa` | React usa JavaScript |
| `e-react-nextjs` | react → nextjs | nextjs → react | `estende` | Next.js estende React |
| `e-react-rf` | react → react-flow | react-flow → react | `usa` | React Flow usa React |
| `e-ts-vue` | ts → vue | vue → js | `usa` | Vue usa JavaScript |
| `e-vue-nuxt` | vue → nuxt | nuxt → vue | `estende` | Nuxt estende Vue |
| `e-ts-angular` | ts → angular | angular → ts | `richiede` | Angular richiede TypeScript |
| `e-ts-svelte` | ts → svelte | svelte → js | `usa` | Svelte usa JavaScript |
| `e-js-node` | js → nodejs | nodejs → js | `usa` | Node.js usa JavaScript |
| `e-ts-nestjs` | ts → nestjs | nestjs → ts | `richiede` | NestJS richiede TypeScript |
| `e-node-nestjs` | nodejs → nestjs | nestjs → nodejs | `usa` | NestJS usa Node.js |
| `e-node-prisma` | nodejs → prisma | prisma → nodejs | `usa` | Prisma usa Node.js |
| `e-node-drizzle` | nodejs → drizzle | drizzle → nodejs | `usa` | Drizzle usa Node.js |
| `e-python-fastapi` | python → fastapi | fastapi → python | `richiede` | FastAPI richiede Python |
| `e-prisma-postgres` | prisma → postgresql | prisma → postgresql | `si_integra` | Prisma si integra con PostgreSQL |
| `e-drizzle-postgres` | drizzle → postgresql | drizzle → postgresql | `si_integra` | Drizzle si integra con PostgreSQL |
| `e-prisma-mysql` | prisma → mysql | prisma → mysql | `si_integra` | Prisma si integra con MySQL |
| `e-postgres-supabase` | postgresql → supabase | supabase → postgresql | `usa` | Supabase usa PostgreSQL |
| `e-mongodb-firebase` | mongodb → firebase | firebase → mongodb | `alternativa` | Firebase è alternativa a MongoDB |
| `e-python-milvus` | python → milvus | python → milvus | `usa` | Python usa Milvus |
| `e-node-redis` | nodejs → redis | nodejs → redis | `usa` | Node.js usa Redis |
| `e-dbeaver-postgres` | dbeaver → postgresql | dbeaver → postgresql | `strumento` | DBeaver è strumento per PostgreSQL |
| `e-dbeaver-mysql` | dbeaver → mysql | dbeaver → mysql | `strumento` | DBeaver è strumento per MySQL |
| `e-postman-nestjs` | postman → nestjs | postman → nestjs | `strumento` | Postman è strumento per NestJS |
| `e-postman-fastapi` | postman → fastapi | postman → fastapi | `strumento` | Postman è strumento per FastAPI |
| `e-figma-tailwind` | figma → tailwind | figma → tailwind | `si_integra` | Figma si integra con Tailwind |
| `e-vscode-git` | vscode → git | vscode → git | `strumento` | VS Code è strumento per Git |
| `e-git-github` | git → github | github → git | `usa` | GitHub usa Git |
| `e-github-actions` | github → github-actions | github-actions → github | `usa` | GitHub Actions usa GitHub |
| `e-pnpm-node` | pnpm → nodejs | pnpm → nodejs | `strumento` | pnpm è strumento per Node.js |
| `e-docker-postgres` | docker → postgresql | docker → postgresql | `ospita` | Docker ospita PostgreSQL |
| `e-react-vite` | react → vite | vite → react | `strumento` | Vite è strumento per React |
| `e-pnpm-vite` | pnpm → vite | pnpm → vite | `strumento` | pnpm è strumento per Vite |

## Casi corretti invece che rimossi

- `mongodb → firebase` non era una dipendenza: Firebase non è costruito su
  MongoDB. Ora è una relazione di **alternativa**, con Firebase come soggetto.
- `figma → tailwind` non è una dipendenza tecnica: è un flusso di lavoro, quindi
  diventa **si integra**.
- `ts → vue` e `ts → svelte` non sono prerequisiti: Vue e Svelte usano
  JavaScript. TypeScript resta collegato ad Angular e NestJS, dove è richiesto.
- `ts → nestjs` e `nodejs → nestjs` restano entrambi: uno è **richiede**
  (TypeScript), l'altro è **usa** (Node.js).

## Come aggiungere un collegamento

1. Scegli il soggetto: è il nodo da cui parte la freccia.
2. Scegli il verbo tra i sette tipi.
3. Verifica che la frase "soggetto verbo oggetto" abbia senso.
4. Se nessun verbo calza, il collegamento probabilmente non serve.
