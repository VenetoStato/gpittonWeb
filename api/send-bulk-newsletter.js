// Vercel Serverless - Newsletter massiva
// Supporta Resend (default) e Mailgun. Switch: EMAIL_PROVIDER=resend|mailgun
// Richiede: Authorization: Bearer NEWSLETTER_AUTH_TOKEN

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'resend';

async function sendBatchResend(recipients, subject, htmlContent, textContent) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'Giovanni Pitton <onboarding@resend.dev>';

  if (!apiKey) throw new Error('Imposta RESEND_API_KEY');

  const text = textContent || htmlContent.replace(/<[^>]*>/g, '');
  const results = [];
  const BATCH = 50; // Resend max 50 destinatari per richiesta

  for (let i = 0; i < recipients.length; i += BATCH) {
    const batch = recipients.slice(i, i + BATCH);
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: batch,
        subject,
        html: htmlContent,
        text
      })
    });
    const data = await res.json();
    results.push({
      batch: Math.floor(i / BATCH) + 1,
      count: batch.length,
      id: data.id,
      error: res.ok ? null : data.message
    });
    if (i + BATCH < recipients.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return results;
}

async function sendBatchMailgun(recipients, subject, htmlContent, textContent) {
  const Mailgun = require('mailgun.js');
  const formData = require('form-data');
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
  });
  const domain = process.env.MAILGUN_DOMAIN;

  const BATCH_SIZE = 1000;
  const results = [];

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    const response = await mg.messages.create(domain, {
      from: `Giovanni Pitton <newsletter@${domain}>`,
      to: batch,
      subject,
      html: htmlContent,
      text: textContent || htmlContent.replace(/<[^>]*>/g, '')
    });
    results.push({ batch: i / BATCH_SIZE + 1, recipients: batch.length, id: response.id });
    if (i + BATCH_SIZE < recipients.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return results;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authToken = req.headers.authorization?.replace('Bearer ', '');
  if (authToken !== process.env.NEWSLETTER_AUTH_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { recipients, subject, htmlContent, textContent } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients array is required' });
    }
    if (!subject || !htmlContent) {
      return res.status(400).json({ error: 'Subject and htmlContent are required' });
    }

    const results = EMAIL_PROVIDER === 'mailgun'
      ? await sendBatchMailgun(recipients, subject, htmlContent, textContent)
      : await sendBatchResend(recipients, subject, htmlContent, textContent);

    return res.status(200).json({
      success: true,
      message: `Newsletter inviata a ${recipients.length} destinatari`,
      provider: EMAIL_PROVIDER,
      results
    });

  } catch (error) {
    console.error('Bulk newsletter error:', error);
    return res.status(500).json({
      error: 'Failed to send newsletter',
      message: error.message || 'Si è verificato un errore.'
    });
  }
};
