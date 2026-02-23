#!/usr/bin/env python3
"""
Scraper potenziato: cerca email su siti aziendali, GitHub, più pagine.
Priorità: email con nomi > sales/contact > info (quando ce ne sono più).

Uso:
  python scraper_email_sito.py lista-aziende-it-300.csv -o email-verificate.csv --limit 50
  GITHUB_TOKEN=xxx python scraper_email_sito.py ...  # opzionale, per GitHub
"""

import re
import csv
import time
import json
import argparse
import requests
from pathlib import Path
from urllib.parse import urlparse, urljoin
from html import unescape

EMAIL_RE = re.compile(r"\b([a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,})\b")
SKIP = re.compile(r"\.(png|jpg|jpeg|gif|svg|webp|woff2?)|@2x|example\.com|sentry\.io|wixpress\.com|gravatar|github\.com/noreply")
FAKE = re.compile(r"nome@mail|mario\.rossi|email@dominio|@email\.com|u003e|\\$|@legalmail\.it|@pec\.|\.it\\|noreply|no-reply|donotreply")
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"

# Molte più pagine da controllare
PATHS = [
    "", "/contact", "/contatti", "/kontakt", "/impressum", "/contacts", "/contact-us",
    "/chi-siamo", "/about", "/about-us", "/team", "/il-nostro-team", "/contattaci",
    "/contact-us", "/get-in-touch", "/support", "/sales", "/commerciale",
    "/privacy", "/privacy-policy", "/legal", "/legal-notice", "/impressum",
    "/footer", "/credits", "/crediti", "/azienda", "/company",
    "/it/contact", "/it/contatti", "/en/contact", "/en/contacts",
]

# Parole nei link che indicano pagine contatti
CONTACT_KEYWORDS = ["contact", "contatti", "kontakt", "impressum", "about", "chi-siamo", "team", "support", "sales", "commerciale", "azienda", "company"]


def is_valid(s):
    if not s or len(s) > 80 or SKIP.search(s.lower()):
        return False
    return "@" in s and "." in s


def is_fake_email(addr):
    if not addr:
        return True
    a = addr.lower().strip()
    if FAKE.search(a):
        return True
    if "mario.rossi" in a or "email.com" in a or "dominio.com" in a:
        return True
    return False


def email_matches_domain(addr, site_domain):
    if not addr or not site_domain:
        return False
    dom = addr.split("@", 1)[1].lower() if "@" in addr else ""
    return dom == site_domain or dom.endswith("." + site_domain)


def domain_from_email(email):
    return email.split("@", 1)[1].strip().lower() if email and "@" in email else None


def email_score(addr):
    """Priorità: nome.cognome > sales/contact > info. Più alto = migliore."""
    local = addr.split("@", 1)[0].lower() if "@" in addr else ""
    if not local:
        return 0
    if "." in local and not any(x in local for x in ["info", "contact", "sales", "support", "admin"]):
        return 10  # nome.cognome@
    if "sales" in local or "commerciale" in local:
        return 8
    if "contact" in local or "contatti" in local:
        return 7
    if "support" in local:
        return 6
    if "info" in local:
        return 3
    if "admin" in local or "webmaster" in local:
        return 1
    return 5  # altro


def fetch(url, timeout=12):
    try:
        r = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=timeout)
        r.raise_for_status()
        return r.text
    except Exception:
        return ""


def extract_emails(html):
    found = set()
    for m in re.finditer(r"mailto:([^\"'?\s]+)", html, re.I):
        addr = unescape(m.group(1).split("?")[0].strip())
        if is_valid(addr):
            found.add(addr)
    for m in EMAIL_RE.finditer(html):
        addr = unescape(m.group(1))
        if is_valid(addr):
            found.add(addr)
    return found


def extract_links(html, base_url):
    """Estrae link dalla pagina che potrebbero essere pagine contatti."""
    parsed = urlparse(base_url)
    base = f"{parsed.scheme or 'https'}://{parsed.netloc}"
    links = set()
    for m in re.finditer(r'href=["\']([^"\']+)["\']', html, re.I):
        href = unescape(m.group(1).strip().split("#")[0].split("?")[0])
        if not href or href.startswith("javascript:") or href.startswith("mailto:"):
            continue
        full = urljoin(base_url, href)
        if not full.startswith(base) or full == base or full == base + "/":
            continue
        path_lower = href.lower()
        if any(kw in path_lower for kw in CONTACT_KEYWORDS):
            links.add(full)
    return list(links)[:15]  # max 15 link extra


def scrape_site(base_url, max_pages=8, discover_links=True):
    parsed = urlparse(base_url)
    base = f"{parsed.scheme or 'https'}://{parsed.netloc}".rstrip("/")
    all_emails = set()
    extra_links = set()

    # Pagine principali
    for path in PATHS[:max_pages]:
        url = base + path if path else base
        html = fetch(url)
        if html:
            all_emails.update(extract_emails(html))
            if discover_links:
                for link in extract_links(html, url):
                    if link.startswith(base):
                        extra_links.add(link)
        time.sleep(0.6)

    # Link scoperti (max 8)
    for url in list(extra_links)[:8]:
        html = fetch(url)
        if html:
            all_emails.update(extract_emails(html))
        time.sleep(0.6)

    return all_emails


def fetch_github_emails(domain, token=None):
    """Cerca email su GitHub (commit author) per il dominio. Richiede GITHUB_TOKEN."""
    if not token:
        return set()
    # Indovina org da dominio: reply.com -> reply, eng.it -> eng
    parts = domain.replace("www.", "").split(".")
    org_guess = parts[0] if parts else ""
    if len(org_guess) < 2:
        return set()

    headers = {"Authorization": f"token {token}", "Accept": "application/vnd.github.v3+json"}
    emails = set()

    try:
        # Prova a ottenere org
        r = requests.get(f"https://api.github.com/orgs/{org_guess}", headers=headers, timeout=10)
        if r.status_code != 200:
            return set()
        org_data = r.json()
        # Prendi alcuni repo
        repos = requests.get(f"https://api.github.com/orgs/{org_guess}/repos?sort=pushed&per_page=5", headers=headers, timeout=10)
        if repos.status_code != 200:
            return set()
        for repo in repos.json()[:3]:
            time.sleep(0.5)  # rate limit
            commits = requests.get(f"https://api.github.com/repos/{org_guess}/{repo['name']}/commits?per_page=20", headers=headers, timeout=10)
            if commits.status_code != 200:
                continue
            for c in commits.json():
                author = c.get("commit", {}).get("author", {})
                email = author.get("email", "")
                if email and domain in email.lower() and not is_fake_email(email):
                    emails.add(email)
    except Exception:
        pass
    return emails


def main():
    p = argparse.ArgumentParser()
    p.add_argument("csv", default="lista-contatti.csv", nargs="?")
    p.add_argument("-o", "--output", default="email-scraped.csv")
    p.add_argument("--col-company", default="Company")
    p.add_argument("--col-email", default="Email")
    p.add_argument("--limit", type=int, default=0)
    p.add_argument("--offset", type=int, default=0)
    p.add_argument("--delay", type=float, default=1.5)
    p.add_argument("--pages", type=int, default=10)
    p.add_argument("--no-github", action="store_true", help="Disabilita ricerca GitHub")
    args = p.parse_args()

    import os
    gh_token = os.environ.get("GITHUB_TOKEN", "")

    base = Path(__file__).parent
    inp = base / args.csv
    if not inp.exists():
        print(f"File non trovato: {inp}")
        return 1

    rows = []
    with open(inp, encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f, delimiter=";"):
            rows.append(dict(r))

    col_c = args.col_company
    col_e = args.col_email
    rows = rows[args.offset:]
    limit = args.limit or len(rows)
    results = []

    for i, row in enumerate(rows[:limit]):
        company = row.get(col_c, "")
        existing = row.get(col_e, "")
        dom = domain_from_email(existing)
        url = f"https://{dom}" if dom else None

        if not url:
            print(f"  [{i+1}] {company}: skip (no domain)")
            results.append({
                "Company": company, "Email_originale": existing, "Email_trovate": "",
                "Email_scelta": existing, "Sito": "", "Fonte": "skip"
            })
            continue

        print(f"  [{i+1}] {company} -> {url}")
        emails = scrape_site(url, args.pages)
        time.sleep(args.delay)

        # GitHub (opzionale)
        if gh_token and not args.no_github and dom:
            gh_emails = fetch_github_emails(dom, gh_token)
            if gh_emails:
                emails.update(gh_emails)
                print(f"      GitHub: +{len(gh_emails)} email")
            time.sleep(0.5)

        # Filtra: dominio aziendale, no fake
        valid = [e for e in emails if not is_fake_email(e) and email_matches_domain(e, dom)]
        if not valid:
            valid = [e for e in emails if not is_fake_email(e)]

        # Scegli la migliore (priorità a email con nomi, non solo info@)
        best = None
        if valid:
            best = max(valid, key=lambda e: (email_matches_domain(e, dom), email_score(e)))
        if not best:
            best = existing

        is_verified = best in valid and email_matches_domain(best, dom)
        fonte = "scraped" if is_verified else ("no_email" if not valid else "no_match")

        found_str = "; ".join(sorted(valid)) if valid else ""
        results.append({
            "Company": company, "Email_originale": existing, "Email_trovate": found_str,
            "Email_scelta": best or existing, "Sito": url,
            "Fonte": fonte
        })
        tag = "VERIFICATA" if is_verified else ("no_match" if valid else "nessuna")
        print(f"      -> {tag}: {best}")

    out = base / args.output
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["Company", "Email_originale", "Email_trovate", "Email_scelta", "Sito", "Fonte"], delimiter=";")
        w.writeheader()
        w.writerows(results)

    n = sum(1 for r in results if r["Fonte"] == "scraped")
    print(f"\nScritte {len(results)} righe in {out}")
    print(f"  Email verificate (trovate sui siti): {n}/{len(results)}")
    return 0


if __name__ == "__main__":
    exit(main())
