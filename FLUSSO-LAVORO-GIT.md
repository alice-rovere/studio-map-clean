# Lavorare alle modifiche senza aggiornare subito il sito

Il sito GitHub Pages viene aggiornato quando arriva un push sul branch `main`.
Per preparare e salvare molte modifiche senza pubblicarle, lavora su un branch
separato. Puoi fare push di quel branch su GitHub come copia remota: il workflow
di deploy non parte perché è configurato solo per `main`.

## 1. Crea un branch di lavoro

Dal terminale, nella cartella del progetto:

```powershell
git switch main
git pull origin main
git switch -c modifiche-in-corso
```

Sostituisci `modifiche-in-corso` con un nome breve che descriva il lavoro, per
esempio `nuovi-nodi` o `migliora-filtri`. `git pull` aggiorna `main` prima di
creare il branch, così parti dalla versione più recente.

Se hai già modifiche non salvate, prima di cambiare branch controlla `git status`.
Committale sul branch corretto oppure salvale temporaneamente; non
passare a `main` portandoti dietro modifiche di cui non hai verificato la
destinazione.

## 2. Lavora e crea commit sul branch

Puoi fare più commit mentre sviluppi:

```powershell
git add .
git commit -m "Descrivi una modifica"
```

Ripeti i comandi quando hai un altro gruppo di modifiche pronto. Questi commit
restano sul branch `modifiche-in-corso` e da soli non aggiornano il sito.

Per avere anche una copia del branch su GitHub, senza pubblicare il sito:

```powershell
git push -u origin modifiche-in-corso
```

Per i push successivi sullo stesso branch basta:

```powershell
git push
```

## 3. Integra il lavoro in `main`

### Metodo consigliato: Pull Request su GitHub

1. Dopo aver fatto push del branch, apri il repository su GitHub.
2. Crea una Pull Request da `modifiche-in-corso` verso `main`.
3. Controlla le modifiche e scegli **Merge pull request**.
4. Il merge aggiorna `main` e avvia il workflow di GitHub Pages.
5. Sul computer torna a `main`, scarica il merge e rimuovi il branch locale:

   ```powershell
   git switch main
   git pull origin main
   git branch -d modifiche-in-corso
   ```

   Se avevi pubblicato il branch e GitHub non lo ha già rimosso dopo il merge,
   puoi cancellarlo anche dal remoto:

   ```powershell
   git push origin --delete modifiche-in-corso
   ```

### In alternativa: merge da terminale

Se vuoi integrare il branch direttamente senza Pull Request:

```powershell
git switch main
git pull origin main
git merge modifiche-in-corso
git push origin main
```

Il `git push origin main` finale aggiorna il sito. Se Git segnala conflitti
durante il merge, risolvili nei file indicati, poi completa il merge con un
commit e fai il push.

## In breve

- Commit sul branch di lavoro: salva e organizza le modifiche senza aggiornare
  il sito.
- Push sul branch di lavoro: salva anche una copia su GitHub, senza aggiornare
  il sito.
- Merge in `main` e push: integra il lavoro e avvia la pubblicazione.

Il workflow di deploy è descritto in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).
