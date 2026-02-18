// Invia mail HTML di test a CONTACT_EMAIL
// POST a /api/send-test-email (nessun auth richiesto per semplicità - usa solo per test)

// Default HTML usato se non passato nel body. Per mail completa usa mail-comunicazione.html via POST.
const DEFAULT_HTML = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><style>body{margin:0;font-family:Segoe UI,sans-serif;background:#f4f4f4}.w{max-width:600px;margin:0 auto;background:#fff}.h{background:linear-gradient(135deg,#0052cc,#0066ff);padding:32px 24px;text-align:center;color:#fff}.hb{display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap}.hl{height:56px;width:auto;max-width:160px;object-fit:contain}.hp{width:70px;height:105px;border-radius:8px;border:3px solid rgba(255,255,255,.9);object-fit:cover;object-position:top}.ht{margin-top:12px}.c{padding:32px 24px;color:#333;line-height:1.6}.s{background:#f8fafc;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #0052cc}.cta{text-align:center;margin:28px 0}.cta a{display:inline-block;background:#0052cc;color:#fff!important;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600}.ft{background:#1a202c;color:#a0aec0;padding:24px;text-align:center;font-size:13px}.ft a{color:#63b3ed}</style></head><body><div class="w"><div class="h"><div class="hb"><img src="https://gpitton.com/images/Logo.png" alt="Logo" class="hl" width="140" height="56"><img src="https://gpitton.com/images/Presentation.png" alt="Giovanni Pitton" class="hp" width="70" height="105"></div><div class="ht"><h1 style="margin:0;font-size:24px">Giovanni Pitton</h1><p style="margin:8px 0 0;opacity:.9">Ingegnere Gestionale | Consulente Robotica e AI</p></div></div><div class="c"><p>Buongiorno,</p><p>Lavorate con <strong>robotica</strong>, <strong>automazione</strong> o <strong>cobot</strong>? Vi invito a scoprire come posso supportare i vostri progetti con consulenza tecnica e POC reali.</p><p>Sono <strong>Giovanni Pitton</strong>, Ingegnere Gestionale e programmatore con oltre 13 anni di esperienza. Lavoro presso <strong>Meko srl</strong> e offro <strong>servizi freelance</strong> per aziende che vogliono innovare.</p><h2 style="color:#0052cc;font-size:18px">Cosa offro</h2><div class="s"><ul><li><strong>Consulenza automazione</strong> – Analisi processi, identificazione tecnologie</li><li><strong>Robot umanoidi Unitree</strong> (G1, H2) e quadrupedi (Go2, A2, B2)</li><li><strong>Cobot Universal Robots</strong> e AMR MiR</li><li><strong>Sviluppo POC</strong> – simulazioni (MuJoCo, NVIDIA Isaac Sim) e <strong>POC fisici</strong>: metto in opera i prodotti</li><li><strong>Preventivi e progettazione</strong> proposte automazione</li></ul></div><p>Collaboro con <strong>20+ aziende integratrici</strong>, le principali università italiane, politecnici e ITS.</p><div class="cta"><a href="https://gpitton.com">Visita gpitton.com</a></div><p>Sarei lieto di una breve call (15 min). <strong>Scrivetemi o chiamatemi.</strong></p><p>Cordiali saluti,<br><strong>Giovanni Pitton</strong><br><a href="mailto:info@gpitton.com">info@gpitton.com</a> · <a href="tel:+393288216708">328 821 6708</a><br><a href="https://gpitton.com">gpitton.com</a> | <a href="https://linkedin.com/in/giovannipitton">LinkedIn</a></p></div><div class="ft"><p>Giovanni Pitton · San Donà di Piave, Veneto · <a href="mailto:info@gpitton.com">info@gpitton.com</a> · <a href="tel:+393288216708">328 821 6708</a> · <a href="https://gpitton.com">gpitton.com</a></p></div></div></body></html>`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL || 'giovanni.pitton2@gmail.com';
  const fromEmail = process.env.EMAIL_FROM || 'Giovanni Pitton <onboarding@resend.dev>';

  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY non configurata' });
  }

  try {
    const { html, subject, to } = req.body || {};
    const htmlContent = html || DEFAULT_HTML;
    const toEmailFinal = to || toEmail;

    const emailSubject = subject || 'Consulenza Robotica e AI - Giovanni Pitton';
    const resResend = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: emailSubject,
        html: htmlContent
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
