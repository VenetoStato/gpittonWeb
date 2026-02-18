# 📧 CONFIGURA MAILGUN - gpitton.com

## ⚠️ STEP 1: RISOLVI ACCOUNT DISABILITATO (URGENTE)

Il tuo account Mailgun è disabilitato per "exposed credentials".

### Cosa Fare:

1. **Contatta Mailgun Support:**
   - Vai su: https://app.mailgun.com/support
   - Oppure: support@mailgun.com
   - Oppure: Live Chat (se disponibile)

2. **Messaggio da Inviare:**
   ```
   Salve,
   
   Il mio account è stato disabilitato per "exposed credentials".
   Ho accidentalmente esposto l'API key in file di documentazione su GitHub,
   ma l'ho già rimossa completamente dal repository.
   
   Posso riattivare l'account? Genererò una nuova API key dopo la riattivazione.
   
   Grazie,
   Giovanni Pitton
   ```

3. **Dopo la Riattivazione:**
   - Genera una **NUOVA API Key** (la vecchia è compromessa)
   - Vai su: Settings > API Keys
   - Clicca: Create API Key
   - Copia la nuova key (inizia con `key-...`)

---

## 🚀 STEP 2: AGGIUNGI DOMINIO IN MAILGUN (5 min)

### 2.1: Aggiungi Dominio

1. **Vai su:** https://app.mailgun.com/
2. **Sending** > **Domains** > **Add New Domain**
3. **Inserisci:** `gpitton.com`
4. **Scegli:** EU Region (per GDPR)
5. **Clicca:** Add Domain

### 2.2: Mailgun Ti Darà Record DNS

Mailgun ti mostrerà record DNS da aggiungere, tipo:

**Record TXT (Verifica):**
```
Tipo: TXT
Host: @
Valore: [quello che Mailgun ti dà, tipo: mailgun-verification=xxxxx]
TTL: Automatic
```

**Record CNAME (Tracking - Opzionale ma Consigliato):**
```
Tipo: CNAME
Host: email.gpitton.com
Valore: mailgun.org
TTL: Automatic
```

**Record MX (Ricezione - Opzionale):**
```
Tipo: MX
Host: @
Valore: mxa.mailgun.org (Priority 10)
TTL: Automatic
```

---

## 🔧 STEP 3: AGGIUNGI RECORD DNS IN NAMECHEAP (5 min)

### 3.1: Vai su Namecheap Advanced DNS

1. **Namecheap Dashboard** > **Domain List** > **gpitton.com** > **Advanced DNS**

### 3.2: Aggiungi Record Mailgun

**Aggiungi questi record (oltre a quelli Vercel esistenti):**

1. **TXT Record (Verifica Mailgun):**
   - Clicca: "Add New Record"
   - Tipo: TXT
   - Host: @
   - Valore: [quello che Mailgun ti dà]
   - TTL: Automatic
   - Salva

2. **CNAME Record (Tracking):**
   - Clicca: "Add New Record"
   - Tipo: CNAME
   - Host: email
   - Valore: mailgun.org
   - TTL: Automatic
   - Salva

**IMPORTANTE:** Mantieni anche i record Vercel esistenti:
- ✅ A Record `@` → `216.198.79.1`
- ✅ CNAME `www` → `cname.vercel-dns.com`

### 3.3: Record DNS Finali (Namecheap)

Dovresti avere:

```
✅ A Record (Vercel)
   Host: @
   Valore: 216.198.79.1

✅ CNAME Record (Vercel)
   Host: www
   Valore: cname.vercel-dns.com

✅ TXT Record (SPF - esistente)
   Host: @
   Valore: v=spf1 include:spf.efwd.registrar-servers.com ~all

✅ TXT Record (Mailgun Verifica - NUOVO)
   Host: @
   Valore: [quello che Mailgun ti dà]

✅ CNAME Record (Mailgun Tracking - NUOVO)
   Host: email
   Valore: mailgun.org
```

---

## ✅ STEP 4: VERIFICA IN MAILGUN (5 min)

1. **Torna su Mailgun Dashboard**
2. **Clicca:** "Verify DNS Settings" sul dominio `gpitton.com`
3. **Attendi:** Che tutti i record risultino verificati (spunta verde)
   - **Tempo:** 1-24 ore (spesso 1-2 ore)

---

## ⚙️ STEP 5: CONFIGURA VERCEL (2 min)

### 5.1: Vai su Vercel Environment Variables

1. **Vercel Dashboard** > **gpitton-web** > **Settings** > **Environment Variables**

### 5.2: Aggiungi/Modifica Variabili

**Aggiungi o Modifica:**

```
MAILGUN_DOMAIN = gpitton.com
MAILGUN_API_KEY = [configura in Vercel]
CONTACT_EMAIL = giovanni.pitton2@gmail.com
NEWSLETTER_EMAIL = giovanni.pitton2@gmail.com
```

**IMPORTANTE:**
- `MAILGUN_DOMAIN` deve essere esattamente `gpitton.com` (senza http://, senza www)
- `MAILGUN_API_KEY` deve essere la NUOVA key generata dopo riattivazione

### 5.3: Redeploy

1. **Vai su:** Deployments
2. **Clicca:** 3 puntini (...) sul deployment più recente
3. **Clicca:** Redeploy
4. **Attendi:** 1-2 minuti

---

## 🎯 RISULTATO FINALE

Dopo la configurazione, le email partiranno da:
- **Contatti:** `Sito Web <noreply@gpitton.com>`
- **Newsletter:** `Newsletter <noreply@gpitton.com>`

E arriveranno a: `giovanni.pitton2@gmail.com`

---

## ✅ CHECKLIST COMPLETA

- [ ] Contattato Mailgun Support per riattivazione
- [ ] Account Mailgun riattivato
- [ ] Generata nuova API Key Mailgun
- [ ] Aggiunto dominio `gpitton.com` in Mailgun
- [ ] Aggiunto TXT Record verifica in Namecheap
- [ ] Aggiunto CNAME Record tracking in Namecheap
- [ ] Verificato dominio in Mailgun (spunta verde)
- [ ] Configurato variabili in Vercel
- [ ] Fatto redeploy su Vercel
- [ ] Testato form contatti (dovrebbe funzionare!)

---

## 🔍 TROUBLESHOOTING

**"Domain not verified" in Mailgun?**
- Attendi 1-2 ore per propagazione DNS
- Verifica che i record siano corretti in Namecheap
- Controlla che non ci siano errori di digitazione

**Email non partono?**
- Verifica che `MAILGUN_DOMAIN = gpitton.com` in Vercel (senza spazi, senza http://)
- Verifica che `MAILGUN_API_KEY` sia la nuova key (dopo riattivazione)
- Controlla logs in Vercel Dashboard > Functions > Logs
- Controlla logs in Mailgun Dashboard > Sending > Logs

**"Invalid API Key"?**
- Assicurati di usare la NUOVA API Key (dopo riattivazione)
- La vecchia key è compromessa e non funziona più

---

**Tempo totale:** ~30 minuti (più attesa propagazione DNS e riattivazione Mailgun)
