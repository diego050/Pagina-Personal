import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

def add_column(table, col, dtype):
    try:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {col} {dtype};")
        print(f"Added {col} to {table}")
    except sqlite3.OperationalError as e:
        print(f"Failed to add {col} to {table}: {e}")

# MediaNode
add_column("medianode", "width", "INTEGER")
add_column("medianode", "height", "INTEGER")
add_column("medianode", "mime_type", "VARCHAR")

# Article
add_column("article", "image_alt", "VARCHAR")
add_column("article", "image_width", "INTEGER")
add_column("article", "image_height", "INTEGER")

# Project
add_column("project", "image_alt", "VARCHAR")
add_column("project", "image_width", "INTEGER")
add_column("project", "image_height", "INTEGER")

conn.commit()
conn.close()
