// Vercel Serverless - Form contatti
// Supporta Resend (default) e Mailgun. Switch: EMAIL_PROVIDER=resend|mailgun

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'resend';

// --- Helper: invio con Resend ---
async function sendWithResend(payload) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'Sito Web <onboarding@resend.dev>';
  const toEmail = process.env.CONTACT_EMAIL || 'giovanni.pitton2@gmail.com';

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
      html: payload.html,
      reply_to: payload.replyTo
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Resend error');
  return { id: data.id };
}

// --- Helper: invio con Mailgun ---
async function sendWithMailgun(payload) {
  const Mailgun = require('mailgun.js');
  const formData = require('form-data');
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
  });

  const domain = process.env.MAILGUN_DOMAIN;
  const toEmail = process.env.CONTACT_EMAIL || 'giovanni.pitton2@gmail.com';

  if (!process.env.MAILGUN_API_KEY || !domain) {
    throw new Error('Imposta MAILGUN_API_KEY e MAILGUN_DOMAIN per usare Mailgun');
  }

  const result = await mg.messages.create(domain, {
    from: `Sito Web <noreply@${domain}>`,
    to: toEmail,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
    'h:Reply-To': payload.replyTo
  });
  return { id: result.id };
}

// --- Handler ---
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { name, email, company, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'email', 'subject', 'message']
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const textBody = `
Nuovo messaggio dal sito web di Giovanni Pitton

Nome: ${name}
Email: ${email}
Azienda: ${company || 'Non specificata'}
Oggetto: ${subject}

Messaggio:
${message}

---
Inviato dal modulo contatti del sito web.
    `.trim();

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0066cc;">Nuovo messaggio dal sito web</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Azienda:</strong> ${company || 'Non specificata'}</p>
          <p><strong>Oggetto:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p><strong>Messaggio:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Inviato dal modulo contatti del sito web di Giovanni Pitton
        </p>
      </div>
    `;

    const payload = {
      subject: `Nuovo contatto: ${subject}`,
      text: textBody,
      html: htmlBody,
      replyTo: email
    };

    const result = EMAIL_PROVIDER === 'mailgun'
      ? await sendWithMailgun(payload)
      : await sendWithResend(payload);

    return res.status(200).json({
      success: true,
      message: 'Email inviata con successo',
      id: result.id
    });

  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      message: error.message || 'Si è verificato un errore. Riprova più tardi.'
    });
  }
};
