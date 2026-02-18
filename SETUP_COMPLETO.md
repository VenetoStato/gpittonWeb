# ✅ Setup Completo - Tutto Quello che Ti Serve

## 📋 Checklist Pre-Deploy

### 1. File del Sito ✅
Tutti i file necessari sono già presenti:
- ✅ `index.html` - Pagina principale
- ✅ `styles.css` - Stili
- ✅ `script.js` - JavaScript e EmailJS
- ✅ `sitemap.xml` - Sitemap per SEO
- ✅ `robots.txt` - Robots.txt per SEO
- ✅ `.nojekyll` - File per GitHub Pages
- ✅ `.gitignore` - File da ignorare in Git

### 2. Configurazione EmailJS ⚠️ (DA FARE)

**IMPORTANTE**: Prima di fare il deploy, configura EmailJS per far funzionare i moduli contatti e newsletter.

#### Passo 1: Crea Account EmailJS
1. Vai su https://www.emailjs.com/
2. Clicca "Sign Up" (è GRATIS)
3. Crea un account

#### Passo 2: Crea Servizio Email
1. Nel dashboard, vai su **Email Services**
2. Clicca **Add New Service**
3. Scegli un provider (Gmail, Outlook, ecc.)
4. Segui le istruzioni per connettere la tua email
5. **Copia il Service ID** (ti servirà dopo)

#### Passo 3: Crea Template per Contatti
1. Vai su **Email Templates**
2. Clicca **Create New Template**
3. Usa questo template:

```
Oggetto: Nuovo contatto da {{from_name}}

Messaggio:
Nome: {{from_name}}
Email: {{from_email}}
Azienda: {{company}}
Oggetto: {{subject}}

Messaggio:
{{message}}

---
Inviato dal sito web di Giovanni Pitton
```

4. **Copia il Template ID**

#### Passo 4: Crea Template per Newsletter
1. Crea un altro template:

```
Oggetto: Nuova iscrizione newsletter

Nuova iscrizione alla newsletter:
Nome: {{name}}
Email: {{email}}

---
Inviato dal sito web di Giovanni Pitton
```

2. **Copia il Template ID**

#### Passo 5: Ottieni Public Key
1. Vai su **Account** > **General**
2. **Copia la Public Key**

#### Passo 6: Aggiorna script.js
Apri `script.js` e sostituisci:

```javascript
// Riga 47 - Sostituisci YOUR_PUBLIC_KEY
emailjs.init("LA_TUA_PUBLIC_KEY_QUI");

// Riga 66 - Sostituisci YOUR_SERVICE_ID e YOUR_TEMPLATE_ID
await emailjs.send(
    'IL_TUO_SERVICE_ID_QUI',
    'IL_TUO_TEMPLATE_ID_QUI',
    {
        // ... resto del codice
        to_email: 'tua-email@example.com' // La tua email dove ricevere i messaggi
    }
);

// Riga 110 - Sostituisci per newsletter
await emailjs.send(
    'IL_TUO_SERVICE_ID_NEWSLETTER_QUI', // Può essere lo stesso del contatti
    'IL_TUO_TEMPLATE_ID_NEWSLETTER_QUI',
    {
        // ... resto del codice
        to_email: 'tua-email@example.com'
    }
);
```

### 3. Deploy su GitHub Pages 🚀

#### Opzione A: Repository Dedicato (CONSIGLIATO)

1. **Crea Repository**:
   - Vai su https://github.com/new
   - Nome: `giovannipitton` (o qualsiasi nome)
   - Pubblico o Privato (entrambi funzionano)
   - ✅ Aggiungi README (opzionale)

2. **Carica File** (via web):
   - Nel repository, clicca "uploading an existing file"
   - Trascina TUTTI i file della cartella
   - Commit message: "Initial commit"
   - Clicca "Commit changes"

3. **Attiva GitHub Pages**:
   - Settings > Pages
   - Source: Branch `main`, Folder `/ (root)`
   - Save

4. **Il tuo sito sarà su**:
   - `https://venetostato.github.io/giovannipitton/`

#### Opzione B: Usando Git (DA TERMINALE)

```bash
# Vai nella cartella del progetto
cd C:\Users\stell\gpitton

# Inizializza git
git init

# Aggiungi tutti i file
git add .

# Commit
git commit -m "Initial commit - Sito personale Giovanni Pitton"

# Collega al repository GitHub
git remote add origin https://github.com/VenetoStato/giovannipitton.git

# Push
git branch -M main
git push -u origin main
```

Poi attiva GitHub Pages come sopra.

### 4. Aggiorna URL nel Sito (OPZIONALE)

Se hai un dominio personalizzato o vuoi aggiornare gli URL:

1. **sitemap.xml**: Aggiorna gli URL con il tuo dominio GitHub Pages
2. **index.html**: Aggiorna i meta tag `og:url` e `twitter:url`

### 5. Test del Sito ✅

1. Vai sul tuo sito GitHub Pages
2. Testa tutte le sezioni
3. Prova il modulo contatti (dopo aver configurato EmailJS)
4. Prova la newsletter (dopo aver configurato EmailJS)
5. Controlla che tutti i link funzionino

---

## 🎯 Risultato Finale

- ✅ Sito online e accessibile
- ✅ Modulo contatti funzionante
- ✅ Newsletter funzionante
- ✅ SEO ottimizzato
- ✅ Link a LinkedIn e Meko srl
- ✅ **Costo totale: €0.00** 🎉

---

## 📚 File di Riferimento

- **QUICK_START.md** - Guida rapida 5 minuti
- **DEPLOY.md** - Guida dettagliata al deploy
- **README.md** - Documentazione generale

---

## 🆘 Supporto

Se hai problemi:
1. Controlla la console del browser (F12) per errori
2. Verifica che EmailJS sia configurato correttamente
3. Assicurati che tutti i file siano nella root del repository
4. Controlla che `.nojekyll` sia presente

---

## 🔗 Link Utili

- [Il tuo profilo GitHub](https://github.com/VenetoStato)
- [EmailJS Dashboard](https://dashboard.emailjs.com/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [EmailJS Docs](https://www.emailjs.com/docs/)

---

## ✨ Prossimi Passi (Opzionali)

1. **Dominio Personalizzato**: Se vuoi un dominio (es. giovannipitton.com)
   - Compra un dominio (circa €10-15/anno)
   - Aggiungi file `CNAME` nel repository
   - Configura DNS

2. **Google Analytics**: Traccia i visitatori
   - Crea account Google Analytics
   - Aggiungi script in `index.html`

3. **Google Search Console**: Migliora il SEO
   - Verifica il sito su Google Search Console
   - Invia la sitemap

---

**Buon deploy! 🚀**
