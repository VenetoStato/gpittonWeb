# 🔧 GOOGLE SEARCH CONSOLE - Usa Prefisso URL!

## ❌ PROBLEMA
Vedi solo TXT o CNAME perché hai scelto **"Dominio"** invece di **"Prefisso URL"**.

## ✅ SOLUZIONE: Crea Proprietà "Prefisso URL"

### STEP 1: Elimina Proprietà Attuale (se necessario)

1. Vai su: https://search.google.com/search-console
2. **Impostazioni** (icona ingranaggio in basso)
3. **Proprietà** → Trova `gpitton.vercel.app` o `gpitton-web.vercel.app`
4. **Elimina** (se vuoi ricrearla)

**OPPURE** tieni quella esistente e crea una nuova!

---

### STEP 2: Crea Nuova Proprietà "Prefisso URL"

1. In Search Console, clicca **"Aggiungi proprietà"** (in alto a sinistra)
2. **IMPORTANTE:** Scegli **"Prefisso URL"** (NON "Dominio"!)
3. Inserisci: `https://gpitton-web.vercel.app`
4. Clicca **"Continua"**

---

### STEP 3: Scegli Metodo "Tag HTML"

1. Nella schermata di verifica, vedrai diverse opzioni:
   - ✅ **Tag HTML** ← SCEGLI QUESTO!
   - TXT (DNS)
   - CNAME (DNS)
   - File HTML
   - Google Analytics
   - Google Tag Manager

2. **Clicca su "Tag HTML"**

3. Google ti mostrerà il codice:
   ```html
   <meta name="google-site-verification" content="7Sq5ggdAp4K1pu5q9FUc-28Ia4bbp5tr7MjVcQ9nYWM" />
   ```

4. **Questo codice è GIÀ nel sito!** ✅

5. **Clicca "Verifica"**

**Dovrebbe funzionare subito!** 🎉

---

## 🎯 DIFFERENZA TRA "DOMINIO" E "PREFISSO URL"

### "Dominio" (quello che hai scelto)
- Verifica tutto il dominio (es. `vercel.app`)
- Richiede DNS (TXT o CNAME)
- Più complesso
- Non mostra opzione HTML tag

### "Prefisso URL" (quello che serve)
- Verifica un URL specifico (es. `https://gpitton-web.vercel.app`)
- Supporta HTML tag
- Più semplice
- Funziona subito

**Per Vercel:** Usa sempre "Prefisso URL"!

---

## ✅ VERIFICA RAPIDA

1. ✅ Proprietà creata con "Prefisso URL"
2. ✅ Metodo "Tag HTML" scelto
3. ✅ Codice presente nel sito (verificato)
4. ✅ Clicca "Verifica"
5. ✅ Dovrebbe funzionare!

---

## 🆘 SE NON VEDI "TAG HTML"

**Possibili cause:**
- ❌ Hai scelto "Dominio" invece di "Prefisso URL"
- ❌ La proprietà è già verificata con altro metodo

**Soluzione:**
- ✅ Elimina e ricrea con "Prefisso URL"
- ✅ Oppure usa metodo DNS (più complicato)

---

## 🚀 DOPO LA VERIFICA

1. Vai su **"Sitemap"** (menu sinistra)
2. Inserisci: `sitemap.xml`
3. Clicca **"Invia"**
4. ✅ Fatto!

---

**Crea proprietà "Prefisso URL" e vedrai l'opzione HTML tag!** 🚀
