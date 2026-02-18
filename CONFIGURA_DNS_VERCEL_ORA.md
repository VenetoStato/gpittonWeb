# 🔗 CONFIGURA DNS VERCEL - gpitton.com

## ⚡ SETUP IN 3 PASSI

### Step 1: Aggiungi Dominio in Vercel (2 min)

1. **Vai su:** https://vercel.com/dashboard
2. **Seleziona progetto:** `gpitton-web`
3. **Vai su:** Settings > Domains
4. **Clicca:** Add Domain
5. **Inserisci:** `gpitton.com`
6. **Clicca:** Add

Vercel ti mostrerà i record DNS da aggiungere.

---

### Step 2: Configura DNS in Namecheap (5 min)

**Vai su Namecheap Dashboard** > **Domain List** > **gpitton.com** > **Advanced DNS**

#### RIMUOVI I RECORD ESISTENTI:

1. **Rimuovi:**
   - ❌ CNAME `www` → `parkingpage.namecheap.com.`
   - ❌ URL Redirect `@` → `http://www.gpitton.com/`

#### AGGIUNGI I RECORD VERCEL:

Vercel ti darà qualcosa tipo:

**Opzione A: Nameserver Vercel (Più Semplice) ⭐**

1. **Vai su:** Domain List > gpitton.com > Domain
2. **Trova:** Nameservers
3. **Cambia da "Namecheap BasicDNS" a "Custom DNS"**
4. **Inserisci:**
   ```
   dns1.vercel-dns.com
   dns2.vercel-dns.com
   ```
5. **Salva**

**Opzione B: Record DNS Manuali**

Aggiungi questi record:

```
Tipo: A
Host: @
Valore: 76.76.21.21
TTL: Automatic

Tipo: CNAME
Host: www
Valore: cname.vercel-dns.com
TTL: Automatic
```

**Mantieni:**
- ✅ TXT Record SPF (quello esistente va bene)

---

### Step 3: Attendi e Verifica (1-24 ore)

1. **Attendi:** 1-24 ore (spesso funziona in 1-2 ore)
2. **Vercel Dashboard:** Vedrai "Valid Configuration" quando è pronto
3. **Test:** Vai su `https://gpitton.com` - dovrebbe funzionare!

---

## 📧 POI CONFIGURA MAILGUN (Dopo che Vercel funziona)

### Step 1: Risolvi Problema Mailgun

Il tuo account Mailgun è disabilitato per "exposed credentials". 

**Cosa fare:**
1. **Contatta Mailgun Support:** https://app.mailgun.com/support
2. **Spiega:** "Ho esposto accidentalmente API key in file di documentazione, l'ho rimossa. Posso riattivare l'account?"
3. **Genera nuova API Key** dopo la riattivazione
4. **NON esporre mai più API key in file pubblici!**

### Step 2: Aggiungi Dominio in Mailgun

1. **Vai su:** https://app.mailgun.com/
2. **Sending** > **Domains** > **Add New Domain**
3. **Inserisci:** `gpitton.com`
4. **Scegli:** EU Region
5. **Clicca:** Add Domain

### Step 3: Aggiungi Record DNS Mailgun

Mailgun ti darà record DNS da aggiungere in Namecheap:

**Record TXT (Verifica):**
```
Tipo: TXT
Host: @
Valore: [quello che Mailgun ti dà]
TTL: Automatic
```

**Record CNAME (Tracking):**
```
Tipo: CNAME
Host: email.gpitton.com
Valore: mailgun.org
TTL: Automatic
```

**Aggiungi questi record in Namecheap** (oltre a quelli Vercel)

### Step 4: Configura Vercel

```
MAILGUN_DOMAIN = gpitton.com
MAILGUN_API_KEY = [configura in Vercel]
CONTACT_EMAIL = giovanni.pitton2@gmail.com
NEWSLETTER_EMAIL = giovanni.pitton2@gmail.com
```

---

## ⚠️ SICUREZZA - IMPORTANTE!

**NON esporre mai:**
- ❌ API Key Mailgun
- ❌ Token di autenticazione
- ❌ Password
- ❌ Credenziali

**Dove mettere:**
- ✅ Solo in Vercel Environment Variables
- ✅ Mai in file GitHub pubblici
- ✅ Mai in file di documentazione

**Ho già rimosso le API key esposte dai file!**

---

## ✅ CHECKLIST

- [ ] Dominio aggiunto in Vercel
- [ ] DNS configurato in Namecheap (Nameserver Vercel o record manuali)
- [ ] Dominio funziona su Vercel (verifica con https://gpitton.com)
- [ ] Contattato Mailgun Support per riattivazione
- [ ] Generata nuova API Key Mailgun
- [ ] Dominio aggiunto in Mailgun
- [ ] Record DNS Mailgun aggiunti in Namecheap
- [ ] Variabili configurate in Vercel

---

**Tempo totale:** ~30 minuti (più attesa propagazione DNS)
