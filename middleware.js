// Vercel Edge Middleware - redirect basato su ?lang= e geolocalizzazione
// IT, CH = italiano | NO e resto mondo = inglese
// ?lang=en forza inglese | ?lang=it forza italiano

export const config = {
  matcher: ['/', '/index.html', '/index-en.html']
};

export default function middleware(request) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang');
  const country = (request.headers.get('x-vercel-ip-country') || '').toUpperCase();
  const path = url.pathname;

  // Override esplicito ?lang=
  if (lang === 'en') {
    if (path.includes('index-en')) return; // già su EN
    return Response.redirect(url.origin + '/index-en.html', 302);
  }
  if (lang === 'it') {
    if (!path.includes('index-en')) return; // già su IT
    return Response.redirect(url.origin + '/?lang=it', 302);
  }

  // Chi chiede index-en.html senza ?lang=it -> passa
  if (path.includes('index-en')) return;

  // Geo: Italia e Svizzera -> italiano (passa, serve index.html)
  if (country === 'IT' || country === 'CH') return;

  // Norvegia e resto mondo -> inglese
  return Response.redirect(url.origin + '/index-en.html', 302);
}
