# -*- coding: utf-8 -*-
"""
Rewrites the Home hero / summary copy stored in the `sitecontent` table.

The strings in frontend/src/context/LanguageContext.tsx are only a fallback: on a
live site the CMS rows below win (see the sourceKeyMapping in that file). Changing
the code without running this script leaves the old copy on screen.

The values here are kept byte-identical to the static fallbacks so both paths
render the same text.

Safe to run repeatedly: it only UPDATEs (or INSERTs, if a row is missing) the exact
keys listed in CONTENT, never drops or deletes anything, and copies the database
file before touching it.

Usage:
    # Local (defaults to backend/database.db via DATABASE_URL)
    python maintenance/update_home_copy.py

    # Production, from /docker/diego-portfolio-v1 on the VPS:
    python3 backend/maintenance/update_home_copy.py backend/data/database.db
"""
import json
import os
import shutil
import sqlite3
import sys

ABOUT_SUMMARY_ES = (
    "Estudio negocios digitales, pero aprendí a construir. Diseño en Figma, programo "
    "el frontend, conecto el backend, testeo y lanzo. Esa combinación me permite tomar "
    "decisiones de producto sin depender de traducir lo que quiero a otra persona."
    "\n\n"
    "También estuve del lado que evalúa, viendo por qué unas startups consiguen "
    "inversión y otras se caen en la primera revisión. Construyo con eso en mente."
)

ABOUT_SUMMARY_EN = (
    "I study digital business, but I learned to build. I design in Figma, code the "
    "frontend, wire up the backend, test and ship. That combination lets me make product "
    "decisions without depending on someone else to translate what I want."
    "\n\n"
    "I have also been on the side that evaluates, seeing why some startups raise and "
    "others fall apart in the first review. I build with that in mind."
)

ABOUT_INTRO_ES = (
    "Empecé haciendo webs para clientes y terminé metido en cosas bastante distintas: "
    "un piloto educativo con usuarios reales, la estructuración de datos de un portafolio "
    "de venture capital, la operación de un negocio desde cero. Sectores que no tienen "
    "nada que ver entre sí."
    "\n\n"
    "El hilo es siempre el mismo. Entender cómo funciona algo y construir la pieza que le falta."
)

ABOUT_INTRO_EN = (
    "I started building websites for clients and ended up in fairly different places: "
    "an education pilot with real users, structuring the portfolio data of a venture "
    "capital fund, running a business from day zero. Sectors with nothing in common."
    "\n\n"
    "The thread is always the same. Understand how something works and build the piece "
    "it is missing."
)

# key -> (value, category, label, input_type). The last three are only used when the
# row has to be created; an existing row keeps its own metadata.
CONTENT = {
    "home_subtitle_es": (
        "PRODUCTO · DATOS · VENTURE CAPITAL",
        "home", "Hero Subtitle (ES)", "text"),
    "home_subtitle_en": (
        "PRODUCT · DATA · VENTURE CAPITAL",
        "home", "Hero Subtitle (EN)", "text"),

    "home_role_es": (
        "Construyo productos digitales y cuento sobre "
        "<span class='text-primary'>startups y venture capital</span>",
        "home", "Hero Role (HTML allowed) (ES)", "text"),
    "home_role_en": (
        "I build digital products and write about "
        "<span class='text-primary'>startups and venture capital</span>",
        "home", "Hero Role (HTML allowed) (EN)", "text"),

    "home_description_es": (
        "Vengo de negocios pero construyo. Diseño, programo y lanzo productos digitales, "
        "y explico cómo funciona el venture capital en Perú y LatAm.",
        "home", "Hero Description (ES)", "textarea"),
    "home_description_en": (
        "I come from business, but I build. I design, code and ship digital products, "
        "and I break down how venture capital works in Peru and LatAm.",
        "home", "Hero Description (EN)", "textarea"),

    "home_about_summary_es": (
        ABOUT_SUMMARY_ES, "home", "Home About Summary (ES)", "textarea"),
    "home_about_summary_en": (
        ABOUT_SUMMARY_EN, "home", "Home About Summary (EN)", "textarea"),

    "about_intro_es": (
        ABOUT_INTRO_ES, "about", "About Page Intro (ES)", "textarea"),
    "about_intro_en": (
        ABOUT_INTRO_EN, "about", "About Page Intro (EN)", "textarea"),

    # NOTE: these two rows are exposed in the admin panel but nothing renders them --
    # the About page reads the period out of about_education_* below. Kept in sync
    # anyway so the panel never shows a stale claim.
    "about_degree_details_es": (
        "2021 - 2026 | Décimo Ciclo", "about", "Degree Details (ES)", "text"),
    "about_degree_details_en": (
        "2021 - 2026 | 10th Cycle", "about", "Degree Details (EN)", "text"),
}

# Rows holding a JSON array, where only one field may change. Patching in place keeps
# every other field (including anything edited from the admin panel) untouched.
# key -> (index, field, new value)
JSON_PATCHES = {
    "about_education_es": (0, "period", "2021 - 2026 | Décimo Ciclo"),
    "about_education_en": (0, "period", "2021 - 2026 | 10th Cycle"),
}


def resolve_db_path():
    if len(sys.argv) > 1:
        return sys.argv[1]
    url = os.getenv("DATABASE_URL", "sqlite:///database.db")
    if not url.startswith("sqlite:"):
        sys.exit("Only sqlite DATABASE_URL is supported, got: %s" % url)
    path = url.split("sqlite:", 1)[1].lstrip("/")
    return "/" + path if url.startswith("sqlite:////") else path


def main():
    db_path = resolve_db_path()
    if not os.path.exists(db_path):
        sys.exit("Database not found: %s" % db_path)

    backup_path = db_path + ".bak-homecopy"
    shutil.copyfile(db_path, backup_path)
    print("Backup written to %s\n" % backup_path)

    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()

    for key, (value, category, label, input_type) in CONTENT.items():
        cursor.execute("SELECT value FROM sitecontent WHERE key=?", (key,))
        row = cursor.fetchone()
        if row is None:
            cursor.execute(
                "INSERT INTO sitecontent (key, value, category, label, input_type) "
                "VALUES (?, ?, ?, ?, ?)",
                (key, value, category, label, input_type),
            )
            action = "created"
        elif row[0] == value:
            action = "already up to date"
        else:
            cursor.execute("UPDATE sitecontent SET value=? WHERE key=?", (value, key))
            action = "updated"
        print("    %-26s %s" % (key, action))

    for key, (index, field, value) in JSON_PATCHES.items():
        cursor.execute("SELECT value FROM sitecontent WHERE key=?", (key,))
        row = cursor.fetchone()
        if row is None:
            print("    %-26s missing in this database, skipped" % key)
            continue
        data = json.loads(row[0])
        if index >= len(data):
            print("    %-26s entry %d not present, skipped" % (key, index))
            continue
        if data[index].get(field) == value:
            print("    %-26s %s already up to date" % (key, field))
            continue
        data[index][field] = value
        cursor.execute(
            "UPDATE sitecontent SET value=? WHERE key=?",
            (json.dumps(data, ensure_ascii=False, indent=2), key),
        )
        print("    %-26s %s updated" % (key, field))

    connection.commit()

    print("\nVerification (first 70 chars):")
    for key in CONTENT:
        cursor.execute("SELECT value FROM sitecontent WHERE key=?", (key,))
        row = cursor.fetchone()
        preview = row[0][:70].replace("\n", " / ") if row else "MISSING"
        # ascii-safe: the VPS console is not guaranteed to be UTF-8
        print("    %-26s %s" % (key, preview.encode("ascii", "replace").decode("ascii")))

    connection.close()
    print("\nDone. Restore from %s if anything looks wrong." % backup_path)


if __name__ == "__main__":
    main()
