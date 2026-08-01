# -*- coding: utf-8 -*-
"""
Repairs broken image URLs inside project and article markdown content.

Two failure modes show up when an image is pasted into the admin editor:

  1. An absolute dev host is baked in ("http://localhost:8000/static/uploads/x.webp"),
     which 404s for every visitor in production.
  2. The upload pipeline converts images to .webp, but the reference keeps the
     original extension (".jpeg"), so the file it points at never existed.

Both are fixed by rewriting the reference to a site-relative path with the extension
the file is actually stored under. The `medianode` table is the source of truth, so
this works the same locally and on the server.

Only references under /static/uploads/ are touched -- genuinely external images
(badges, CDNs) are left alone. A reference that cannot be resolved is reported, not
guessed at. Safe to run repeatedly, and it copies the database file first.

Usage:
    # Local (defaults to backend/database.db via DATABASE_URL)
    python maintenance/fix_media_urls.py

    # Production, from /docker/diego-portfolio-v1 on the VPS:
    python3 backend/maintenance/fix_media_urls.py backend/data/database.db
"""
import os
import re
import shutil
import sqlite3
import sys

UPLOADS_PREFIX = "/static/uploads/"

# Markdown images ![alt](url) and bare src="..." attributes
IMAGE_REF_RE = re.compile(r'!\[[^\]]*\]\(([^)\s]+)[^)]*\)|src=["\']([^"\']+)["\']')

# Tables/columns holding user-authored markup
TARGETS = [
    ("project", "content", "slug"),
    ("project", "content_en", "slug"),
    ("article", "content", "slug"),
    ("article", "content_en", "slug"),
]


def resolve_db_path():
    if len(sys.argv) > 1:
        return sys.argv[1]
    url = os.getenv("DATABASE_URL", "sqlite:///database.db")
    if not url.startswith("sqlite:"):
        sys.exit("Only sqlite DATABASE_URL is supported, got: %s" % url)
    path = url.split("sqlite:", 1)[1].lstrip("/")
    return "/" + path if url.startswith("sqlite:////") else path


def build_index(cursor):
    """filepath set, plus stem -> [filepath] for extension repair."""
    known, by_stem = set(), {}
    for (filepath,) in cursor.execute("SELECT filepath FROM medianode"):
        known.add(filepath)
        by_stem.setdefault(os.path.splitext(filepath)[0], []).append(filepath)
    return known, by_stem


def repair(url, known, by_stem):
    """Returns (new_url, note) or (None, reason) when it cannot be resolved safely."""
    # Make the path site-relative. Only /static/uploads/ URLs are in scope.
    path = re.sub(r'^https?://[^/]+', '', url)
    if not path.startswith(UPLOADS_PREFIX):
        return None, None                      # external image: not ours to touch

    filepath = path[len(UPLOADS_PREFIX):]
    notes = []
    if path != url:
        notes.append("absolute host removed")

    if filepath not in known:
        candidates = by_stem.get(os.path.splitext(filepath)[0], [])
        if len(candidates) != 1:
            return None, "no stored file matches %r" % filepath
        notes.append("extension %s -> %s" % (
            os.path.splitext(filepath)[1] or "(none)", os.path.splitext(candidates[0])[1]))
        filepath = candidates[0]

    new_url = UPLOADS_PREFIX + filepath
    return (new_url, ", ".join(notes)) if new_url != url else (None, None)


def main():
    db_path = resolve_db_path()
    if not os.path.exists(db_path):
        sys.exit("Database not found: %s" % db_path)

    backup_path = db_path + ".bak-mediaurls"
    shutil.copyfile(db_path, backup_path)
    print("Backup written to %s\n" % backup_path)

    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()
    known, by_stem = build_index(cursor)
    print("%d media files registered\n" % len(known))

    fixed = unresolved = 0

    for table, column, label_col in TARGETS:
        try:
            rows = cursor.execute(
                "SELECT rowid, %s, %s FROM %s" % (label_col, column, table)).fetchall()
        except sqlite3.OperationalError:
            continue                            # column does not exist in this schema

        for rowid, label, content in rows:
            if not content:
                continue
            replacements = {}
            for match in IMAGE_REF_RE.finditer(content):
                url = match.group(1) or match.group(2)
                if not url or url in replacements:
                    continue
                new_url, note = repair(url, known, by_stem)
                if new_url:
                    replacements[url] = new_url
                    print("%s.%s [%s]\n    %s\n -> %s\n    (%s)\n" % (
                        table, column, label, url, new_url, note))
                elif note:
                    print("%s.%s [%s]\n    %s\n    UNRESOLVED: %s\n" % (
                        table, column, label, url, note))
                    unresolved += 1

            if replacements:
                updated = content
                for old, new in replacements.items():
                    updated = updated.replace(old, new)
                cursor.execute(
                    "UPDATE %s SET %s=? WHERE rowid=?" % (table, column), (updated, rowid))
                fixed += len(replacements)

    connection.commit()
    connection.close()

    print("%d reference(s) fixed, %d unresolved." % (fixed, unresolved))
    if not fixed and not unresolved:
        print("Nothing to do -- every image URL already points at a stored file.")
    print("Restore from %s if anything looks wrong." % backup_path)


if __name__ == "__main__":
    main()
