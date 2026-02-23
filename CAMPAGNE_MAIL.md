# Campagne Mail

## Lista: solo email verificate

**lista-100-verificate.csv** – 104 contatti. Email trovate sui siti aziendali (scraping), dominio verificato.

---

## Provider email: Brevo (alternativa a Mailgun)

Dopo la chiusura dell'account Mailgun, usa **Brevo** (ex Sendinblue):

1. Crea account su [brevo.com](https://www.brevo.com)
2. Vai in **Account > SMTP & API** e copia l'API key
3. In Vercel: `EMAIL_PROVIDER=brevo`, `BREVO_KEY=xxx`, `BREVO_SENDER_EMAIL=info@gpitton.com`
4. Verifica il dominio mittente in Brevo (Sender & IP)

---

## Invio

`POST /api/send-bulk-outreach` body `{ "token": "...", "offset": 0, "limit": 80 }`

- Usa `lista-300-verificate.csv` se esiste, altrimenti `lista-100-verificate.csv`
- Lingua automatica: .it → italiano, .ch/.no/.com → inglese
- Batch: `limit: 80` per evitare timeout
- Solo BREVO_KEY in Vercel (resto hardcoded)

## Ottenere le 300 email verificate

```bash
python unisci_liste_italiane.py   # crea lista-aziende-it-300.csv
python run_scraper_300.py        # visita siti, verifica email, output lista-300-verificate.csv
```

**Scraper potenziato:** cerca su molte pagine (/contact, /team, /chi-siamo, ecc.), scopre link automaticamente, preferisce email con nomi (nome.cognome@) rispetto a info@. Opzionale: `GITHUB_TOKEN=xxx` per cercare email da commit GitHub (sviluppatori con email aziendale).

**Nota LinkedIn:** LinkedIn non espone email pubblicamente e vieta lo scraping. Per trovare contatti diretti serve Hunter.io / Apollo (a pagamento).
