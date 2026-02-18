// GET: invia mail outreach via Mailgun a giovanni.pitton2@gmail.com
// ?lang=en → mail inglese (CH/NO) | default → mail italiana
// Usa api.eu.mailgun.net (EU region)
// Richiede: MAILGUN_API_KEY, MAILGUN_DOMAIN (gpitton.com)

const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN || 'gpitton.com';
  const toEmail = 'giovanni.pitton2@gmail.com';
  const isEN = (req.query?.lang || '').toLowerCase() === 'en';

  if (!apiKey) {
    return res.status(500).json({
      error: 'MAILGUN_API_KEY non configurata',
      hint: 'Aggiungi MAILGUN_API_KEY in Vercel > Settings > Environment Variables'
    });
  }

  try {
    const htmlFile = isEN ? 'mail-comunicazione-en.html' : 'mail-comunicazione.html';
    const htmlPath = path.join(__dirname, '..', htmlFile);
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const subject = isEN ? 'Robotics and AI Consulting - Giovanni Pitton' : 'Consulenza Robotica e AI - Giovanni Pitton';

    const Mailgun = require('mailgun.js');
    const formData = require('form-data');
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: apiKey,
      url: 'https://api.eu.mailgun.net'
    });

    const result = await mg.messages.create(domain, {
      from: `Giovanni Pitton <info@${domain}>`,
      to: toEmail,
      subject,
      html: htmlContent,
      text: htmlContent.replace(/<[^>]*>/g, '')
    });

    return res.status(200).json({
      success: true,
      id: result.id,
      message: `Email inviata a ${toEmail} via Mailgun`,
      provider: 'mailgun'
    });
  } catch (error) {
    console.error('Mailgun error:', error);
    return res.status(500).json({
      error: error.message || 'Errore invio Mailgun',
      hint: 'Verifica MAILGUN_API_KEY e MAILGUN_DOMAIN in Vercel. Dominio: gpitton.com'
    });
  }
};
