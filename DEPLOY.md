# 🚀 Guida al Deploy su GitHub Pages (GRATIS)

## Opzione 1: Repository Dedicato (CONSIGLIATO)

### Passo 1: Crea un nuovo repository su GitHub

1. Vai su [GitHub](https://github.com/new)
2. Crea un nuovo repository chiamato: `giovannipitton.github.io` (o qualsiasi nome)
3. **IMPORTANTE**: Se usi `username.github.io`, il sito sarà disponibile su `https://username.github.io`
4. Se usi un nome diverso, sarà su `https://username.github.io/nome-repository`

### Passo 2: Carica i file

```bash
# Inizializza git (se non l'hai già fatto)
git init

# Aggiungi tutti i file
git add .

# Fai il primo commit
git commit -m "Initial commit - Sito personale Giovanni Pitton"

# Collega al tuo repository GitHub
git remote add origin https://github.com/VenetoStato/giovannipitton.github.io.git

# Oppure se vuoi usare il repository VenetoStato esistente:
# git remote add origin https://github.com/VenetoStato/giovannipitton.github.io.git

# Push al repository
git branch -M main
git push -u origin main
```

### Passo 3: Attiva GitHub Pages

1. Vai sul tuo repository su GitHub
2. Clicca su **Settings** (Impostazioni)
3. Scorri fino a **Pages** (nella sidebar sinistra)
4. In **Source**, seleziona:
   - **Branch: main** (o master)
   - **Folder: / (root)**
5. Clicca **Save**
6. Il tuo sito sarà disponibile in pochi minuti su:
   - `https://venetostato.github.io/giovannipitton.github.io/` (se repository con nome personalizzato)
   - `https://venetostato.github.io/` (se repository si chiama esattamente `venetostato.github.io`)

---

## Opzione 2: Usare il Repository VenetoStato Esistente

### Usando un branch dedicato (gh-pages)

```bash
# Crea un branch gh-pages
git checkout -b gh-pages

# Aggiungi i file del sito
git add index.html styles.css script.js sitemap.xml robots.txt .nojekyll

# Commit
git commit -m "Add personal website"

# Push del branch
git push origin gh-pages
```

Poi in Settings > Pages, seleziona il branch `gh-pages` come source.

### Usando una cartella nel repository principale

Crea una cartella `website` o `site` nel repository e metti tutti i file lì. Poi in Settings > Pages, seleziona la cartella.

---

## Opzione 3: Repository Privato con GitHub Pages

**GitHub Pages funziona anche con repository privati!** (solo per account GitHub Pro, altrimenti solo pubblici)

1. Crea un repository privato
2. Segui gli stessi passi sopra
3. Il sito sarà pubblico anche se il repository è privato

---

## 🌐 Dominio Personalizzato (Opzionale)

Se hai un dominio (es. giovannipitton.com):

1. In Settings > Pages, inserisci il tuo dominio
2. Aggiungi un file `CNAME` nella root del repository con il dominio:
   ```
   giovannipitton.com
   ```
3. Configura i DNS del tuo dominio:
   - Tipo: CNAME
   - Nome: @ o www
   - Valore: venetostato.github.io

---

## 📧 Configurazione EmailJS

**IMPORTANTE**: Prima di fare il deploy, configura EmailJS:

1. Vai su [EmailJS](https://www.emailjs.com/) e crea un account gratuito
2. Crea un servizio email (Gmail, Outlook, ecc.)
3. Crea due template:
   - Template per contatti
   - Template per newsletter
4. Modifica `script.js` e sostituisci:
   - `YOUR_PUBLIC_KEY`
   - `YOUR_SERVICE_ID`
   - `YOUR_TEMPLATE_ID`
   - `YOUR_NEWSLETTER_SERVICE_ID`
   - `YOUR_NEWSLETTER_TEMPLATE_ID`
   - `your-email@example.com`

---

## 🔄 Aggiornamenti Futuri

Ogni volta che modifichi il sito:

```bash
git add .
git commit -m "Aggiornamento sito"
git push origin main  # o gh-pages se usi quel branch
```

Il sito si aggiorna automaticamente in 1-2 minuti!

---

## ✅ Checklist Pre-Deploy

- [ ] Configurato EmailJS in `script.js`
- [ ] Aggiornato URL nel sitemap.xml (se hai un dominio personalizzato)
- [ ] Testato il sito localmente
- [ ] Repository creato su GitHub
- [ ] File caricati su GitHub
- [ ] GitHub Pages attivato in Settings
- [ ] Sito accessibile online

---

## 💰 Costi

**TOTALE: €0.00** 🎉

- GitHub Pages: **GRATIS** (illimitato per repository pubblici)
- EmailJS: **GRATIS** (fino a 200 email/mese)
- Dominio personalizzato: Opzionale (circa €10-15/anno se lo vuoi)

---

## 🆘 Problemi Comuni

### Il sito non si aggiorna
- Aspetta 1-2 minuti (GitHub ha bisogno di tempo)
- Controlla che il branch sia corretto in Settings > Pages
- Verifica che `index.html` sia nella root

### Errori 404
- Assicurati che il file `.nojekyll` sia presente
- Controlla che i percorsi dei file CSS/JS siano corretti

### EmailJS non funziona
- Verifica che le chiavi siano corrette
- Controlla la console del browser per errori
- Assicurati che EmailJS sia inizializzato correttamente

---

## 📚 Link Utili

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Il tuo profilo GitHub](https://github.com/VenetoStato)
