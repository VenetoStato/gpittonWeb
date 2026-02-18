# 🚀 Deploy su Vercel - Guida Rapida

## Perché Vercel?

- ✅ **GRATIS** per hosting statico + serverless functions
- ✅ Deploy automatico da GitHub
- ✅ SSL incluso
- ✅ CDN globale
- ✅ Serverless functions per Mailgun
- ✅ Performance ottimale

---

## Setup in 5 Minuti

### Passo 1: Prepara il Repository GitHub

1. Assicurati che tutti i file siano committati:
```bash
git add .
git commit -m "Add Mailgun integration"
git push origin main
```

### Passo 2: Connetti Vercel a GitHub

1. Vai su https://vercel.com/
2. Clicca **"Sign Up"**
3. Scegli **"Continue with GitHub"**
4. Autorizza Vercel ad accedere ai tuoi repository

### Passo 3: Deploy il Progetto

1. Nel dashboard Vercel, clicca **"Add New Project"**
2. Seleziona il repository `giovannipitton` (o il nome che hai scelto)
3. Vercel rileva automaticamente:
   - Framework: Other (static)
   - Build Command: (lascia vuoto)
   - Output Directory: (lascia vuoto)
4. Clicca **"Deploy"**
5. Aspetta 1-2 minuti

### Passo 4: Configura Variabili d'Ambiente

1. Nel progetto deployato, vai su **Settings** > **Environment Variables**
2. Aggiungi queste variabili (una alla volta):

```
Name: MAILGUN_API_KEY
Value: [Configura in Vercel - non esporre]
```

```
Name: MAILGUN_DOMAIN
Value: tuo-dominio.com (o sandbox.mailgun.org per test)
```

```
Name: CONTACT_EMAIL
Value: tua-email@example.com
```

```
Name: NEWSLETTER_EMAIL
Value: tua-email@example.com
```

```
Name: NEWSLETTER_AUTH_TOKEN
Value: genera-un-token-lungo-e-casuale-qui (usa un password generator)
```

3. Per ogni variabile:
   - ✅ Seleziona **Production**, **Preview**, **Development**
   - Clicca **Save**

4. **IMPORTANTE**: Dopo aver aggiunto le variabili, vai su **Deployments**
5. Clicca sui 3 puntini del deployment più recente
6. Clicca **Redeploy** (serve per applicare le nuove variabili)

### Passo 5: Test

1. Vai sul tuo sito (URL tipo: `https://giovannipitton-xxx.vercel.app`)
2. Testa il modulo contatti
3. Testa la newsletter
4. Controlla la tua email!

---

## Dominio Personalizzato (Opzionale)

Se hai un dominio (es. `giovannipitton.com`):

1. Nel progetto Vercel, vai su **Settings** > **Domains**
2. Inserisci il tuo dominio
3. Aggiungi i record DNS che Vercel ti fornisce:
   - Tipo: A o CNAME
   - Nome: @ o www
   - Valore: (quello che Vercel ti dice)
4. Attendi la propagazione DNS (5-30 minuti)

---

## Deploy Automatico

Ogni volta che fai `git push`:
1. Vercel rileva automaticamente il push
2. Fa il deploy automatico
3. Il sito si aggiorna in 1-2 minuti

**Nessuna configurazione aggiuntiva necessaria!**

---

## Monitoraggio

### Log e Errori

1. Nel dashboard Vercel, vai su **Deployments**
2. Clicca su un deployment
3. Vai su **Functions** per vedere i log delle API
4. Controlla eventuali errori

### Analytics

1. Vai su **Analytics** nel progetto
2. Vedi statistiche su:
   - Visite
   - Performance
   - Errori

---

## Costi

- ✅ **Hosting**: GRATIS (illimitato)
- ✅ **Serverless Functions**: GRATIS (fino a 100GB bandwidth/mese)
- ✅ **SSL**: GRATIS (incluso)
- ✅ **CDN**: GRATIS (incluso)

**Per 20.000 email/mese, avrai bisogno di circa 1-2GB di bandwidth, quindi sei ben dentro il limite gratuito!**

---

## Alternative: Netlify

Se preferisci Netlify (anche gratis):

1. Vai su https://www.netlify.com/
2. Connetti GitHub
3. Deploy automatico
4. Configura variabili d'ambiente in **Site settings** > **Environment variables**
5. Le funzioni serverless vanno in `/netlify/functions/` invece di `/api/`

**Nota**: Dovresti adattare leggermente il codice per Netlify, ma Vercel è più semplice per questo setup.

---

## 🆘 Problemi Comuni

### Le API non funzionano

- ✅ Verifica che le variabili d'ambiente siano configurate
- ✅ Fai un redeploy dopo aver aggiunto le variabili
- ✅ Controlla i log in **Deployments** > **Functions**

### Errori 500

- ✅ Controlla che `MAILGUN_API_KEY` sia corretta
- ✅ Verifica che `MAILGUN_DOMAIN` sia verificato in Mailgun
- ✅ Controlla i log per dettagli

### Email non arrivano

- ✅ Verifica dominio Mailgun verificato
- ✅ Controlla spam folder
- ✅ Verifica che `CONTACT_EMAIL` sia corretta

---

## ✅ Checklist

- [ ] Repository GitHub pronto
- [ ] Account Vercel creato
- [ ] Progetto deployato
- [ ] Variabili d'ambiente configurate
- [ ] Redeploy fatto dopo variabili
- [ ] Test modulo contatti OK
- [ ] Test newsletter OK
- [ ] Dominio personalizzato (opzionale)

**Fatto! Il tuo sito è online e funzionante! 🎉**
