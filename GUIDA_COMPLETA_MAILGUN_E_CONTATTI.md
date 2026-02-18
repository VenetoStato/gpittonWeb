# 📧 GUIDA COMPLETA: Mailgun e Lettura Contatti

## 🎯 COME FUNZIONA IL SISTEMA

### 1. **Invio Email tramite Mailgun**

Quando qualcuno compila i moduli (contatti o newsletter), il sistema:
1. Invia una email **alla tua casella email** (configurata in Vercel)
2. L'email viene inviata **tramite Mailgun** usando il tuo dominio

---

## ⚙️ CONFIGURAZIONE MAILGUN

### Step 1: Verifica il Tuo Dominio in Mailgun

1. Accedi a [Mailgun Dashboard](https://app.mailgun.com/)
2. Vai su **Sending** > **Domains**
3. Aggiungi il tuo dominio (es: `gpitton-web.vercel.app` o un dominio personalizzato)
4. Mailgun ti darà dei **record DNS** da aggiungere:
   - Record TXT per verifica dominio
   - Record MX per ricevere email
   - Record CNAME per tracking

### Step 2: Configura Variabili in Vercel

Vai su **Vercel Dashboard** > **Tuo Progetto** > **Settings** > **Environment Variables**:

```
MAILGUN_API_KEY = [configura in Vercel - non esporre]
MAILGUN_DOMAIN = il_tuo_dominio_verificato (es: mg.gpitton-web.vercel.app o sandbox.mailgun.org per test)
CONTACT_EMAIL = giovanni.pitton2@gmail.com
NEWSLETTER_EMAIL = giovanni.pitton2@gmail.com
```

**IMPORTANTE:**
- `MAILGUN_DOMAIN` deve essere il dominio verificato in Mailgun
- Per test iniziali, puoi usare `sandbox.mailgun.org` (gratis, ma limitato)
- Per produzione, verifica un dominio personalizzato

---

## 📬 DA CHE INDIRIZZO PARTONO LE EMAIL?

Le email vengono inviate **DA**:
- **Contatti**: `Sito Web <noreply@MAILGUN_DOMAIN>`
- **Newsletter**: `Newsletter <noreply@MAILGUN_DOMAIN>`

**ESEMPIO:**
- Se `MAILGUN_DOMAIN = sandbox.mailgun.org`
- Le email partono da: `noreply@sandbox.mailgun.org`

**ATTENZIONE:** Con il dominio sandbox, puoi inviare SOLO a indirizzi email autorizzati in Mailgun!

---

## 📥 COME LEGGERE I CONTATTI

### Metodo 1: Email (Semplice) ✅ **CONSIGLIATO**

**I contatti vengono inviati automaticamente alla tua email:**
- Email: `giovanni.pitton2@gmail.com` (configurata in `CONTACT_EMAIL`)
- Oggetto: "Nuovo contatto: [Oggetto del messaggio]"
- Contenuto: Nome, email, azienda, messaggio completo

**Vantaggi:**
- ✅ Funziona subito
- ✅ Notifiche immediate
- ✅ Nessuna configurazione aggiuntiva

### Metodo 2: API Get Contacts (Avanzato)

Ho creato un'API: `/api/get-contacts`

**Come usare:**

1. **Configura token in Vercel:**
   ```
   NEWSLETTER_AUTH_TOKEN = un_token_sicuro_a_tua_scelta
   ```

2. **Chiama l'API:**
   ```javascript
   fetch('https://gpitton-web.vercel.app/api/get-contacts', {
     headers: {
       'Authorization': 'Bearer IL_TUO_TOKEN'
     }
   })
   .then(response => response.json())
   .then(data => console.log(data.contacts));
   ```

**Nota:** Questo metodo funziona solo se hai un dominio verificato in Mailgun e abilitato gli eventi.

### Metodo 3: Dashboard Mailgun

1. Accedi a [Mailgun Dashboard](https://app.mailgun.com/)
2. Vai su **Sending** > **Logs**
3. Vedi tutte le email inviate con dettagli completi

---

## 🚀 SETUP RAPIDO (5 MINUTI)

### 1. Mailgun Sandbox (Per Test)

1. Accedi a [Mailgun](https://app.mailgun.com/)
2. Vai su **Sending** > **Domains**
3. Usa il dominio **sandbox** già disponibile
4. Aggiungi la tua email agli **Authorized Recipients** (Settings > Authorized Recipients)
5. Copia l'**API Key** da Settings > API Keys

### 2. Configura Vercel

```
MAILGUN_API_KEY = [configura in Vercel]
MAILGUN_DOMAIN = sandbox.mailgun.org
CONTACT_EMAIL = giovanni.pitton2@gmail.com
NEWSLETTER_EMAIL = giovanni.pitton2@gmail.com
```

### 3. Test

Compila il form contatti sul sito e verifica che arrivi l'email!

---

## 📊 PER VOLUMI ALTI (20.000+ email/mese)

### Opzione A: Database Airtable (GRATIS fino a 1200 record)

1. Crea account su [Airtable](https://airtable.com/)
2. Crea base "Contatti"
3. Modifica `/api/send-contact.js` per salvare anche su Airtable

### Opzione B: Google Sheets (GRATIS)

1. Crea Google Sheet
2. Usa Google Apps Script per ricevere webhook
3. I contatti si salvano automaticamente

---

## ❓ DOMANDE FREQUENTI

**Q: Con che dominio invio le email?**
A: Usa il dominio configurato in `MAILGUN_DOMAIN`. Per test: `sandbox.mailgun.org`. Per produzione: verifica un dominio personalizzato.

**Q: Dove arrivano i contatti?**
A: Alla email configurata in `CONTACT_EMAIL` (giovanni.pitton2@gmail.com)

**Q: Come vedo tutti i contatti?**
A: Controlla la tua email o usa l'API `/api/get-contacts` con autenticazione.

**Q: Posso inviare newsletter massiva?**
A: Sì! Usa `/api/send-bulk-newsletter.js` con lista email. Mailgun supporta fino a 50.000 email/mese nel piano Basic.

---

## 🔧 TROUBLESHOOTING

**Email non arrivano?**
- Verifica che `CONTACT_EMAIL` sia configurato correttamente
- Controlla che `MAILGUN_API_KEY` sia valida
- Se usi sandbox, aggiungi la tua email agli Authorized Recipients
- Controlla i logs in Mailgun Dashboard

**Errore "Domain not verified"?**
- Verifica il dominio in Mailgun Dashboard
- Aggiungi i record DNS richiesti
- Attendi la propagazione DNS (può richiedere 24-48 ore)

---

**Per supporto:** Controlla i logs in Vercel Dashboard > Functions > Logs
