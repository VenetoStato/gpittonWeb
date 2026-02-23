// Vercel Serverless - Iscrizione newsletter
// Supporta Resend (default), Mailgun, Brevo. Switch: EMAIL_PROVIDER=resend|mailgun|brevo

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'resend';
const { sendBrevo } = require('./lib/brevo');

async function sendWithResend(payload) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'Newsletter <onboarding@resend.dev>';
  const toEmail = process.env.NEWSLETTER_EMAIL || process.env.CONTACT_EMAIL || 'giovanni.pitton2@gmail.com';

  if (!apiKey) {
    throw new Error('Imposta RESEND_API_KEY in Vercel. Vedi SETUP_RESEND.md');
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: payload.subject,
      text: payload.text,
      html: payload.html
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Resend error');
  return { id: data.id };
}

async function sendWithMailgun(payload) {
  const Mailgun = require('mailgun.js');
  const formData = require('form-data');
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
  });

  const domain = process.env.MAILGUN_DOMAIN;
  const toEmail = process.env.NEWSLETTER_EMAIL || process.env.CONTACT_EMAIL || 'giovanni.pitton2@gmail.com';

  if (!process.env.MAILGUN_API_KEY || !domain) {
    throw new Error('Imposta MAILGUN_API_KEY e MAILGUN_DOMAIN per usare Mailgun');
  }

  const result = await mg.messages.create(domain, {
    from: `Newsletter <noreply@${domain}>`,
    to: toEmail,
    subject: payload.subject,
    text: payload.text,
    html: payload.html
  });
  return { id: result.id };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const textBody = `
Nuova iscrizione alla newsletter

Nome: ${name || 'Non specificato'}
Email: ${email}

---
Sito web di Giovanni Pitton
    `.trim();

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0066cc;">Nuova iscrizione newsletter</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
          <p><strong>Nome:</strong> ${name || 'Non specificato'}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Sito web di Giovanni Pitton
        </p>
      </div>
    `;

    const payload = {
      subject: 'Nuova iscrizione newsletter',
      text: textBody,
      html: htmlBody
    };

    let result;
    if (EMAIL_PROVIDER === 'mailgun') result = await sendWithMailgun(payload);
    else if (EMAIL_PROVIDER === 'brevo') result = await sendBrevo({ subject: payload.subject, text: payload.text, html: payload.html, to: process.env.NEWSLETTER_EMAIL || process.env.CONTACT_EMAIL || 'giovanni.pitton2@gmail.com' });
    else result = await sendWithResend(payload);

    return res.status(200).json({
      success: true,
      message: 'Iscrizione completata',
      id: result.id
    });

  } catch (error) {
    console.error('Newsletter error:', error);
    return res.status(500).json({
      error: 'Failed to subscribe',
      message: error.message || 'Si è verificato un errore.'
    });
  }
};
