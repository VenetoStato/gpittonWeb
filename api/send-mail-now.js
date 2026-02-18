// GET: invia mail outreach a giovanni.pitton2@gmail.com (nessun body richiesto)
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const MAIL_HTML = fs.readFileSync(path.join(__dirname, '..', 'mail-comunicazione.html'), 'utf8');
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = 'giovanni.pitton2@gmail.com';

  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY non configurata' });
  }

  try {
    const resResend = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Giovanni Pitton <onboarding@resend.dev>',
        to: [toEmail],
        subject: 'Consulenza Robotica e AI - Giovanni Pitton',
        html: MAIL_HTML
      })
    });

    const data = await resResend.json();
    if (!resResend.ok) {
      return res.status(500).json({ error: data.message || 'Errore invio' });
    }
    return res.status(200).json({ success: true, id: data.id, message: 'Email inviata a ' + toEmail });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
