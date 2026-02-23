#!/usr/bin/env node
/**
 * Invia mail di test a giovanni.pitton2@gmail.com
 * Uso: node send-test-email.js
 * Richiede: .env con BREVO_KEY (o variabili d'ambiente)
 */
const fs = require('fs');
const path = require('path');

// Carica .env se esiste
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.trim().match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

const { sendBrevo } = require('./api/lib/brevo');

async function main() {
  const to = process.argv[2] || 'giovanni.pitton2@gmail.com';
  if (!process.env.BREVO_KEY) {
    console.error('ERRORE: BREVO_KEY non trovata. Crea .env con BREVO_KEY=xxx');
    process.exit(1);
  }

  const htmlPath = path.join(__dirname, 'mail-comunicazione.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const subject = 'Test email - Consulenza Robotica e AI - Giovanni Pitton';

  console.log(`Invio email di test a ${to}...`);
  const result = await sendBrevo({
    subject,
    html: htmlContent,
    to,
    senderEmail: process.env.BREVO_SENDER_EMAIL || 'info@gpitton.com'
  });
  console.log('OK! Email inviata. ID:', result.id);
}

main().catch((err) => {
  console.error('Errore:', err.message);
  process.exit(1);
});
