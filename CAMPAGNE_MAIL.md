# Campagne Mail - Tracciamento

Struttura per gestire e reinviare le diverse tipologie di mail.

---

## Tipologie di mail

| Tipo | Template | Lista | API | Note |
|------|----------|------|-----|------|
| **Outreach IT** | `mail-comunicazione.html` | `lista-aziende-100.csv` (110 aziende Veneto/Friuli) | `POST /api/send-bulk-outreach` con `list: "it"` | Subject: "Consulenza Robotica e AI - Giovanni Pitton" |
| **Outreach CH-NO** | `mail-comunicazione-en.html` | `lista-aziende-ch-no.csv` (~1000 Svizzera/Norvegia) | `POST /api/send-bulk-outreach` con `list: "ch-no"` | Subject: "Robotics and AI Consulting - Giovanni Pitton" |
| **Newsletter EN** | `newsletter-en.html` | Da definire | `POST /api/send-bulk-newsletter` | Template newsletter (diverso da outreach) |

---

## Storico invii (da aggiornare manualmente)

| Data | Tipo | Lista | Destinatari | Note |
|------|------|------|-------------|------|
| _da compilare_ | Outreach IT | lista-aziende-100.csv | 110 | Veneto/Friuli |
| _da compilare_ | Outreach CH-NO | lista-aziende-ch-no.csv | ~1000 | Svizzera + Norvegia |

---

## Come reinviare

1. **Outreach IT**: `POST https://gpitton.com/api/send-bulk-outreach` con body `{ "list": "it", "token": "<NEWSLETTER_AUTH_TOKEN>" }`
2. **Outreach CH-NO**: `POST https://gpitton.com/api/send-bulk-outreach` con body `{ "list": "ch-no", "token": "<NEWSLETTER_AUTH_TOKEN>" }`
3. **Newsletter**: configurare `api/send-bulk-newsletter.js` e lista destinatari

---

## File correlati

- **Template mail**: `mail-comunicazione.html`, `mail-comunicazione-en.html`, `newsletter-en.html`
- **Liste**: `lista-aziende-100.csv`, `lista-aziende-ch-no.csv`
- **API**: `api/send-bulk-outreach.js`, `api/send-bulk-newsletter.js`
- **Lista contatti visibile**: `list-contatti.html`
