# 🚀 STEP BY STEP - COSA FARE ADESSO (Guida Pratica)

## ✅ COSA HAI GIÀ FATTO
- ✅ Account Mailgun creato (Basic 10k - 14€/mese)
- ✅ Sito creato e pronto

## 🎯 COSA FARE ORA (In Ordine)

---

## STEP 1: CONFIGURA MAILGUN (10 minuti)

### 1.1 Accedi a Mailgun
1. Vai su https://app.mailgun.com/
2. Fai login con `giovanni.pitton2@gmail.com`

### 1.2 Ottieni API Key
1. Nel menu a sinistra, clicca **"Sending"** > **"API Keys"**
2. Trova la sezione **"Private API key"**
3. Clicca **"Reveal"** o **"Show"** per vedere la chiave
4. **COPIA LA CHIAVE** (inizia con `key-...`)
5. **SALVALA DA PARTE** - ti servirà dopo!

### 1.3 Verifica Dominio (IMPORTANTE!)

**OPZIONE A: Usa Sandbox (PIÙ VELOCE per iniziare)**
1. Nel menu, vai su **"Sending"** > **"Domains"**
2. Vedi un dominio tipo `sandbox123456.mailgun.org`?
3. ✅ **USA QUESTO per ora** - funziona subito (ma solo per email verificate)
4. **COPIA IL NOME DEL DOMINIO** (es. `sandbox123456.mailgun.org`)

**OPZIONE B: Verifica un Tuo Dominio (MEGLIO per produzione)**
1. Vai su **"Sending"** > **"Domains"** > **"Add New Domain"**
2. Inserisci un dominio che possiedi (es. `giovannipitton.com` o un sottodominio)
3. Seleziona regione **EU** (per GDPR)
4. Mailgun ti darà dei record DNS da aggiungere
5. Vai dal tuo provider DNS (es. Cloudflare, GoDaddy) e aggiungi i record
6. Attendi verifica (1-24 ore, di solito 1-2 ore)

**PER ORA: USA IL SANDBOX per testare subito!**

---

## STEP 2: DEPLOY SU VERCEL (15 minuti)

### 2.1 Crea Account Vercel
1. Vai su https://vercel.com/
2. Clicca **"Sign Up"** (in alto a destra)
3. Clicca **"Continue with GitHub"**
4. Autorizza Vercel ad accedere ai tuoi repository GitHub
5. ✅ Account creato!

### 2.2 Carica il Sito su GitHub (se non l'hai già fatto)

**Se hai già il repository su GitHub, salta questo step!**

1. Vai su https://github.com/new
2. Nome repository: `giovannipitton` (o qualsiasi nome)
3. ✅ Pubblica (public)
4. Clicca **"Create repository"**
5. Nella pagina del repository, clicca **"uploading an existing file"**
6. Trascina TUTTI i file dalla cartella `C:\Users\stell\gpitton`:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `package.json`
   - `vercel.json`
   - Cartella `api/` (con tutti i file dentro)
   - Tutti gli altri file
7. Scorri in basso, scrivi "Initial commit"
8. Clicca **"Commit changes"**

### 2.3 Deploy su Vercel
1. Nel dashboard Vercel, clicca **"Add New Project"**
2. Seleziona il repository GitHub che hai appena creato/aggiornato
3. Vercel rileva automaticamente la configurazione
4. **NON CAMBIARE NULLA** nelle impostazioni
5. Clicca **"Deploy"**
6. Aspetta 1-2 minuti
7. ✅ **SITO ONLINE!** (URL tipo: `https://giovannipitton-xxx.vercel.app`)

---

## STEP 3: CONFIGURA VARIABILI D'AMBIENTE (5 minuti)

### 3.1 Aggiungi Variabili in Vercel
1. Nel progetto Vercel appena deployato, clicca su **"Settings"** (in alto)
2. Nel menu a sinistra, clicca **"Environment Variables"**
3. Aggiungi queste variabili UNA ALLA VOLTA:

**Variabile 1:**
- **Name**: `MAILGUN_API_KEY`
- **Value**: La chiave API che hai copiato prima (inizia con `key-...`)
- ✅ Seleziona: Production, Preview, Development (tutte e tre)
- Clicca **"Save"**

**Variabile 2:**
- **Name**: `MAILGUN_DOMAIN`
- **Value**: Il dominio sandbox (es. `sandbox123456.mailgun.org`) OPPURE il tuo dominio verificato
- ✅ Seleziona: Production, Preview, Development
- Clicca **"Save"**

**Variabile 3:**
- **Name**: `CONTACT_EMAIL`
- **Value**: `giovanni.pitton2@gmail.com` (la tua email)
- ✅ Seleziona: Production, Preview, Development
- Clicca **"Save"**

**Variabile 4:**
- **Name**: `NEWSLETTER_EMAIL`
- **Value**: `giovanni.pitton2@gmail.com` (stessa email)
- ✅ Seleziona: Production, Preview, Development
- Clicca **"Save"**

**Variabile 5:**
- **Name**: `NEWSLETTER_AUTH_TOKEN`
- **Value**: Genera un token casuale lungo (es. `abc123xyz789secret456token789`)
- ✅ Seleziona: Production, Preview, Development
- Clicca **"Save"**

### 3.2 REDEPLOY (IMPORTANTE!)
1. Vai su **"Deployments"** (nel menu a sinistra)
2. Clicca sui **3 puntini** (...) del deployment più recente
3. Clicca **"Redeploy"**
4. ✅ Aspetta che finisca (1-2 minuti)

---

## STEP 4: TEST (5 minuti)

### 4.1 Test Modulo Contatti
1. Vai sul tuo sito Vercel (URL tipo: `https://giovannipitton-xxx.vercel.app`)
2. Scorri fino alla sezione **"Contatti"**
3. Compila il modulo:
   - Nome: Test
   - Email: `giovanni.pitton2@gmail.com`
   - Oggetto: Test
   - Messaggio: Questo è un test
4. Clicca **"Invia Messaggio"**
5. ✅ Dovresti vedere "Messaggio inviato con successo!"
6. Controlla la tua email `giovanni.pitton2@gmail.com` - dovresti ricevere il messaggio!

### 4.2 Test Newsletter
1. Nella stessa pagina, vai al modulo **"Newsletter"**
2. Inserisci un'email di test
3. Clicca **"Iscriviti"**
4. ✅ Dovresti vedere "Iscrizione completata!"
5. Controlla la tua email - dovresti ricevere notifica!

### 4.3 Se Non Funziona
1. Apri la **Console del Browser** (F12 > Console)
2. Controlla se ci sono errori rossi
3. Vai su Vercel > Deployments > Clicca sul deployment > Functions
4. Controlla i log per vedere errori

---

## ✅ CHECKLIST FINALE

- [ ] API Key Mailgun copiata
- [ ] Dominio Mailgun (sandbox o verificato) copiato
- [ ] Account Vercel creato
- [ ] Sito deployato su Vercel
- [ ] 5 variabili d'ambiente aggiunte in Vercel
- [ ] Redeploy fatto dopo le variabili
- [ ] Test modulo contatti OK
- [ ] Test newsletter OK
- [ ] Email ricevute nella casella

---

## 🆘 PROBLEMI COMUNI

### "Email non arrivano"
- ✅ Controlla che il dominio Mailgun sia corretto
- ✅ Se usi sandbox, le email vanno SOLO a indirizzi verificati
- ✅ Controlla spam folder
- ✅ Verifica che `CONTACT_EMAIL` sia corretta

### "Errori 500 nelle API"
- ✅ Controlla che `MAILGUN_API_KEY` sia corretta (inizia con `key-`)
- ✅ Controlla che `MAILGUN_DOMAIN` sia corretto
- ✅ Verifica di aver fatto il REDEPLOY dopo aver aggiunto le variabili
- ✅ Controlla log in Vercel > Deployments > Functions

### "Il sito non si vede"
- ✅ Aspetta 2-3 minuti dopo il deploy
- ✅ Controlla che tutti i file siano stati caricati su GitHub
- ✅ Verifica che il deploy sia completato (spunta verde in Vercel)

---

## 🎉 FATTO!

Dopo questi step avrai:
- ✅ Sito online e funzionante
- ✅ Modulo contatti operativo
- ✅ Newsletter funzionante
- ✅ Sistema per 10.000 email/mese (con il tuo piano Basic 10k)

**COSTO TOTALE: 14€/mese** (solo Mailgun, Vercel è gratis!)

---

## 📞 LINK UTILI

- [Mailgun Dashboard](https://app.mailgun.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Il tuo GitHub](https://github.com/VenetoStato)

**INIZIA DA STEP 1! 🚀**
