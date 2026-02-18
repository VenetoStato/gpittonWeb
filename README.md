# Sito Web Personale - Giovanni Pitton

Sito web professionale per Giovanni Pitton, Robotics and AI Full Stack Developer | Technical Sales.

🚀 Deploy automatico su Vercel

## Caratteristiche

- ✅ Design moderno e responsive
- ✅ Ottimizzazione SEO completa
- ✅ Modulo contatti funzionante
- ✅ Sistema newsletter per mailing massivo
- ✅ Integrazione LinkedIn e Meko srl
- ✅ Animazioni fluide e UX ottimizzata

## Setup EmailJS

Per abilitare l'invio delle email, devi configurare EmailJS:

1. Crea un account su [EmailJS](https://www.emailjs.com/)
2. Crea un servizio email (Gmail, Outlook, ecc.)
3. Crea due template:
   - Template per contatti
   - Template per newsletter
4. Sostituisci nel file `script.js`:
   - `YOUR_PUBLIC_KEY` con la tua Public Key
   - `YOUR_SERVICE_ID` con il tuo Service ID
   - `YOUR_TEMPLATE_ID` con il tuo Template ID per contatti
   - `YOUR_NEWSLETTER_SERVICE_ID` con il Service ID per newsletter
   - `YOUR_NEWSLETTER_TEMPLATE_ID` con il Template ID per newsletter
   - `your-email@example.com` con la tua email

## Struttura File

```
.
├── index.html      # Pagina principale
├── styles.css      # Stili CSS
├── script.js       # JavaScript e logica EmailJS
└── README.md       # Documentazione
```

## 🚀 Deploy su GitHub Pages (GRATIS)

Il sito è configurato per essere deployato su **GitHub Pages** completamente **GRATIS**.

### Quick Start (5 minuti)

1. Crea un repository su GitHub (es. `giovannipitton`)
2. Carica tutti i file del progetto
3. Vai su Settings > Pages > Seleziona branch `main` > Save
4. Il sito sarà online su `https://venetostato.github.io/giovannipitton/`

📖 **Guida completa**: Vedi [QUICK_START.md](QUICK_START.md) o [DEPLOY.md](DEPLOY.md)

### Repository GitHub

- Profilo: [@VenetoStato](https://github.com/VenetoStato)
- Il sito può essere hostato nel repository principale o in uno dedicato

### Costi

- ✅ **GitHub Pages: GRATIS** (illimitato)
- ✅ **EmailJS: GRATIS** (200 email/mese)
- ✅ **Totale: €0.00** 🎉

### Alternative (tutte gratuite)

- Netlify
- Vercel
- Qualsiasi hosting statico

## SEO

Il sito include:
- Meta tags ottimizzati
- Structured Data (Schema.org)
- Open Graph tags
- Twitter Cards
- Link a LinkedIn e Meko srl per migliorare il ranking

## 📧 Sistema Email - Mailgun Integration

Il sito è configurato per **Mailgun** per gestire **20.000+ email/mese** a costi minimi.

### Setup Email

1. **Mailgun** (~€32/mese per 50.000 email) - Vedi [MAILGUN_SETUP.md](MAILGUN_SETUP.md)
2. **SendGrid** (~€18/mese per 50.000 email) - Alternativa più economica
3. **Vercel Serverless Functions** - Backend GRATIS per gestire le email

### Costi Totali

- ✅ **Hosting**: GRATIS (Vercel)
- ✅ **Backend**: GRATIS (Serverless Functions)
- ✅ **Email Service**: ~€18-32/mese (a seconda del provider)
- **TOTALE: ~€18-32/mese** per 20.000+ email/mese

📖 **Guide complete:**
- [MAILGUN_SETUP.md](MAILGUN_SETUP.md) - Setup Mailgun passo-passo
- [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md) - Deploy su Vercel
- [COSTI_E_CONFRONTO.md](COSTI_E_CONFRONTO.md) - Confronto costi dettagliato

## Note

- Il sistema supporta invio massivo di newsletter (20.000+ email/mese)
- Backend serverless su Vercel (completamente gratuito)
- Assicurati di aggiornare i link e le informazioni personali
