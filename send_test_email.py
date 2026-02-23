#!/usr/bin/env python3
"""Invia mail di test a giovanni.pitton2@gmail.com via Brevo.
Uso: python send_test_email.py [email]
Richiede: .env con BREVO_KEY"""
import os
import sys
from pathlib import Path

BASE = Path(__file__).parent
env_path = BASE / ".env"
if env_path.exists():
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            v = v.strip().strip("'\"")
            if k not in os.environ:
                os.environ[k] = v

try:
    import requests
except ImportError:
    print("Installa: pip install requests")
    sys.exit(1)

def main():
    to = sys.argv[1] if len(sys.argv) > 1 else "giovanni.pitton2@gmail.com"
    key = os.environ.get("BREVO_KEY")
    if not key:
        print("ERRORE: BREVO_KEY non trovata. Crea .env con BREVO_KEY=xxx")
        sys.exit(1)

    html_path = BASE / "mail-comunicazione.html"
    html_content = html_path.read_text(encoding="utf-8")
    subject = "Test email - Consulenza Robotica e AI - Giovanni Pitton"
    sender = os.environ.get("BREVO_SENDER_EMAIL", "info@gpitton.com")

    print(f"Invio email di test a {to}...")
    r = requests.post(
        "https://api.brevo.com/v3/smtp/email",
        headers={"accept": "application/json", "api-key": key, "content-type": "application/json"},
        json={
            "sender": {"name": "Giovanni Pitton", "email": sender},
            "to": [{"email": to}],
            "subject": subject,
            "htmlContent": html_content,
        },
        timeout=15,
    )
    data = r.json()
    if not r.ok:
        print("ERRORE:", data.get("message", data))
        sys.exit(1)
    print("OK! Email inviata. ID:", data.get("messageId", "ok"))

if __name__ == "__main__":
    main()
