# ⚡ SETUP GOOGLE VELOCE - 15 Minuti

## 🎯 OBIETTIVO
Configurare Google Analytics e Google Ads in modo veloce e automatico.

---

## 📊 STEP 1: GOOGLE ANALYTICS (5 minuti)

### 1.1 Crea Account
1. Vai su **https://analytics.google.com/**
2. Clicca **"Inizia a misurare"** o **"Start measuring"**
3. Compila:
   - Nome account: `Giovanni Pitton` (o qualsiasi nome)
   - Nome proprietà: `gpitton-web`
   - Fuso orario: `(GMT+01:00) Roma`
   - Valuta: `Euro (€)`
4. Clicca **"Crea"**

### 1.2 Ottieni Measurement ID
1. Dopo la creazione, vedrai una schermata con **"Measurement ID"**
2. Copia l'ID (tipo `G-XXXXXXXXXX`)
3. **SALVALO** - ti servirà dopo!

### 1.3 Aggiungi al Sito
1. Apri `index.html`
2. Trova la sezione `<!-- Google Analytics & Google Ads -->` (circa riga 60)
3. Rimuovi i commenti `<!--` e `-->`
4. Sostituisci `GA_MEASUREMENT_ID` con il tuo ID (es. `G-XXXXXXXXXX`)
5. Salva

**Esempio:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 📢 STEP 2: GOOGLE ADS (5 minuti)

### 2.1 Crea Account
1. Vai su **https://ads.google.com/**
2. Clicca **"Inizia"** o **"Get started"**
3. Compila i dati richiesti
4. Crea account

### 2.2 Crea Campagna (Opzionale per ora)
**Puoi saltare questo step se vuoi solo il tracking!**

1. Clicca **"Nuova campagna"**
2. Scegli obiettivo (es. "Lead")
3. Configura campagna (puoi farlo dopo)

### 2.3 Ottieni Conversion ID
1. Vai su **Strumenti e impostazioni** (icona chiave inglese)
2. Clicca **"Conversione"** → **"+ Conversione"**
3. Scegli **"Sito web"**
4. Nome: `Contatto Sito Web`
5. Categoria: `Lead`
6. Clicca **"Crea e continua"**
7. Copia il **Conversion ID** (tipo `AW-XXXXXXXXXX`)
8. **SALVALO**

### 2.4 Aggiungi al Sito
1. In `index.html`, nella stessa sezione Google Analytics
2. Sostituisci `AW-CONVERSION_ID` con il tuo ID
3. Salva

**Esempio:**
```html
gtag('config', 'AW-XXXXXXXXXX');
```

---

## 🔍 STEP 3: GOOGLE SEARCH CONSOLE (5 minuti)

### 3.1 Aggiungi Proprietà
1. Vai su **https://search.google.com/search-console**
2. Clicca **"Aggiungi proprietà"**
3. Inserisci: `https://gpitton-web.vercel.app`
4. Clicca **"Continua"**

### 3.2 Verifica Proprietà
**Metodo HTML Tag (PIÙ VELOCE):**
1. Google ti darà un tag HTML tipo:
   ```html
   <meta name="google-site-verification" content="CODICE_VERIFICA" />
   ```
2. Copia il `content="CODICE_VERIFICA"`
3. Aggiungi in `index.html` nella sezione `<head>`:
   ```html
   <meta name="google-site-verification" content="CODICE_VERIFICA" />
   ```
4. Salva e push
5. Torna su Search Console e clicca **"Verifica"**

**Oppure Metodo DNS:**
- Aggiungi record TXT nel DNS (se hai dominio personalizzato)

### 3.3 Invia Sitemap
1. Nel Search Console, vai su **"Sitemap"** (menu sinistra)
2. Inserisci: `sitemap.xml`
3. Clicca **"Invia"**
4. ✅ Fatto!

---

## ✅ VERIFICA RAPIDA

### Google Analytics
1. Vai su https://analytics.google.com/
2. Vai su **"Rapporti in tempo reale"**
3. Visita il sito: `https://gpitton-web.vercel.app`
4. Dovresti vedere la visita in tempo reale!

### Google Ads
1. Vai su https://ads.google.com/
2. Vai su **"Conversione"**
3. Dovresti vedere le conversioni quando qualcuno compila il form

### Search Console
1. Vai su https://search.google.com/search-console
2. Dovresti vedere lo stato "Verificato"
3. La sitemap dovrebbe essere "Inviata"

---

## 🚀 DOPO IL SETUP

### Cosa Succede Ora

1. **Google Analytics**:
   - Traccia tutte le visite
   - Mostra da dove arrivano
   - Mostra cosa fanno sul sito
   - Metriche in tempo reale

2. **Google Ads**:
   - Traccia conversioni (form compilati)
   - Ottimizza le campagne
   - Calcola ROI

3. **Search Console**:
   - Mostra query di ricerca
   - Mostra posizioni Google
   - Mostra click e impressioni
   - Errori di indicizzazione

---

## 📊 MONITORAGGIO

### Check Settimanale

1. **Google Analytics**:
   - Visite totali
   - Fonti traffico
   - Pagine più visitate
   - Conversioni

2. **Search Console**:
   - Query che portano traffico
   - Posizione media
   - Click-through rate

3. **Google Ads** (se attivo):
   - Conversioni
   - Costo per conversione
   - ROI

---

## 🆘 PROBLEMI COMUNI

### "Google Analytics non traccia"
- ✅ Verifica che l'ID sia corretto
- ✅ Verifica che gli script non siano commentati
- ✅ Aspetta 24-48 ore per i dati completi
- ✅ Usa "Rapporti in tempo reale" per test immediato

### "Search Console non verifica"
- ✅ Verifica che il meta tag sia nel `<head>`
- ✅ Fai push su GitHub e redeploy su Vercel
- ✅ Aspetta qualche minuto e riprova

### "Conversioni non tracciano"
- ✅ Verifica che il Conversion ID sia corretto
- ✅ Verifica che l'evento venga triggerato (controlla console browser)
- ✅ Aspetta 24-48 ore

---

## ✅ CHECKLIST

- [ ] Google Analytics account creato
- [ ] Measurement ID ottenuto
- [ ] ID aggiunto in index.html
- [ ] Google Ads account creato
- [ ] Conversion ID ottenuto
- [ ] ID aggiunto in index.html
- [ ] Google Search Console proprietà aggiunta
- [ ] Sito verificato
- [ ] Sitemap inviata
- [ ] Test Analytics (visita il sito)
- [ ] Test Conversioni (compila form)

---

## 🎯 TEMPO TOTALE: 15 MINUTI

**Dopo questo setup avrai:**
- ✅ Tracciamento completo visite
- ✅ Tracciamento conversioni
- ✅ Monitoraggio posizioni Google
- ✅ Dati per ottimizzare

**Fatto! 🚀**
