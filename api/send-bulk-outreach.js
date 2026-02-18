// POST: invia mail outreach a tutte le aziende in lista-aziende-100.csv
// Body: { token?: string } - opzionale NEWSLETTER_AUTH_TOKEN per auth
// Invia 1 email per destinatario (BCC non usato per privacy)

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

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'Giovanni Pitton <onboarding@resend.dev>';
  const subject = 'Consulenza Robotica e AI - Giovanni Pitton';

  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY non configurata' });
  }

  try {
    const csvPath = path.join(__dirname, '..', 'lista-aziende-100.csv');
    const htmlPath = path.join(__dirname, '..', 'mail-comunicazione.html');
    const recipients = parseCSV(fs.readFileSync(csvPath, 'utf8'));
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    const results = { sent: 0, failed: [] };
    const DELAY_MS = 800;

    for (let i = 0; i < recipients.length; i++) {
      const { azienda, email } = recipients[i];
      try {
        const resResend = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [email],
            subject,
            html: htmlContent
          })
        });
        const data = await resResend.json();
        if (resResend.ok) {
          results.sent++;
        } else {
          results.failed.push({ azienda, email, error: data.message || 'Errore' });
        }
      } catch (err) {
        results.failed.push({ azienda, email, error: err.message });
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
