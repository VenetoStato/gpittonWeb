# 🚀 SETUP DOMINIO MAILGUN VELOCE - gpitton.it

## ⚡ SETUP IN 5 MINUTI

### Step 1: Verifica Dominio in Mailgun

1. **Accedi a Mailgun:** https://app.mailgun.com/
2. **Vai su:** Sending > Domains > Add New Domain
3. **Inserisci:** `gpitton.it` (o `mg.gpitton.it` per sottodominio)
4. **Scegli:** EU Region (per GDPR)
5. **Clicca:** Add Domain

### Step 2: Aggiungi Record DNS

Mailgun ti darà questi record da aggiungere al tuo dominio:

#### Record TXT (Verifica)
```
Tipo: TXT
Nome: @ (o gpitton.it)
Valore: [quello che Mailgun ti dà]
TTL: 3600
```

#### Record MX (Ricezione email - opzionale)
```
Tipo: MX
Nome: @
Valore: mxa.mailgun.org (Priority 10)
TTL: 3600
```

#### Record CNAME (Tracking - opzionale)
```
Tipo: CNAME
Nome: email.gpitton.it
Valore: mailgun.org
TTL: 3600
```

### Step 3: Aggiungi Record nel Tuo DNS Provider

**Dove aggiungere i record:**
- Se hai il dominio su **GoDaddy, Namecheap, Aruba, etc.**
- Vai su **Gestione DNS** o **DNS Management**
- Aggiungi i record sopra

**ATTENZIONE:** La propagazione DNS può richiedere 24-48 ore, ma spesso funziona in 1-2 ore.

### Step 4: Verifica in Mailgun

1. Torna su Mailgun Dashboard
2. Clicca su **Verify DNS Settings**
3. Attendi che tutti i record risultino verificati (spunta verde)

### Step 5: Configura Vercel

Vai su **Vercel Dashboard** > **Tuo Progetto** > **Settings** > **Environment Variables**:

```
MAILGUN_DOMAIN = gpitton.it
MAILGUN_API_KEY = [configura in Vercel]
CONTACT_EMAIL = giovanni.pitton2@gmail.com
NEWSLETTER_EMAIL = giovanni.pitton2@gmail.com
```

**IMPORTANTE:** Usa `gpitton.it` (senza http:// o altro)

---

## 🎯 RISULTATO

Dopo la configurazione, le email partiranno da:
- **Contatti:** `Sito Web <noreply@gpitton.it>`
- **Newsletter:** `Newsletter <noreply@gpitton.it>`

---

## ⚠️ SE NON HAI ANCORA IL DOMINIO gpitton.it

### Opzione 1: Acquista il Dominio

1. **Registra su:** GoDaddy, Namecheap, Aruba, etc.
2. **Costo:** ~€10-15/anno
3. **Poi segui** gli step sopra

### Opzione 2: Usa Sottodominio (Più Veloce)

Se hai già un dominio, usa un sottodominio:
- **Esempio:** `mg.gpitton.it` o `mail.gpitton.it`
- **Vantaggio:** Non devi cambiare i record principali del dominio
- **Procedura:** Stessa di sopra, ma usa il sottodominio

---

## 🔧 TROUBLESHOOTING

**"Domain not verified"?**
- Attendi 1-2 ore per propagazione DNS
- Verifica che i record siano corretti
- Controlla che non ci siano errori di digitazione

**"Email non partono"?**
- Verifica che `MAILGUN_DOMAIN` in Vercel sia esattamente `gpitton.it` (senza spazi, senza http://)
- Controlla i logs in Vercel Dashboard > Functions > Logs

---

## 📞 SUPPORTO

Se hai problemi, controlla:
- Mailgun Dashboard > Sending > Logs (vedi errori)
- Vercel Dashboard > Functions > Logs (vedi errori API)
