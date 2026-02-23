// Helper Brevo (ex Sendinblue) - invio email transazionali
// API: https://developers.brevo.com/docs/send-a-transactional-email
// Variabili Vercel: BREVO_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME

async function sendBrevo(payload) {
  const apiKey = process.env.BREVO_KEY;
  const senderEmail = payload.senderEmail || process.env.BREVO_SENDER_EMAIL || 'info@gpitton.com';
  const senderName = payload.senderName || process.env.BREVO_SENDER_NAME || 'Giovanni Pitton';

  if (!apiKey) {
    throw new Error('Imposta BREVO_KEY in Vercel > Settings > Environment Variables');
  }

  const body = {
    sender: { name: payload.senderName || senderName, email: payload.senderEmail || senderEmail },
    to: Array.isArray(payload.to) ? payload.to : [{ email: payload.to, name: payload.toName || '' }],
    subject: payload.subject,
    htmlContent: payload.html,
    textContent: payload.text || (payload.html ? payload.html.replace(/<[^>]*>/g, '') : undefined),
    replyTo: payload.replyTo ? { email: payload.replyTo } : undefined
  };

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.code || `Brevo error ${res.status}`);
  }
  return { id: data.messageId };
}

module.exports = { sendBrevo };
