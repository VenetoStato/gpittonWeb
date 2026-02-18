# 📧 Setup Resend con gpitton.com

**Resend:** 3000 email/mese GRATIS, 1 dominio personalizzato incluso.  
Quando Mailgun sarà riattivato, imposta `EMAIL_PROVIDER=mailgun` per tornare indietro.

---

## STEP 1: Account Resend (2 min)

1. Vai su **https://resend.com**
2. Clicca **Sign up** (gratis, no carta di credito)
3. Verifica l'email

---

## STEP 2: API Key (1 min)

1. **Resend Dashboard** → **API Keys** → **Create API Key**
2. Nome: `gpitton-website`
3. Copia la key (inizia con `re_...`) — **salvala**, non la rivedrai più

---

## STEP 3: Aggiungi dominio gpitton.com (3 min)

1. **Resend Dashboard** → **Domains** → **Add Domain**
2. Inserisci: `gpitton.com`
3. Clicca **Add**
4. Resend mostrerà i record DNS da aggiungere (DKIM e SPF)

---

## STEP 4: DNS in Namecheap (5 min)

Vai su **Namecheap** → **Domain List** → **gpitton.com** → **Advanced DNS**

### Record da aggiungere (Resend te li mostra, qui un esempio):

**1. Record DKIM (CNAME)**  
Resend mostra qualcosa tipo:
```
Tipo: CNAME
Host: resend._domainkey
Valore: [qualcosa tipo] resend._domainkey.resend.com
TTL: Automatic
```

**2. Record SPF (TXT)**  
Se hai già un record SPF per `@`, **modificalo** per includere Resend:
```
Tipo: TXT
Host: @
Valore: v=spf1 include:_spf.resend.com ~all
```
Se hai altri `include:` (es. Mailgun), uniscili:  
`v=spf1 include:_spf.resend.com include:mailgun.org ~all`

**3. (Opzionale) Record Return-Path**  
Resend può mostrarti un CNAME per `send` o simile — aggiungilo se indicato.

---

## STEP 5: Verifica dominio in Resend

1. Torna su **Resend** → **Domains** → **gpitton.com**
2. Clicca **Verify DNS Records**
3. Attendi 5 min - 2 ore (propagazione DNS)
4. Quando vedi ✅ **Verified**, puoi usare `noreply@gpitton.com`

**Prima della verifica** puoi usare `onboarding@resend.dev` per testare (le email partono da Resend, non da gpitton.com).

---

## STEP 6: Variabili in Vercel

1. **Vercel** → **gpitton-web** → **Settings** → **Environment Variables**

2. **Aggiungi/Modifica:**

| Nome | Valore | Note |
|------|--------|------|
| `RESEND_API_KEY` | `re_xxxxx...` | La key copiata da Resend |
| `EMAIL_FROM` | `Sito Web <noreply@gpitton.com>` | Dopo verifica dominio |
| `CONTACT_EMAIL` | `giovanni.pitton2@gmail.com` | Dove arrivano i contatti |
| `NEWSLETTER_EMAIL` | `giovanni.pitton2@gmail.com` | Dove arrivano le iscrizioni |
| `EMAIL_PROVIDER` | `resend` | Default, lascia così |

**Prima che gpitton.com sia verificato**, usa:
```
EMAIL_FROM = Sito Web <onboarding@resend.dev>
```

3. **Redeploy:** Deployments → ... → Redeploy

---

## ✅ Test

1. Vai su **gpitton.com** (o gpitton.vercel.app)
2. Compila il form contatti
3. Controlla **giovanni.pitton2@gmail.com** — dovresti ricevere l’email

---

## 🔄 Tornare a Mailgun (quando riattivato)

1. **Vercel** → Environment Variables
2. Imposta: `EMAIL_PROVIDER` = `mailgun`
3. Assicurati di avere: `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `CONTACT_EMAIL`
4. **Redeploy**

I form useranno di nuovo Mailgun senza modificare il codice.

---

## 📍 Dove vedi i contatti

- **Gmail:** `giovanni.pitton2@gmail.com` — ogni messaggio arriva lì
- **Resend Dashboard** → **Emails** → log di tutte le email inviate

---

## ⚠️ Limiti Resend (piano gratuito)

- 3000 email/mese
- Max 100 email/giorno
- 1 dominio (gpitton.com)

Per volumi maggiori (es. 20.000/mese) o newsletter massiva (>100/giorno) userai Mailgun quando sarà di nuovo attivo.
