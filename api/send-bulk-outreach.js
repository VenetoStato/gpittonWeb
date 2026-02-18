// POST: invia mail outreach. Body: { list?: 'it'|'ch-no', token?: string, offset?: number, limit?: number }
// list: 'it' = lista-aziende-100.csv + mail IT | 'ch-no' = lista-aziende-ch-no.csv + mail EN
// offset/limit: per batch (es. limit=80 evita timeout Vercel ~60s). Se assenti invia tutti.
// Usa Mailgun (info@gpitton.com)

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

  const listType = req.body?.list || 'it';
  const isCHNO = listType === 'ch-no';
  const csvPath = path.join(__dirname, '..', isCHNO ? 'lista-aziende-ch-no.csv' : 'lista-aziende-100.csv');
  const htmlPath = path.join(__dirname, '..', isCHNO ? 'mail-comunicazione-en.html' : 'mail-comunicazione.html');
  const subject = isCHNO ? 'Robotics and AI Consulting - Giovanni Pitton' : 'Consulenza Robotica e AI - Giovanni Pitton';

  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN || 'gpitton.com';

  if (!apiKey) {
    return res.status(500).json({ error: 'MAILGUN_API_KEY non configurata' });
  }

  try {
    let recipients = parseCSV(fs.readFileSync(csvPath, 'utf8'));
    const total = recipients.length;
    if (total === 0) {
      return res.status(400).json({ error: 'Nessun destinatario nella lista', csvPath });
    }
    const offset = Math.max(0, parseInt(req.body?.offset, 10) || 0);
    const limit = parseInt(req.body?.limit, 10);
    if (limit > 0) {
      recipients = recipients.slice(offset, offset + limit);
    } else if (offset > 0) {
      recipients = recipients.slice(offset);
    }
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
      failed: results.failed,
      total,
      nextOffset: offset + recipients.length,
      hasMore: offset + recipients.length < total
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
