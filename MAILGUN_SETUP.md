# 📧 Setup Mailgun - Guida Completa per 20.000+ Email/Mese

## 💰 Confronto Costi Email Service

| Servizio | Piano | Email/Mese | Costo/Mese | Migliore per |
|----------|-------|------------|-------------|--------------|
| **Mailgun** | Foundation | 50.000 | $35 (~€32) | ✅ **CONSIGLIATO** - Prezzo/performance |
| **Mailgun** | Growth | 100.000 | $80 (~€73) | Volume molto alto |
| **SendGrid** | Essentials | 50.000 | $19.95 (~€18) | Budget limitato |
| **SendGrid** | Pro | 100.000 | $89.95 (~€82) | Features avanzate |
| **Postmark** | - | 10.000 | $15 (~€14) | ❌ Non abbastanza |
| EmailJS | Free | 200 | €0 | Solo test |

**Raccomandazione per 20.000 email/mese:**
- **Mailgun Foundation** ($35/mese) - Migliore rapporto qualità/prezzo
- **SendGrid Essentials** ($19.95/mese) - Più economico ma meno features

---

## 🚀 Setup Mailgun (Passo-Passo)

### Passo 1: Crea Account Mailgun

1. Vai su https://www.mailgun.com/
2. Clicca **"Sign Up"** (in alto a destra)
3. Compila il form:
   - Email
   - Password
   - Nome azienda (puoi mettere il tuo nome)
4. Verifica l'email

### Passo 2: Verifica il Tuo Dominio

**IMPORTANTE**: Mailgun richiede un dominio verificato per inviare email.

#### Opzione A: Usa un Dominio che Hai Già

1. Nel dashboard Mailgun, vai su **Sending** > **Domains**
2. Clicca **Add New Domain**
3. Inserisci il tuo dominio (es. `giovannipitton.com` o `mekosrl.com`)
4. Seleziona la regione (EU consigliato per GDPR)
5. Mailgun ti darà dei record DNS da aggiungere:
   - **TXT record** per verifica
   - **MX records** (opzionale, per ricevere email)
   - **CNAME records** per tracking
6. Aggiungi questi record nel tuo provider DNS (es. Cloudflare, GoDaddy)
7. Attendi la verifica (può richiedere fino a 48h, di solito 1-2h)

#### Opzione B: Usa il Dominio Sandbox (Solo per Test)

Mailgun offre un dominio sandbox (es. `sandbox123.mailgun.org`) che funziona immediatamente MA:
- ⚠️ Le email vanno solo a indirizzi verificati
- ⚠️ Non adatto per produzione
- ✅ Perfetto per test iniziali

### Passo 3: Ottieni API Key

1. Nel dashboard, vai su **Sending** > **API Keys**
2. Copia la **Private API Key** (inizia con `key-...`)
3. **NON CONDIVIDERE MAI QUESTA CHIAVE!**

### Passo 4: Scegli il Piano

1. Vai su **Billing** > **Plans**
2. Per 20.000 email/mese, scegli:
   - **Foundation Plan** ($35/mese) - 50.000 email/mese
   - Oppure **Growth Plan** ($80/mese) - 100.000 email/mese se prevedi crescita

---

## 🔧 Configurazione Vercel (Hosting + Backend GRATIS)

### Passo 1: Crea Account Vercel

1. Vai su https://vercel.com/
2. Clicca **"Sign Up"**
3. Connetti il tuo account GitHub (consigliato)
4. Autorizza Vercel ad accedere ai tuoi repository

### Passo 2: Deploy del Sito

1. Nel dashboard Vercel, clicca **"Add New Project"**
2. Seleziona il repository GitHub con il sito
3. Vercel rileva automaticamente la configurazione
4. Clicca **"Deploy"**
5. Il sito sarà online in 1-2 minuti!

### Passo 3: Configura Variabili d'Ambiente

1. Nel progetto Vercel, vai su **Settings** > **Environment Variables**
2. Aggiungi queste variabili:

```
MAILGUN_API_KEY = [configura in Vercel - non esporre]
MAILGUN_DOMAIN = tuo-dominio.com (o sandbox.mailgun.org per test)
CONTACT_EMAIL = tua-email@example.com
NEWSLETTER_EMAIL = tua-email@example.com (o stessa di CONTACT_EMAIL)
NEWSLETTER_AUTH_TOKEN = un-token-segreto-a-caso-lungo-e-sicuro
```

3. Clicca **Save**
4. **Redeploy** il progetto (Settings > Deployments > Redeploy)

---

## 📝 Test del Sistema

### Test Modulo Contatti

1. Vai sul tuo sito
2. Compila il modulo contatti
3. Invia
4. Controlla la tua email (dovresti ricevere il messaggio)

### Test Newsletter

1. Iscriviti alla newsletter dal sito
2. Controlla la tua email (dovresti ricevere notifica)

### Test Invio Massivo (Opzionale)

Usa questo script per testare l'invio massivo:

```javascript
// Test script - Esegui dalla console del browser (solo per test!)
fetch('https://tuo-sito.vercel.app/api/send-bulk-newsletter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer IL_TUO_NEWSLETTER_AUTH_TOKEN'
  },
  body: JSON.stringify({
    recipients: ['email1@example.com', 'email2@example.com'],
    subject: 'Test Newsletter',
    htmlContent: '<h1>Test</h1><p>Questa è una newsletter di test</p>',
    textContent: 'Test - Questa è una newsletter di test'
  })
})
.then(r => r.json())
.then(console.log);
```

---

## 🎯 Invio Newsletter Massiva

### Metodo 1: Usando l'API Direttamente

```javascript
// Esempio: Invia newsletter a 1000 destinatari
const recipients = ['email1@example.com', 'email2@example.com', ...]; // Array di email

fetch('https://tuo-sito.vercel.app/api/send-bulk-newsletter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer IL_TUO_NEWSLETTER_AUTH_TOKEN'
  },
  body: JSON.stringify({
    recipients: recipients,
    subject: 'Newsletter Robotica e AI - Gennaio 2026',
    htmlContent: `
      <html>
        <body>
          <h1>Newsletter Robotica e AI</h1>
          <p>Contenuto della newsletter...</p>
          <a href="https://www.linkedin.com/in/giovannipitton/">LinkedIn</a>
        </body>
      </html>
    `,
    textContent: 'Newsletter Robotica e AI - Contenuto...'
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

### Metodo 2: Script Node.js (per Automazione)

Crea un file `send-newsletter.js`:

```javascript
const fetch = require('node-fetch');

const API_URL = 'https://tuo-sito.vercel.app/api/send-bulk-newsletter';
const AUTH_TOKEN = 'IL_TUO_NEWSLETTER_AUTH_TOKEN';

// Leggi lista email da file CSV o database
const recipients = [
  'email1@example.com',
  'email2@example.com',
  // ... altre email
];

async function sendNewsletter() {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    },
    body: JSON.stringify({
      recipients: recipients,
      subject: 'Newsletter Robotica e AI',
      htmlContent: '<h1>Contenuto newsletter</h1>',
      textContent: 'Contenuto newsletter'
    })
  });

  const data = await response.json();
  console.log('Result:', data);
}

sendNewsletter();
```

Esegui: `node send-newsletter.js`

---

## 💡 Best Practices

### 1. Rate Limiting
- Mailgun ha limiti di rate (circa 1000 email/secondo)
- Il codice gestisce automaticamente i batch
- Non inviare più di 50.000 email in un'ora

### 2. Lista Email Pulita
- Rimuovi email duplicate
- Verifica che le email siano valide
- Rispetta le leggi anti-spam (GDPR, CAN-SPAM)

### 3. Template Email
- Usa HTML responsive
- Includi sempre versione testo
- Aggiungi link unsubscribe
- Testa su diversi client email

### 4. Monitoraggio
- Controlla il dashboard Mailgun per statistiche
- Monitora bounce rate e spam complaints
- Mantieni bounce rate < 5%

---

## 🔒 Sicurezza

1. **Mai esporre API Key nel frontend**
   - ✅ Usa sempre serverless functions (come abbiamo fatto)
   - ❌ Non mettere API key in `script.js`

2. **Proteggi l'endpoint bulk**
   - ✅ Usa `NEWSLETTER_AUTH_TOKEN` (come abbiamo fatto)
   - ❌ Non permettere invii senza autenticazione

3. **Validazione Input**
   - ✅ Il codice valida email e campi obbligatori
   - ✅ Protezione contro injection

---

## 📊 Monitoraggio e Statistiche

### Dashboard Mailgun

1. Vai su https://app.mailgun.com/
2. Sezione **Analytics** mostra:
   - Email inviate
   - Email consegnate
   - Bounce rate
   - Click rate
   - Open rate

### Log Vercel

1. Nel dashboard Vercel, vai su **Deployments**
2. Clicca su un deployment
3. Vai su **Functions** per vedere i log delle API

---

## 🆘 Troubleshooting

### Email non arrivano

1. **Controlla dominio verificato**: Settings > Domains
2. **Verifica DNS records**: Devono essere corretti
3. **Controlla spam folder**: Le email potrebbero finire lì
4. **Verifica API key**: Deve essere corretta in Vercel

### Errori 401/403

- Verifica `NEWSLETTER_AUTH_TOKEN` se usi bulk send
- Controlla che l'header Authorization sia corretto

### Rate Limit Exceeded

- Aspetta qualche minuto
- Riduci la dimensione dei batch
- Considera di distribuire l'invio nel tempo

---

## 💰 Costi Finali

| Servizio | Costo/Mese |
|----------|------------|
| **Vercel Hosting** | €0 (GRATIS) |
| **Vercel Serverless Functions** | €0 (GRATIS fino a 100GB) |
| **Mailgun Foundation** | ~€32 ($35) |
| **TOTALE** | **~€32/mese** |

Per 20.000 email/mese, questa è la soluzione più economica e stabile! 🎉

---

## 🔗 Link Utili

- [Mailgun Dashboard](https://app.mailgun.com/)
- [Mailgun Documentation](https://documentation.mailgun.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)

---

## ✅ Checklist Setup

- [ ] Account Mailgun creato
- [ ] Dominio verificato (o sandbox per test)
- [ ] API Key ottenuta
- [ ] Piano Mailgun attivato
- [ ] Account Vercel creato
- [ ] Sito deployato su Vercel
- [ ] Variabili d'ambiente configurate
- [ ] Test modulo contatti funzionante
- [ ] Test newsletter funzionante
- [ ] Test invio massivo (opzionale)

**Tutto pronto! 🚀**
