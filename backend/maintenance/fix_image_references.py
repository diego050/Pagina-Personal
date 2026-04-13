import sqlite3
import os

def fix_image_references():
    db_path = 'database.db'
    if not os.path.exists(db_path):
        print("Database not found!")
        return

    conn = sqlite3.connect(db_path)
    c = conn.cursor()

    def update_url(url):
        if not url: return url
        # Skip if already webp and prefixed
        if url.endswith('.webp') and url.startswith('/static/uploads/'):
            return url
        
        # Strip old extensions
        new_url = url
        for ext in ['.jpg', '.jpeg', '.png', '.JPG', '.PNG', '.JPEG']:
            if new_url.endswith(ext):
                new_url = new_url[:-(len(ext))] + '.webp'
                break
        
        # Ensure it starts with /static/uploads/ if it's a relative local path
        if not new_url.startswith('http') and not new_url.startswith('/static/uploads/'):
            # Prepend /static/uploads/ if it looks like a local path (no leading slash or relative)
            clean_path = new_url.lstrip('/')
            new_url = f'/static/uploads/{clean_path}'
            
        return new_url

    print("Updating Projects...")
    c.execute("SELECT id, image_url FROM project")
    projects = c.fetchall()
    for pid, url in projects:
        new_url = update_url(url)
        if new_url != url:
            print(f"  Project {pid}: {url} -> {new_url}")
            c.execute("UPDATE project SET image_url = ? WHERE id = ?", (new_url, pid))

    print("Updating Articles...")
    c.execute("SELECT id, image_url FROM article")
    articles = c.fetchall()
    for aid, url in articles:
        new_url = update_url(url)
        if new_url != url:
            print(f"  Article {aid}: {url} -> {new_url}")
            c.execute("UPDATE article SET image_url = ? WHERE id = ?", (new_url, aid))

    print("Updating SiteContent (Values)...")
    c.execute("SELECT key, value FROM sitecontent")
    contents = c.fetchall()
    for key, value in contents:
        # Check if value looks like an image path
        if any(ext in value.lower() for ext in ['.jpg', '.jpeg', '.png']):
            new_value = update_url(value)
            if new_value != value:
                print(f"  Content {key}: {value} -> {new_value}")
                c.execute("UPDATE sitecontent SET value = ? WHERE key = ?", (new_value, key))

    conn.commit()
    conn.close()
    print("Optimization DB update complete.")

if __name__ == "__main__":
    fix_image_references()
