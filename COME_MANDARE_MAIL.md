# 📧 Come Mandare le Mail per Comunicazione

## 1. Form Contatti (automatico)
Quando qualcuno compila il form su **gpitton.com**, l'email arriva automaticamente a **giovanni.pitton2@gmail.com**.

## 2. Outreach alle Aziende (mail di presentazione)
1. Vai su **gpitton.com/outreach.html**
2. Compila oggetto e messaggio
3. Clicca **"Invia test"** per ricevere una copia su giovanni.pitton2@gmail.com
4. Clicca **"Copia email"** per la lista aziende
5. Clicca **"Copia HTML"** per il contenuto
6. Usa **Invio bulk** (vedi sotto)

## 3. Invio Bulk (newsletter / comunicazione)
1. Imposta su Vercel: `NEWSLETTER_AUTH_TOKEN` = una password segreta
2. Chiama l'API:

```
POST https://gpitton.com/api/send-bulk-newsletter
Headers: Authorization: Bearer IL_TUO_TOKEN
Body: {
  "recipients": ["email1@example.com", "email2@example.com"],
  "subject": "Oggetto",
  "htmlContent": "<p>Contenuto HTML</p>"
}
```

**Limiti Resend (gratis):** 100 email/giorno, 3000/mese

## 4. Provider attuale
- **Resend** (attivo): 3000 email/mese gratis
- **Mailgun** (disabilitato): quando riattivato, imposta `EMAIL_PROVIDER=mailgun` in Vercel
