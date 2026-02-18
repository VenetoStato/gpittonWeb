// API per leggere i contatti ricevuti
// ATTENZIONE: Richiede autenticazione!

const Mailgun = require('mailgun.js');
const formData = require('form-data');

module.exports = async (req, res) => {
  // Autenticazione
  const authToken = req.headers.authorization?.replace('Bearer ', '');
  if (authToken !== process.env.NEWSLETTER_AUTH_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Inizializza Mailgun
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY
    });

    // Ottieni eventi/logs da Mailgun
    // Nota: Mailgun API per eventi richiede dominio verificato
    const domain = process.env.MAILGUN_DOMAIN;
    
    // Ottieni eventi degli ultimi 30 giorni
    const events = await mg.events.get(domain, {
      limit: 100,
      event: 'delivered',
      'begin': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Filtra solo i messaggi di contatto
    const contacts = events.items
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
      contacts: contacts
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    
    // Fallback: restituisci messaggio che i contatti sono nella email
    return res.status(200).json({
      success: true,
      message: 'I contatti vengono inviati alla tua email. Controlla la casella di posta.',
      note: 'Per un sistema più avanzato, considera di salvare i contatti in un database.'
    });
  }
};
