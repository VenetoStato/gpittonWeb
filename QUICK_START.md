# 🚀 Quick Start - Deploy in 5 Minuti

## Passo 1: Crea il Repository su GitHub

1. Vai su https://github.com/new
2. Nome repository: `giovannipitton` (o qualsiasi nome)
3. ✅ Pubblica (public) o 🔒 Privato (private) - entrambi funzionano!
4. Clicca **Create repository**

## Passo 2: Carica i File

### Opzione A: Usando GitHub Web Interface (PIÙ FACILE)

1. Nel repository appena creato, clicca **"uploading an existing file"**
2. Trascina TUTTI i file della cartella del sito:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `sitemap.xml`
   - `robots.txt`
   - `.nojekyll`
   - `.gitignore`
   - `README.md`
   - Cartella `.github` (se presente)
3. Scorri in basso, scrivi "Initial commit"
4. Clicca **Commit changes**

### Opzione B: Usando Git (DA TERMINALE)

```bash
# Vai nella cartella del progetto
cd C:\Users\stell\gpitton

# Inizializza git
git init

# Aggiungi tutti i file
git add .

# Fai il commit
git commit -m "Initial commit - Sito personale"

# Collega al tuo repository GitHub
git remote add origin https://github.com/VenetoStato/giovannipitton.git

# Push
git branch -M main
git push -u origin main
```

## Passo 3: Attiva GitHub Pages

1. Nel repository, vai su **Settings** (in alto a destra)
2. Nella sidebar sinistra, clicca **Pages**
3. In **Source**, seleziona:
   - Branch: **main** (o master)
   - Folder: **/ (root)**
4. Clicca **Save**

## Passo 4: Aspetta 1-2 Minuti

Il tuo sito sarà disponibile su:
- `https://venetostato.github.io/giovannipitton/`

🎉 **FATTO! Il sito è online e GRATIS!**

---

## ⚙️ Configurazione EmailJS (IMPORTANTE)

Prima che il modulo contatti funzioni, devi configurare EmailJS:

1. Vai su https://www.emailjs.com/ e registrati (GRATIS)
2. Crea un servizio email (Gmail/Outlook)
3. Crea 2 template:
   - Template per contatti
   - Template per newsletter
4. Apri `script.js` e sostituisci:
   - `YOUR_PUBLIC_KEY` → La tua Public Key
   - `YOUR_SERVICE_ID` → Il tuo Service ID
   - `YOUR_TEMPLATE_ID` → Il tuo Template ID
   - `your-email@example.com` → La tua email

Vedi `DEPLOY.md` per dettagli completi.

---

## 🔄 Aggiornare il Sito

Ogni volta che modifichi qualcosa:

```bash
git add .
git commit -m "Aggiornamento sito"
git push origin main
```

Il sito si aggiorna automaticamente in 1-2 minuti!

---

## 📝 Note Importanti

- ✅ **Costo totale: €0.00** (completamente gratuito)
- ✅ Funziona anche con repository privati (se hai GitHub Pro)
- ✅ EmailJS: 200 email/mese gratis
- ✅ Dominio personalizzato: opzionale (€10-15/anno)

---

## 🆘 Problemi?

- Il sito non si vede? Aspetta 2-3 minuti e ricarica
- Errori 404? Controlla che `index.html` sia nella root
- EmailJS non funziona? Verifica le chiavi in `script.js`

---

## 🔗 Link Utili

- [Il tuo profilo GitHub](https://github.com/VenetoStato)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [EmailJS Docs](https://www.emailjs.com/docs/)
