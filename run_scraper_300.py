#!/usr/bin/env python3
"""
1. Esegui prima: python unisci_liste_italiane.py  (crea lista-aziende-it-300.csv)
2. Poi: python run_scraper_300.py

Lo scraper visita i siti, cerca email nelle pagine, verifica che siano sul dominio aziendale.
Output: lista-300-verificate.csv (fino a 300 email verificate trovate sui siti).
"""
import csv
import os
import subprocess
import sys
from pathlib import Path

BASE = Path(__file__).parent
TARGET = 300
BATCH = 100
INPUT = BASE / "lista-aziende-it-300.csv"
OUTPUT = BASE / "lista-300-verificate.csv"


def load_verified(path):
    """Carica da output scraper (Fonte=scraped) o da lista-300-verificate.csv"""
    rows = []
    if not path.exists():
        return rows
    with open(path, encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f, delimiter=";"):
            if "Fonte" in r and r.get("Fonte") != "scraped":
                continue
            email = r.get("Email_scelta") or r.get("Email", "")
            if email and "@" in email:
                rows.append({
                    "Company": r.get("Company", ""),
                    "Email": email,
                    "Sito": r.get("Sito", ""),
                })
    return rows


def main():
    if not INPUT.exists():
        print(f"Esegui prima: python unisci_liste_italiane.py")
        print(f"  (crea {INPUT.name})")
        return 1

    # Riprende da lista-300-verificate.csv se esiste (per riprendere run interrotto)
    verified = load_verified(OUTPUT) if OUTPUT.exists() else []
    seen = {(r["Company"], r["Email"]) for r in verified}
    print(f"Già verificate: {len(verified)}")

    offset = 0
    while len(verified) < TARGET:
        print(f"\n--- Batch: offset={offset}, limit={BATCH} ---")
        out = BASE / "email-batch-300.csv"
        ret = subprocess.run([
            sys.executable, str(BASE / "scraper_email_sito.py"),
            str(INPUT),
            "-o", str(out),
            "--col-company", "Company",
            "--col-email", "Email",
            "--limit", str(BATCH),
            "--offset", str(offset),
            "--delay", "1.5",
            "--pages", "10",
        ], cwd=str(BASE), capture_output=False, env={**os.environ})
        if ret.returncode != 0:
            print("Errore scraper")
            break

        if not out.exists():
            break

        # Lo scraper output ha Company, Email_originale, Email_trovate, Email_scelta, Sito, Fonte
        with open(out, encoding="utf-8", newline="") as f:
            for r in csv.DictReader(f, delimiter=";"):
                if r.get("Fonte") == "scraped":
                    row = {
                        "Company": r.get("Company", ""),
                        "Email": r.get("Email_scelta", ""),
                        "Sito": r.get("Sito", ""),
                    }
                    key = (row["Company"], row["Email"])
                    if key not in seen:
                        seen.add(key)
                        verified.append(row)

        print(f"Totale verificate: {len(verified)}")
        if len(verified) >= TARGET:
            break

        offset += BATCH
        with open(INPUT, encoding="utf-8", newline="") as f:
            total = sum(1 for _ in csv.DictReader(f, delimiter=";"))
        if offset >= total:
            print("Lista esaurita")
            break

    verified = verified[:TARGET]
    with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["Company", "Email", "Sito"], delimiter=";")
        w.writeheader()
        w.writerows(verified)

    print(f"\nScritte {len(verified)} email verificate in {OUTPUT}")
    return 0


if __name__ == "__main__":
    exit(main())
