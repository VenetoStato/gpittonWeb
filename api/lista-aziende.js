// GET: restituisce CSV lista aziende. ?list=ch-no|it
// Richiede cookie gp_auth valido (login)

const { jwtVerify } = require('jose');
const fs = require('fs');
const path = require('path');

const COOKIE_NAME = 'gp_auth';

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.OUTREACH_JWT_SECRET;
  if (!secret) {
    return res.status(500).send('Auth non configurata');
  }

  const cookie = req.headers.cookie || '';
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const token = match ? match[1] : null;

  if (!token) {
    return res.status(401).setHeader('Content-Type', 'text/plain').send('Non autenticato');
  }

  try {
    const secretKey = new TextEncoder().encode(secret);
    await jwtVerify(token, secretKey);
  } catch {
    return res.status(401).setHeader('Content-Type', 'text/plain').send('Sessione scaduta');
  }

  const list = (req.query?.list || 'ch-no').toLowerCase();
  const filename = list === 'it' ? 'lista-aziende-100.csv' : 'lista-aziende-ch-no.csv';
  const filePath = path.join(__dirname, '..', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File non trovato');
  }

  const content = fs.readFileSync(filePath, 'utf8');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  return res.status(200).send(content);
};
