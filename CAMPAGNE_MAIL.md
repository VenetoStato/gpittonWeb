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

- Lingua automatica: .it → italiano, .ch/.no/.com → inglese
- Batch: `limit: 80` per evitare timeout
- Supporta `EMAIL_PROVIDER=mailgun` o `EMAIL_PROVIDER=brevo`
