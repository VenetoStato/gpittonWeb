// GET: invia mail outreach di test a giovanni.pitton2@gmail.com
// ?lang=en → mail inglese (CH/NO) | default → mail italiana
// Supporta Mailgun e Brevo. Switch: EMAIL_PROVIDER=mailgun|brevo

const fs = require('fs');
const path = require('path');
const { sendBrevo } = require('./lib/brevo');

module.exports = async (req, res) => {
  const provider = process.env.BREVO_KEY ? 'brevo' : 'mailgun';
  const domain = 'gpitton.com';
  const toEmail = 'giovanni.pitton2@gmail.com';
  const isEN = (req.query?.lang || '').toLowerCase() === 'en';

  const htmlFile = isEN ? 'mail-comunicazione-en.html' : 'mail-comunicazione.html';
  const htmlPath = path.join(__dirname, '..', htmlFile);
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const subject = isEN ? 'Robotics and AI Consulting - Giovanni Pitton' : 'Consulenza Robotica e AI - Giovanni Pitton';

  if (provider === 'brevo') {
    if (!process.env.BREVO_KEY) {
      return res.status(500).json({
        error: 'BREVO_KEY non configurata',
        hint: 'Aggiungi BREVO_KEY in Vercel > Settings > Environment Variables'
      });
    }
    try {
      const result = await sendBrevo({
        subject,
        html: htmlContent,
        to: toEmail,
        senderEmail: process.env.BREVO_SENDER_EMAIL || process.env.BREVO_SENDER_MAIL || 'info@gpitton.com'
      });
      return res.status(200).json({
        success: true,
        id: result.id,
        message: `Email inviata a ${toEmail} via Brevo`,
        provider: 'brevo'
      });
    } catch (error) {
      console.error('Brevo error:', error);
      return res.status(500).json({
        error: error.message || 'Errore invio Brevo',
        hint: 'Verifica BREVO_KEY e BREVO_SENDER_EMAIL in Vercel'
      });
    }
  }

  if (!process.env.MAILGUN_API_KEY) {
    return res.status(500).json({
      error: 'MAILGUN_API_KEY non configurata',
      hint: 'Aggiungi MAILGUN_API_KEY in Vercel > Settings > Environment Variables'
    });
  }

  try {
    const Mailgun = require('mailgun.js');
    const formData = require('form-data');
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY,
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
