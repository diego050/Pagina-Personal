import sqlite3
import os

db_path = "/app/data/database.db"
if not os.path.exists(db_path):
    print(f"Error: {db_path} not found")
    exit(1)

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Update Project table
cur.execute("UPDATE project SET image_url = REPLACE(image_url, 'http://localhost:8000/', '/') WHERE image_url LIKE 'http://localhost:8000/%'")
projects_updated = cur.rowcount

# Update Article table
cur.execute("UPDATE article SET content = REPLACE(content, 'http://localhost:8000/', '/') WHERE content LIKE '%http://localhost:8000/%'")
articles_updated = cur.rowcount

conn.commit()
print(f"Finished. Projects updated: {projects_updated}, Articles updated: {articles_updated}")
conn.close()
