# -*- coding: utf-8 -*-
"""
Upserts certifications that the admin panel cannot express.

The certifications shown on /sobre-mi live in the `sitecontent` table, and the admin
editor only exposes title/issuer/year/color/description. Anything with a `href`
(downloadable PDF) has to be written here.

Add new entries to CERTIFICATES below and re-run. Safe to run repeatedly: an entry
whose title already exists is replaced, never duplicated. Only UPDATEs the three
certification rows -- it never drops, recreates or deletes anything, and it copies
the database file before touching it.

Usage:
    # Local (defaults to backend/database.db via DATABASE_URL)
    python maintenance/upsert_certifications.py

    # Production, from /docker/diego-portfolio-v1 on the VPS:
    python3 backend/maintenance/upsert_certifications.py backend/data/database.db
"""
import json
import os
import shutil
import sqlite3
import sys

# Each entry: the categories it belongs to (ES and EN names as stored in the DB),
# a stable substring used to find an existing copy, and the ES/EN payloads.
CERTIFICATES = [
    {
        "match": "Meta Marketing Analytics",
        "categories": ("Análisis de Datos", "Data Analysis"),
        "es": {
            "title": "Meta Marketing Analytics (Certificado Profesional)",
            "issuer": "Meta | Coursera",
            "year": "2026",
            "description": (
                "Programa profesional de Meta en analítica de marketing: SQL y hojas de cálculo, "
                "Python, estadística y métodos de medición para optimizar campañas con datos."
            ),
            "color": "cyan",
            "href": "/certificates/meta-marketing.pdf",
        },
        "en": {
            "title": "Meta Marketing Analytics (Professional Certificate)",
            "issuer": "META | COURSERA",
            "year": "2026",
            "description": (
                "Meta's professional program in marketing analytics: SQL and spreadsheets, Python, "
                "statistics, and measurement methods to optimize campaigns with data."
            ),
            "color": "blue",
            "badge": "Certificate",
            "href": "/certificates/meta-marketing.pdf",
        },
    },
    {
        "match": "GenAI",
        "categories": ("Análisis de Datos", "Data Analysis"),
        "es": {
            "title": "GenAI para Analistas de Datos",
            "issuer": "Coursera",
            "year": "2026",
            "description": (
                "Aplicación de IA generativa al análisis de datos: preprocesamiento, reconocimiento "
                "de patrones, análisis predictivo y generación de informes para ganar productividad."
            ),
            "color": "cyan",
            "href": "/certificates/genai-coursera.pdf",
        },
        "en": {
            "title": "GenAI for Data Analysts",
            "issuer": "COURSERA",
            "year": "2026",
            "description": (
                "Applying generative AI to data analysis: preprocessing, pattern recognition, "
                "predictive analysis, and report generation to boost productivity."
            ),
            "color": "blue",
            "badge": "Course",
            "href": "/certificates/genai-coursera.pdf",
        },
    },
]

# "about_certifications" is the legacy fallback key the frontend reads when a
# language-specific row is missing.
ROW_LANGUAGES = {
    "about_certifications_es": "es",
    "about_certifications_en": "en",
    "about_certifications": "es",
}


def resolve_db_path():
    if len(sys.argv) > 1:
        return sys.argv[1]
    url = os.getenv("DATABASE_URL", "sqlite:///database.db")
    if not url.startswith("sqlite:"):
        sys.exit("Only sqlite DATABASE_URL is supported, got: %s" % url)
    path = url.split("sqlite:", 1)[1].lstrip("/")
    return "/" + path if url.startswith("sqlite:////") else path


def upsert(data, cert, lang):
    """Inserts or replaces one certificate in the parsed content. Returns an action label."""
    item = cert[lang]
    for category in data:
        if category.get("category") not in cert["categories"]:
            continue
        items = category.setdefault("items", [])
        for index, existing in enumerate(items):
            if cert["match"] in (existing.get("title") or ""):
                items[index] = item
                return "replaced"
        items.insert(0, item)
        return "inserted"
    return "category not found (wanted %s, database has %s)" % (
        list(cert["categories"]), [c.get("category") for c in data])


def main():
    db_path = resolve_db_path()
    if not os.path.exists(db_path):
        sys.exit("Database not found: %s" % db_path)

    backup_path = db_path + ".bak-certs"
    shutil.copyfile(db_path, backup_path)
    print("Backup written to %s\n" % backup_path)

    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()
    failed = False

    for key, lang in ROW_LANGUAGES.items():
        cursor.execute("SELECT value FROM sitecontent WHERE key=?", (key,))
        row = cursor.fetchone()
        if not row:
            print("%s: missing in this database, skipped" % key)
            continue

        data = json.loads(row[0])
        print("%s:" % key)
        for cert in CERTIFICATES:
            action = upsert(data, cert, lang)
            print("    %-26s %s" % (cert["match"], action))
            if action.startswith("category not found"):
                failed = True

        cursor.execute(
            "UPDATE sitecontent SET value=? WHERE key=?",
            (json.dumps(data, ensure_ascii=False, indent=2), key),
        )

    connection.commit()

    print("\nVerification:")
    for key in ROW_LANGUAGES:
        cursor.execute("SELECT value FROM sitecontent WHERE key=?", (key,))
        row = cursor.fetchone()
        if not row:
            continue
        for category in json.loads(row[0]):
            for entry in category.get("items", []):
                for cert in CERTIFICATES:
                    if cert["match"] in (entry.get("title") or ""):
                        extra = entry.get("href", "")
                        print("    %-26s %-22s %s" % (key, cert["match"], extra))
    connection.close()

    if failed:
        sys.exit("\nSome entries were not written. The database was NOT corrupted; "
                 "restore from %s if needed." % backup_path)
    print("\nDone.")


if __name__ == "__main__":
    main()
