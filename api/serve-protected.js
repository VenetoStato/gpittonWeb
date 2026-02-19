// GET: serve outreach.html o list-contatti.html SOLO se autenticato
// Se non autenticato -> 302 redirect a /login.html
// Usato da rewrite in vercel.json

const { jwtVerify } = require('jose');
const fs = require('fs');
const path = require('path');

const COOKIE_NAME = 'gp_auth';
const PAGES = {
  outreach: 'outreach.html',
  'list-contatti': 'list-contatti.html'
};

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  const page = (req.query?.page || 'outreach').toLowerCase();
  const filename = PAGES[page] || PAGES.outreach;
  const filePath = path.join(__dirname, '..', filename);

  const secret = process.env.OUTREACH_JWT_SECRET;
  const cookie = req.headers.cookie || '';
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const token = match ? match[1] : null;

  if (!secret || !token) {
    return res.redirect(302, `/login.html?redirect=${encodeURIComponent(filename)}`);
  }

  try {
    const secretKey = new TextEncoder().encode(secret);
    await jwtVerify(token, secretKey);
  } catch {
    return res.redirect(302, `/login.html?redirect=${encodeURIComponent(filename)}`);
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Page not found');
  }

  const html = fs.readFileSync(filePath, 'utf8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
};
