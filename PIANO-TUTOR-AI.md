# Piano: tutor AI e esercizi di codice

## Obiettivo

Aggiungere a Studio Map un tutor interattivo che aiuti a imparare gli argomenti
della mappa attraverso domande, spiegazioni ed esercizi pratici di
programmazione.

## Funzionalita previste

### Tutor a domande e risposte

- L'utente seleziona un argomento o un nodo della mappa, per esempio React,
  SQL o Git.
- Il tutor propone una domanda e attende la risposta dell'utente.
- Dopo la risposta, fornisce un riscontro, chiarisce eventuali errori e puo
  proporre una domanda successiva.
- Le informazioni gia salvate in Supabase per il nodo selezionato possono
  essere fornite al modello come contesto, in modo da mantenere le spiegazioni
  pertinenti ai contenuti dell'app.

### Esercizi di programmazione

- Il tutor genera una consegna commisurata all'argomento e, se previsto, al
  livello dell'utente.
- L'utente scrive o incolla il codice nell'app.
- Test automatici verificano il risultato; il tutor puo poi spiegare l'esito e
  suggerire miglioramenti.
- Per la prima versione degli esercizi, limitare il supporto a JavaScript e a
  problemi brevi.
- L'esecuzione del codice deve avvenire in un ambiente isolato, per esempio
  tramite un servizio sandbox come Judge0. Non eseguire codice arbitrario
  direttamente nel server dell'app.

## Architettura proposta

1. **Interfaccia React**: nuova sezione o pannello per scegliere un argomento,
   leggere le domande e inviare risposte o codice.
2. **Supabase Edge Function**: intermediario tra il client e il provider AI.
   Le chiavi segrete del provider devono restare sul server e non essere
   incluse nel bundle frontend.
3. **Provider AI**: valutare un provider per il prototipo, ad esempio OpenAI,
   Anthropic o Google Gemini. Mantenere l'integrazione sul server per poter
   sostituire il provider senza modificare l'interfaccia.
4. **Supabase Database**: facoltativamente salvare sessioni, domande, risposte
   e progressi, se si vuole permettere all'utente di riprendere l'attivita.
5. **Runner di codice isolato**: integrare un servizio sandbox dedicato se si
   introducono esercizi eseguibili. L'esito dei test, non la sola valutazione
   generata dall'AI, deve essere il riferimento per stabilire se il codice
   funziona.

## API e servizi da valutare

- **Supabase Database**: contenuti dei nodi e, facoltativamente, sessioni e
  progressi.
- **Supabase Edge Functions**: chiamate server-side al provider AI senza
  esporre credenziali nel browser.
- **API di un provider AI**: generazione di domande, consegne e spiegazioni.
  Scegliere un solo provider per l'MVP.
- **API di un runner sandbox**, come Judge0: necessaria solo per eseguire e
  verificare in modo isolato il codice degli esercizi.

## Fasi di implementazione

### Fase 1: MVP del tutor

- Implementare un tutor testuale a domande e risposte per un singolo nodo.
- Usare i contenuti del nodo in Supabase come contesto.
- Inviare le richieste al modello tramite una Edge Function.
- Mostrare domanda, risposta e feedback nell'interfaccia.
- Non eseguire codice inviato dall'utente in questa fase.

### Fase 2: persistenza e progressi

- Aggiungere il salvataggio delle sessioni e delle risposte, se richiesto.
- Definire come riprendere una sessione e come associare i progressi ai nodi o
  agli utenti autenticati.

### Fase 3: esercizi di codice

- Aggiungere esercizi brevi in JavaScript.
- Integrare un runner isolato con test automatici.
- Presentare l'esito dei test e chiedere al tutor di spiegarlo o fornire
  suggerimenti senza sostituire il risultato effettivo dei test.

## Decisioni da prendere prima dell'implementazione

- Quale provider AI usare e quale modello selezionare.
- Se il tutor deve essere disponibile solo agli utenti autenticati.
- Se e per quanto tempo conservare conversazioni e progressi.
- Quale servizio sandbox usare per gli esercizi e quali limiti applicare a
  tempo, memoria e dimensione del codice.
- Quali nodi e contenuti includere inizialmente nel tutor.

## Ambito iniziale consigliato

Realizzare prima il tutor a domande e risposte su un singolo nodo, usando i
contenuti esistenti e una Edge Function. Rimandare gli esercizi eseguibili alla
fase successiva, quando saranno disponibili un runner isolato e test
automatici.
