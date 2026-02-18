# 📧 COME LEGGERE I CONTATTI - GUIDA SEMPLICE

## ✅ METODO PIÙ SEMPLICE: CONTROLLA LA TUA EMAIL

**I contatti vengono inviati AUTOMATICAMENTE alla tua email!**

### Dove Arrivano i Contatti?

1. **Email destinazione:** `giovanni.pitton2@gmail.com` (configurata in Vercel)
2. **Oggetto email:** "Nuovo contatto: [Oggetto del messaggio]"
3. **Contenuto:** Nome, email, azienda, messaggio completo

### Dove Arrivano le Iscrizioni Newsletter?

1. **Email destinazione:** `giovanni.pitton2@gmail.com`
2. **Oggetto email:** "Nuova iscrizione newsletter"
3. **Contenuto:** Nome e email dell'iscritto

---

## 🔧 CONFIGURAZIONE IN VERCEL

Vai su **Vercel Dashboard** > **Tuo Progetto** > **Settings** > **Environment Variables**:

```
CONTACT_EMAIL = giovanni.pitton2@gmail.com
NEWSLETTER_EMAIL = giovanni.pitton2@gmail.com
MAILGUN_API_KEY = [configura in Vercel]
MAILGUN_DOMAIN = sandbox.mailgun.org (per test) o tuo dominio verificato
```

---

## 📬 DA CHE INDIRIZZO PARTONO LE EMAIL?

Le email vengono inviate **DA**:
- **Contatti:** `Sito Web <noreply@sandbox.mailgun.org>` (o tuo dominio)
- **Newsletter:** `Newsletter <noreply@sandbox.mailgun.org>` (o tuo dominio)

**IMPORTANTE:** 
- Se usi `sandbox.mailgun.org`, puoi inviare SOLO a email autorizzate in Mailgun
- Per inviare a chiunque, verifica un dominio personalizzato

---

## 🚀 SETUP RAPIDO (2 MINUTI)

1. **Accedi a Mailgun:** https://app.mailgun.com/
2. **Vai su Settings > Authorized Recipients**
3. **Aggiungi:** `giovanni.pitton2@gmail.com`
4. **Copia API Key** da Settings > API Keys
5. **Configura in Vercel** le variabili sopra

**FATTO!** Ora i contatti arrivano alla tua email.

---

## 📊 PER VEDERE TUTTI I CONTATTI

### Opzione 1: Email (Semplice) ✅
Controlla la tua casella email `giovanni.pitton2@gmail.com`

### Opzione 2: Mailgun Dashboard
1. Accedi a https://app.mailgun.com/
2. Vai su **Sending > Logs**
3. Vedi tutte le email inviate con dettagli

### Opzione 3: API (Avanzato)
Usa `/api/get-contacts` con autenticazione (vedi GUIDA_COMPLETA_MAILGUN_E_CONTATTI.md)

---

**Per domande:** Leggi `GUIDA_COMPLETA_MAILGUN_E_CONTATTI.md` per dettagli avanzati
