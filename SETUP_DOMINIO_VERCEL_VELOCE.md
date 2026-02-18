# 🔗 COLLEGA DOMINIO A VERCEL - GUIDA VELOCE

## ⚡ SETUP IN 3 PASSI

### Step 1: Acquista Dominio (5 min)

**Consigliato:** Namecheap o Cloudflare
- Namecheap: https://www.namecheap.com/
- Cloudflare: https://www.cloudflare.com/products/registrar/

Cerca `gpitton.it` e acquista (~€10-15/anno)

---

### Step 2: Aggiungi Dominio in Vercel (2 min)

1. **Vai su:** https://vercel.com/dashboard
2. **Seleziona progetto:** `gpitton-web`
3. **Vai su:** Settings > Domains
4. **Clicca:** Add Domain
5. **Inserisci:** `gpitton.it`
6. **Clicca:** Add

---

### Step 3: Configura DNS (5 min)

Vercel ti mostrerà i record DNS da aggiungere.

#### Opzione A: Nameserver Vercel (Più Semplice) ⭐

1. **Vai nel tuo provider dominio** (Namecheap, GoDaddy, etc.)
2. **Trova:** DNS Settings o Nameservers
3. **Cambia a:**
   ```
   dns1.vercel-dns.com
   dns2.vercel-dns.com
   ```
4. **Salva**

**Vantaggio:** Vercel gestisce tutto automaticamente!

#### Opzione B: Record DNS Manuali

Aggiungi questi record nel tuo DNS provider:

```
Tipo: A
Nome: @
Valore: 76.76.21.21
TTL: Auto

Tipo: CNAME
Nome: www
Valore: cname.vercel-dns.com
TTL: Auto
```

---

## ✅ VERIFICA

1. **Attendi:** 1-24 ore (spesso 1-2 ore)
2. **Vercel Dashboard:** Vedrai "Valid Configuration" quando è pronto
3. **Test:** Vai su `https://gpitton.it` - dovrebbe funzionare!

---

## 📧 POI CONFIGURA MAILGUN

Dopo che il dominio funziona su Vercel:

1. **Mailgun:** Aggiungi dominio `gpitton.it`
2. **Aggiungi record DNS** che Mailgun ti dà
3. **Vercel Environment Variables:**
   ```
   MAILGUN_DOMAIN = gpitton.it
   ```

---

## ⚠️ NOTA IMPORTANTE

**Se il dominio non è disponibile:**
- Prova: `gpitton-robotica.it`
- Prova: `giovannipitton.it`
- Prova: `gpitton-ai.it`

Qualsiasi dominio `.it` funziona!
