import sqlite3
import os

db_path = os.path.join('backend', 'database.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE article ADD COLUMN additional_links TEXT")
    print("Column additional_links added to article table.")
except sqlite3.OperationalError as e:
    print(f"Error or already exists: {e}")

conn.commit()
conn.close()
