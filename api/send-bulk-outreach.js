// POST: invia mail outreach. Usa SOLO lista-100-verificate.csv (email trovate sui siti)
// Body: { token?: string, offset?: number, limit?: number }
// Lingua: .it -> italiano, .ch/.no/.com -> inglese
// Supporta Mailgun e Brevo. Switch: EMAIL_PROVIDER=mailgun|brevo

const fs = require('fs');
const path = require('path');
const { sendBrevo } = require('./lib/brevo');

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(';');
    if (parts.length >= 2 && parts[1]?.includes('@')) {
      rows.push({ azienda: (parts[0] || '').trim(), email: (parts[1] || '').trim(), sito: (parts[2] || '').trim() });
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

  const csvPath = path.join(__dirname, '..', 'lista-100-verificate.csv');

  const provider = process.env.EMAIL_PROVIDER || 'mailgun';
  const domain = process.env.MAILGUN_DOMAIN || (process.env.BREVO_SENDER_EMAIL ? process.env.BREVO_SENDER_EMAIL.split('@')[1] : null) || 'gpitton.com';
  const mailgunKey = process.env.MAILGUN_API_KEY;
  const brevoKey = process.env.BREVO_KEY;

  if (provider === 'mailgun' && !mailgunKey) {
    return res.status(500).json({ error: 'MAILGUN_API_KEY non configurata' });
  }
  if (provider === 'brevo' && !brevoKey) {
    return res.status(500).json({ error: 'BREVO_KEY non configurata in Vercel' });
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

    const results = { sent: 0, failed: [] };
    const DELAY_MS = 600;

    if (provider === 'brevo') {
      const senderEmail = process.env.BREVO_SENDER_EMAIL || `info@${domain}`;
      for (let i = 0; i < recipients.length; i++) {
        const { azienda, email, sito } = recipients[i];
        const isIT = (sito || '').includes('.it');
        const htmlPath = path.join(__dirname, '..', isIT ? 'mail-comunicazione.html' : 'mail-comunicazione-en.html');
        const subject = isIT ? 'Consulenza Robotica e AI - Giovanni Pitton' : 'Robotics and AI Consulting - Giovanni Pitton';
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        const textContent = htmlContent.replace(/<[^>]*>/g, '');
        try {
          await sendBrevo({ subject, html: htmlContent, text: textContent, to: email, senderEmail });
          results.sent++;
        } catch (err) {
          results.failed.push({ azienda, email, error: err.message || 'Errore' });
        }
        if (i < recipients.length - 1) {
          await new Promise(r => setTimeout(r, DELAY_MS));
        }
      }
    } else {
      const Mailgun = require('mailgun.js');
      const formData = require('form-data');
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({
        username: 'api',
        key: mailgunKey,
        url: 'https://api.eu.mailgun.net'
      });
      for (let i = 0; i < recipients.length; i++) {
        const { azienda, email, sito } = recipients[i];
        const isIT = (sito || '').includes('.it');
        const htmlPath = path.join(__dirname, '..', isIT ? 'mail-comunicazione.html' : 'mail-comunicazione-en.html');
        const subject = isIT ? 'Consulenza Robotica e AI - Giovanni Pitton' : 'Robotics and AI Consulting - Giovanni Pitton';
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        const textContent = htmlContent.replace(/<[^>]*>/g, '');
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
