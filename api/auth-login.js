// POST: login per pagine protette (outreach, list-contatti)
// Body: { password: "..." } oppure { idToken: "..." } per Google
// Solo giovanni.pitton2@gmail.com autorizzato (per Google)
// Env: OUTREACH_PASSWORD, OUTREACH_JWT_SECRET, GOOGLE_CLIENT_ID (opzionale)

const { SignJWT, jwtVerify } = require('jose');

const ALLOWED_EMAIL = 'giovanni.pitton2@gmail.com';
const COOKIE_NAME = 'gp_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 ore

async function verifyGoogleToken(idToken, clientId) {
  const res = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken));
  if (!res.ok) return null;
  const data = await res.json();
  if (data.aud !== clientId && data.aud !== clientId.replace('.apps.googleusercontent.com', '')) return null;
  if (data.email !== ALLOWED_EMAIL) return null;
  return data.email;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.OUTREACH_JWT_SECRET;
  const password = process.env.OUTREACH_PASSWORD;

  if (!secret || !password) {
    return res.status(500).json({ error: 'Auth non configurata. Imposta OUTREACH_PASSWORD e OUTREACH_JWT_SECRET in Vercel.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    let email = null;

    if (body.idToken && process.env.GOOGLE_CLIENT_ID) {
      email = await verifyGoogleToken(body.idToken, process.env.GOOGLE_CLIENT_ID);
      if (!email) {
        return res.status(401).json({ error: 'Email non autorizzata. Solo ' + ALLOWED_EMAIL });
      }
    } else if (body.password) {
      if (body.password !== password) {
        return res.status(401).json({ error: 'Password errata' });
      }
      email = ALLOWED_EMAIL;
    } else {
      return res.status(400).json({ error: 'Fornisci password o idToken' });
    }

    const secretKey = new TextEncoder().encode(secret);
    const token = await new SignJWT({ email, iat: Date.now() })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(COOKIE_MAX_AGE + 's')
      .sign(secretKey);

    const isProd = process.env.VERCEL_ENV === 'production';
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; ${isProd ? 'Secure; ' : ''}HttpOnly`);
    const redirect = (body.redirect || 'outreach.html').replace(/\.html$/, '');
    return res.status(200).json({ success: true, redirect: '/app/' + (redirect === 'list-contatti' ? 'list-contatti' : 'outreach') });
  } catch (e) {
    console.error('Auth error:', e);
    return res.status(500).json({ error: e.message || 'Errore login' });
  }
};
