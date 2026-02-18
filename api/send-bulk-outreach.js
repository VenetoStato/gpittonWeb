// POST: invia mail outreach a tutte le aziende in lista-aziende-100.csv
// Usa Mailgun (info@gpitton.com). Body: { token?: string } - opzionale NEWSLETTER_AUTH_TOKEN
// Invia 1 email per destinatario

const fs = require('fs');
const path = require('path');

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(';');
    if (parts.length >= 2 && parts[1].includes('@')) {
      rows.push({ azienda: parts[0].trim(), email: parts[1].trim() });
    }
  }
  return rows;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authToken = req.body?.token || req.headers.authorization?.replace('Bearer ', '');
  const expectedToken = process.env.NEWSLETTER_AUTH_TOKEN;
  if (expectedToken && authToken !== expectedToken) {
    return res.status(401).json({ error: 'Token non valido. Imposta NEWSLETTER_AUTH_TOKEN in Vercel e passa token nel body o header.' });
  }

  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN || 'gpitton.com';
  const subject = 'Consulenza Robotica e AI - Giovanni Pitton';

  if (!apiKey) {
    return res.status(500).json({ error: 'MAILGUN_API_KEY non configurata' });
  }

  try {
    const csvPath = path.join(__dirname, '..', 'lista-aziende-100.csv');
    const htmlPath = path.join(__dirname, '..', 'mail-comunicazione.html');
    const recipients = parseCSV(fs.readFileSync(csvPath, 'utf8'));
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const textContent = htmlContent.replace(/<[^>]*>/g, '');

    const Mailgun = require('mailgun.js');
    const formData = require('form-data');
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: apiKey,
      url: 'https://api.eu.mailgun.net'
    });

    const results = { sent: 0, failed: [] };
    const DELAY_MS = 600;

    for (let i = 0; i < recipients.length; i++) {
      const { azienda, email } = recipients[i];
      try {
        await mg.messages.create(domain, {
          from: `Giovanni Pitton <info@${domain}>`,
          to: email,
          subject,
          html: htmlContent,
          text: textContent
        });
        results.sent++;
      } catch (err) {
        results.failed.push({ azienda, email, error: err.message || 'Errore' });
      }
      if (i < recipients.length - 1) {
        await new Promise(r => setTimeout(r, DELAY_MS));
      }
    }

    return res.status(200).json({
      success: true,
      message: `Inviate ${results.sent} mail, ${results.failed.length} fallite`,
      sent: results.sent,
      failed: results.failed
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
