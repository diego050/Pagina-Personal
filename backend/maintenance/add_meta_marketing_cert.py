# -*- coding: utf-8 -*-
"""
Adds the Meta Marketing Analytics grouped certificate to the site content.

The certifications rendered on /sobre-mi come from the `sitecontent` table, NOT from
frontend/src/data/*.ts (those files are not imported anywhere). So this entry has to be
inserted into each environment's database separately.

Safe to run repeatedly: it replaces an existing "Meta Marketing Analytics" entry instead
of duplicating it. It only UPDATEs the three certification rows -- it never drops,
recreates or deletes anything, and it copies the database file first.

Usage:
    # On the VPS host (path of the sqlite file mounted into the backend container):
    python3 backend/maintenance/add_meta_marketing_cert.py /docker/diego-portfolio-v1/backend/data/database.db

    # Or let it read DATABASE_URL (sqlite:///... / sqlite:////...):
    python3 backend/maintenance/add_meta_marketing_cert.py
"""
import json
import os
import shutil
import sqlite3
import sys

FILES = [
    ("Marketing Analytics with Meta", "Marketing-Analytics-with-Meta.pdf"),
    ("Data Analysis with Spreadsheets and SQL", "Data-Analysis-with-Spreadsheets-and-SQL.pdf"),
    ("Python Data Analytics", "Python-Data-Analytics.pdf"),
    ("Statistics Foundations", "Statistics-Foundations.pdf"),
    ("Data Analytics Methods for Marketing", "Data-Analytics-Methods-for-Marketing.pdf"),
]
FILE_ENTRIES = [
    {"name": name, "href": "/certificates/coursera-marketing/" + filename}
    for name, filename in FILES
]

ES_ITEM = {
    "title": "Meta Marketing Analytics (Certificado Profesional)",
    "issuer": "Meta | Coursera",
    "year": "2026",
    "description": (
        "Programa profesional de Meta en analítica de marketing: SQL y hojas de cálculo, "
        "Python, estadística y métodos de medición para optimizar campañas con datos."
    ),
    "color": "cyan",
    "zipName": "meta-marketing-analytics-certificados",
    "files": FILE_ENTRIES,
}

EN_ITEM = {
    "title": "Meta Marketing Analytics (Professional Certificate)",
    "issuer": "META | COURSERA",
    "year": "2026",
    "description": (
        "Meta's professional program in marketing analytics: SQL and spreadsheets, Python, "
        "statistics, and measurement methods to optimize campaigns with data."
    ),
    "color": "blue",
    "badge": "Certificate",
    "zipName": "meta-marketing-analytics-certificates",
    "files": FILE_ENTRIES,
}

# Which content row gets which translation. "about_certifications" is the legacy
# fallback key the frontend uses when a language-specific row is missing.
TARGETS = {
    "about_certifications_es": ES_ITEM,
    "about_certifications_en": EN_ITEM,
    "about_certifications": ES_ITEM,
}

TARGET_CATEGORIES = ("Análisis de Datos", "Data Analysis")
TITLE_MARK = "Meta Marketing Analytics"


def resolve_db_path():
    if len(sys.argv) > 1:
        return sys.argv[1]
    url = os.getenv("DATABASE_URL", "sqlite:///database.db")
    if not url.startswith("sqlite:"):
        sys.exit("Only sqlite DATABASE_URL is supported, got: %s" % url)
    path = url.split("sqlite:", 1)[1].lstrip("/")
    # sqlite:////abs/path keeps a leading slash after stripping the scheme
    return "/" + path if url.startswith("sqlite:////") else path


def apply_item(raw_value, item):
    """Returns (new_json, action). Never removes existing entries."""
    data = json.loads(raw_value)
    for category in data:
        if category.get("category") not in TARGET_CATEGORIES:
            continue
        items = category.setdefault("items", [])
        for index, existing in enumerate(items):
            if TITLE_MARK in (existing.get("title") or ""):
                items[index] = item
                return json.dumps(data, ensure_ascii=False, indent=2), "replaced"
        items.insert(0, item)
        return json.dumps(data, ensure_ascii=False, indent=2), "inserted"

    found = [c.get("category") for c in data]
    return None, "category not found (looked for %s, database has %s)" % (
        list(TARGET_CATEGORIES), found)


def main():
    db_path = resolve_db_path()
    if not os.path.exists(db_path):
        sys.exit("Database not found: %s" % db_path)

    backup_path = db_path + ".bak-meta-cert"
    shutil.copyfile(db_path, backup_path)
    print("Backup written to %s" % backup_path)

    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()
    failed = False

    for key, item in TARGETS.items():
        cursor.execute("SELECT value FROM sitecontent WHERE key=?", (key,))
        row = cursor.fetchone()
        if not row:
            print("  %-28s missing in this database, skipped" % key)
            continue

        new_value, action = apply_item(row[0], item)
        if new_value is None:
            print("  %-28s NOT UPDATED: %s" % (key, action))
            failed = True
            continue

        cursor.execute("UPDATE sitecontent SET value=? WHERE key=?", (new_value, key))
        print("  %-28s %s" % (key, action))

    connection.commit()

    print("\nVerification:")
    for key in TARGETS:
        cursor.execute("SELECT value FROM sitecontent WHERE key=?", (key,))
        row = cursor.fetchone()
        if not row:
            continue
        for category in json.loads(row[0]):
            for entry in category.get("items", []):
                if TITLE_MARK in (entry.get("title") or ""):
                    print("  %-28s category=%s files=%d zip=%s" % (
                        key, category["category"], len(entry.get("files", [])),
                        entry.get("zipName")))
    connection.close()

    if failed:
        sys.exit("\nSome rows were not updated. The database was NOT corrupted; "
                 "restore from %s if needed." % backup_path)
    print("\nDone. Restart the backend container to serve the new content.")


if __name__ == "__main__":
    main()
