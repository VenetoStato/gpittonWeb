# 🚀 ACQUISTA DOMINIO VELOCE - gpitton.it

## ⚡ OPZIONI VELOCI (5-10 MINUTI)

### Opzione 1: Namecheap (Consigliato - Veloce) ⭐

1. **Vai su:** https://www.namecheap.com/
2. **Cerca:** `gpitton.it` nella barra di ricerca
3. **Aggiungi al carrello** e completa l'acquisto (~€10-15/anno)
4. **Tempo:** 5 minuti per acquisto, dominio attivo in 1-2 ore

**Vantaggi:**
- ✅ Prezzi bassi
- ✅ Interfaccia semplice
- ✅ Supporto DNS facile

### Opzione 2: GoDaddy (Popolare)

1. **Vai su:** https://www.godaddy.com/
2. **Cerca:** `gpitton.it`
3. **Acquista** (~€12-20/anno)
4. **Tempo:** 5 minuti

**Vantaggi:**
- ✅ Molto popolare
- ✅ Interfaccia intuitiva

### Opzione 3: Aruba (Italiano)

1. **Vai su:** https://www.aruba.it/
2. **Cerca:** `gpitton.it`
3. **Acquista** (~€10-15/anno)
4. **Tempo:** 5 minuti

**Vantaggi:**
- ✅ Provider italiano
- ✅ Supporto in italiano

### Opzione 4: Cloudflare (Economico)

1. **Vai su:** https://www.cloudflare.com/products/registrar/
2. **Cerca:** `gpitton.it`
3. **Acquista** (~€8-12/anno - più economico!)
4. **Tempo:** 5 minuti

**Vantaggi:**
- ✅ Prezzo più basso
- ✅ DNS veloce incluso
- ✅ SSL gratuito

---

## 🔗 COLLEGARE IL DOMINIO A VERCEL (2 MINUTI)

Dopo aver acquistato il dominio:

### Step 1: Aggiungi Dominio in Vercel

1. **Vai su:** Vercel Dashboard > Tuo Progetto > Settings > Domains
2. **Clicca:** Add Domain
3. **Inserisci:** `gpitton.it`
4. **Clicca:** Add

### Step 2: Configura DNS

Vercel ti darà dei record DNS da aggiungere:

**Opzione A: Nameserver Vercel (Più Semplice)**
```
Vai nel tuo provider dominio (Namecheap, GoDaddy, etc.)
Cambia i Nameserver a quelli che Vercel ti dà:
- dns1.vercel-dns.com
- dns2.vercel-dns.com
```

**Opzione B: Record DNS (Più Controllo)**
```
Aggiungi questi record nel tuo DNS:
Tipo: A
Nome: @
Valore: 76.76.21.21

Tipo: CNAME
Nome: www
Valore: cname.vercel-dns.com
```

### Step 3: Attendi Propagazione

- **Tempo:** 1-24 ore (spesso funziona in 1-2 ore)
- **Verifica:** Vercel ti dirà quando è attivo

---

## 📧 POI CONFIGURA MAILGUN

Dopo che il dominio è attivo su Vercel:

1. **Vai su Mailgun:** https://app.mailgun.com/
2. **Aggiungi dominio:** `gpitton.it`
3. **Aggiungi record DNS** che Mailgun ti dà
4. **Configura in Vercel:**
   ```
   MAILGUN_DOMAIN = gpitton.it
   ```

---

## ⚡ ALTERNATIVA VELOCE (Senza Acquistare Dominio)

Se vuoi iniziare SUBITO senza acquistare:

### Usa Sottodominio Vercel (GRATIS)

1. **Vercel Dashboard** > Settings > Domains
2. **Aggiungi:** `gpitton-web.vercel.app` (già disponibile!)
3. **Per Mailgun:** Usa `sandbox.mailgun.org` temporaneamente
4. **Configura:**
   ```
   MAILGUN_DOMAIN = sandbox.mailgun.org
   ```

**Limite:** Con sandbox puoi inviare SOLO a email autorizzate in Mailgun.

---

## 💰 COSTI

- **Dominio:** ~€10-15/anno
- **Vercel:** GRATIS
- **Mailgun:** ~€14/mese (piano Basic 10k)
- **TOTALE:** ~€10-15/anno + €14/mese

---

## 🎯 RACCOMANDAZIONE

**Per iniziare velocemente:**
1. Acquista dominio su **Namecheap** o **Cloudflare** (5 min)
2. Collega a Vercel (2 min)
3. Configura Mailgun (5 min)
4. **TOTALE: ~15 minuti**

**Per iniziare SUBITO senza costi:**
- Usa `sandbox.mailgun.org` temporaneamente
- Acquista dominio quando vuoi
- Cambia `MAILGUN_DOMAIN` in Vercel quando è pronto

---

## 📞 SUPPORTO

Se hai problemi:
- **Vercel:** Dashboard > Help
- **Mailgun:** Dashboard > Support
- **Provider dominio:** Supporto del provider
