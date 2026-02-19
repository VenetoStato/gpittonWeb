# Setup Auth - Pagine Protette (Outreach, Lista Contatti)

Le pagine outreach.html e list-contatti.html sono protette da login. Solo giovanni.pitton2@gmail.com puo accedervi.

## Variabili Vercel

Aggiungi in Vercel > Settings > Environment Variables:

- OUTREACH_PASSWORD: la tua password (es. una password forte)
- OUTREACH_JWT_SECRET: stringa casuale (genera con: openssl rand -hex 32)

## Come accedere

1. Vai su https://gpitton-web.vercel.app/login.html
2. Inserisci la password
3. Verrai reindirizzato a outreach.html

## Google Sign-In (opzionale)

Per abilitare Accedi con Google: crea Client ID su Google Cloud Console, aggiungi GOOGLE_CLIENT_ID in Vercel.
