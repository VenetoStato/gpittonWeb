// API per leggere i contatti/eventi email ricevuti
// ATTENZIONE: Richiede autenticazione!
// Supporta Mailgun e Brevo. Switch: EMAIL_PROVIDER=mailgun|brevo

const provider = process.env.BREVO_KEY ? 'brevo' : 'mailgun';

module.exports = async (req, res) => {
  const authToken = req.headers.authorization?.replace('Bearer ', '');
  if (authToken !== process.env.NEWSLETTER_AUTH_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (provider === 'brevo') {
      const apiKey = process.env.BREVO_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'BREVO_KEY non configurata in Vercel' });
      }
      const contactEmail = process.env.CONTACT_EMAIL || 'giovanni.pitton2@gmail.com';
      const resApi = await fetch(
        `https://api.brevo.com/v3/smtp/statistics/events?days=30&event=delivered&email=${encodeURIComponent(contactEmail)}&limit=100`,
        { headers: { 'api-key': apiKey } }
      );
      const data = await resApi.json();
      const events = data.events || [];
      const contacts = events.map(e => ({
        from: e.from,
        to: e.email,
        subject: e.subject,
        timestamp: e.date
      }));

      return res.status(200).json({
        success: true,
        total: contacts.length,
        contacts,
        provider: 'brevo'
      });
    }

    // Mailgun
    const Mailgun = require('mailgun.js');
    const formData = require('form-data');
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY
    });
    const domain = process.env.MAILGUN_DOMAIN;

    const events = await mg.events.get(domain, {
      limit: 100,
      event: 'delivered',
      'begin': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    const contacts = (events.items || [])
      .filter(item => item.message && item.message.headers)
      .map(item => ({
        from: item.message.headers.from,
        to: item.message.headers.to,
        subject: item.message.headers.subject,
        timestamp: item.timestamp
      }));

    return res.status(200).json({
      success: true,
      total: contacts.length,
      contacts,
      provider: 'mailgun'
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(200).json({
      success: true,
      message: 'I contatti vengono inviati alla tua email. Controlla la casella di posta.',
      note: 'Per un sistema più avanzato, considera di salvare i contatti in un database.'
    });
  }
};
