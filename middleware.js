// Vercel Edge Middleware
// - Redirect basato su ?lang= e geolocalizzazione
// - Protezione outreach.html e list-contatti.html (solo con auth)

import { jwtVerify } from 'jose';

const PROTECTED_PATHS = ['/outreach.html', '/outreach', '/list-contatti.html', '/list-contatti'];
const COOKIE_NAME = 'gp_auth';

export const config = {
  matcher: ['/', '/index.html', '/index-en.html', '/outreach.html', '/outreach', '/list-contatti.html', '/list-contatti']
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Pagine protette: SEMPRE richiedi auth (outreach, list-contatti)
  if (PROTECTED_PATHS.includes(path)) {
    const secret = process.env.OUTREACH_JWT_SECRET;
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    const token = match ? match[1] : null;

    if (!token || !secret) {
      return Response.redirect(url.origin + '/login.html?redirect=' + encodeURIComponent(path), 302);
    }

    try {
      const secretKey = new TextEncoder().encode(secret);
      await jwtVerify(token, secretKey);
      return; // Auth OK, passa (Vercel continua a servire il file)
    } catch {
      return Response.redirect(url.origin + '/login.html?redirect=' + encodeURIComponent(path), 302);
    }
  }

  // Redirect lingua (solo per home)
  const lang = url.searchParams.get('lang');
  const country = (request.headers.get('x-vercel-ip-country') || '').toUpperCase();

  if (lang === 'en') {
    if (path.includes('index-en')) return;
    return Response.redirect(url.origin + '/index-en.html', 302);
  }
  if (lang === 'it') {
    if (!path.includes('index-en')) return;
    return Response.redirect(url.origin + '/?lang=it', 302);
  }

  if (path.includes('index-en')) return;
  if (country === 'IT' || country === 'CH') return;

  return Response.redirect(url.origin + '/index-en.html', 302);
}
