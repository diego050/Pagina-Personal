import sqlite3
import re

def fix_content(content):
    if not content:
        return content
    
    # 1. Update folder path
    # Replace /projects/ with /static/uploads/projects/
    content = content.replace('/projects/', '/static/uploads/projects/')
    
    # 2. Update extensions to .webp (since we optimized everything to webp)
    # This regex looks for image references and replaces common formats with .webp
    # It specifically targets our projects folder
    pattern = r'(\/static\/uploads\/projects\/[a-zA-Z0-9_-]+)\.(png|jpg|jpeg)'
    content = re.sub(pattern, r'\1.webp', content)
    
    return content

def migrate():
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        
        # Update Projects
        cursor.execute("SELECT id, content FROM project")
        projects = cursor.fetchall()
        for p_id, content in projects:
            new_content = fix_content(content)
            if new_content != content:
                cursor.execute("UPDATE project SET content = ? WHERE id = ?", (new_content, p_id))
                print(f"Updated Project ID: {p_id}")
        
        # Update Articles
        cursor.execute("SELECT id, content FROM article")
        articles = cursor.fetchall()
        for a_id, content in articles:
            new_content = fix_content(content)
            if new_content != content:
                cursor.execute("UPDATE article SET content = ? WHERE id = ?", (new_content, a_id))
                print(f"Updated Article ID: {a_id}")
                
        conn.commit()
        print("Migration completed successfully.")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    migrate()
