# 🔧 FIX DNS VERCEL - Namecheap

## ✅ COSA HAI GIÀ (Corretto!)
- ✅ A Record `@` → `216.198.79.1` ✅

## ❌ COSA MANCA

Vercel richiede ANCHE un record CNAME per `www`!

---

## 🚀 FIX IMMEDIATO (2 minuti)

### Step 1: Aggiungi CNAME in Namecheap

1. **Vai su Namecheap:** Advanced DNS
2. **Clicca:** "Add New Record"
3. **Configura:**
   ```
   Tipo: CNAME
   Host: www
   Valore: cname.vercel-dns.com
   TTL: Automatic
   ```
4. **Clicca:** Save (icona salva verde)

### Step 2: Verifica che Non Ci Siano Redirect

**IMPORTANTE:** Assicurati che NON ci siano:
- ❌ URL Redirect Record
- ❌ CNAME che punta a `parkingpage.namecheap.com`

Se ci sono, **RIMUOVILI!**

### Step 3: Attendi Propagazione

- **Tempo:** 1-24 ore (spesso 1-2 ore)
- **Vercel Dashboard:** Dovrebbe cambiare da "Invalid" a "Valid Configuration"

---

## 📋 RECORD DNS COMPLETI (Namecheap)

Dovresti avere SOLO questi record:

```
✅ A Record
   Host: @
   Valore: 216.198.79.1
   TTL: Automatic

✅ CNAME Record
   Host: www
   Valore: cname.vercel-dns.com
   TTL: Automatic

✅ TXT Record (SPF - mantieni quello esistente)
   Host: @
   Valore: v=spf1 include:spf.efwd.registrar-servers.com ~all
   TTL: Automatic
```

**RIMUOVI se ci sono:**
- ❌ URL Redirect
- ❌ CNAME che punta a parkingpage
- ❌ Altri record non necessari

---

## 🔍 VERIFICA

### Verifica DNS Propagation

1. **Vai su:** https://dnschecker.org/
2. **Cerca:** `gpitton.com`
3. **Tipo:** A Record
4. **Verifica:** Che punti a `216.198.79.1` in tutto il mondo

### Verifica in Vercel

1. **Vai su:** Vercel Dashboard > Domains
2. **Attendi:** Che cambi da "Invalid Configuration" a "Valid Configuration"
3. **Tempo:** 1-24 ore (spesso 1-2 ore)

---

## ⚠️ SE NON FUNZIONA DOPO 2 ORE

### Opzione A: Usa Nameserver Vercel (Più Semplice)

1. **Namecheap:** Domain List > gpitton.com > Domain
2. **Nameservers:** Cambia a "Custom DNS"
3. **Inserisci:**
   ```
   dns1.vercel-dns.com
   dns2.vercel-dns.com
   ```
4. **Salva**

**Vantaggio:** Vercel gestisce tutto automaticamente!

**Nota:** Dovrai rimuovere i record DNS manuali dopo aver cambiato nameserver.

---

## ✅ CHECKLIST

- [ ] A Record `@` → `216.198.79.1` ✅ (già fatto)
- [ ] CNAME Record `www` → `cname.vercel-dns.com` (DA FARE!)
- [ ] Rimosso URL Redirect (se c'era)
- [ ] Rimosso CNAME parkingpage (se c'era)
- [ ] Atteso 1-2 ore per propagazione
- [ ] Verificato in Vercel che diventa "Valid Configuration"

---

**Dopo che Vercel mostra "Valid Configuration", il sito sarà su https://gpitton.com!**
