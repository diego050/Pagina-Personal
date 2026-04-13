import os
import glob
from PIL import Image
import sqlite3

base_dir = r"c:\Users\Usuario\Documents\programacion\pagina-personal\backend\static\uploads"

# Connect to the DB
conn = sqlite3.connect(r"c:\Users\Usuario\Documents\programacion\pagina-personal\backend\database.db")
cursor = conn.cursor()

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.jpg', '.jpeg', '.png']:
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, base_dir).replace("\\", "/")
                print(f"Processing {rel_path}...")
                
                try:
                    with Image.open(filepath) as img:
                        if img.mode in ("RGBA", "P"):
                            img = img.convert("RGB")
                            
                        width, height = img.size
                        filename, _ = os.path.splitext(file)
                        webp_name = f"{filename}.webp"
                        webp_path = os.path.join(root, webp_name)
                        
                        img.save(webp_path, "WEBP", quality=80)
                        
                        sizes = {"sm": 400, "md": 800, "lg": 1200}
                        for suffix, max_w in sizes.items():
                            if width > max_w:
                                ratio = max_w / float(width)
                                new_h = int(float(height) * float(ratio))
                                resized = img.resize((max_w, new_h), Image.Resampling.LANCZOS)
                                resized.save(os.path.join(root, f"{filename}-{suffix}.webp"), "WEBP", quality=80)

                        new_rel_path = os.path.relpath(webp_path, base_dir).replace("\\", "/")
                        
                        # Check if MediaNode exists
                        cursor.execute("SELECT filepath FROM medianode WHERE filepath=?", (rel_path,))
                        row = cursor.fetchone()
                        if row:
                            # Update existing
                            cursor.execute("""
                                UPDATE medianode 
                                SET filepath=?, width=?, height=?, mime_type=?
                                WHERE filepath=?
                            """, (new_rel_path, width, height, "image/webp", rel_path))
                        else:
                            cursor.execute("""
                                INSERT INTO medianode (filepath, width, height, mime_type)
                                VALUES (?, ?, ?, ?)
                            """, (new_rel_path, width, height, "image/webp"))
                            
                        # Replace in Articles/Projects schemas
                        old_url = f"http://localhost:8000/static/uploads/{rel_path}"
                        new_url = f"http://localhost:8000/static/uploads/{new_rel_path}"
                        
                        cursor.execute("UPDATE article SET image_url=? WHERE image_url=?", (new_url, old_url))
                        cursor.execute("UPDATE project SET image_url=? WHERE image_url=?", (new_url, old_url))
                        
                        # Remove original file (we already backed it up)
                        os.remove(filepath)
                        
                except Exception as e:
                    print(f"Failed to process {rel_path}: {e}")

process_directory(base_dir)
conn.commit()
conn.close()
print("Migration completed.")
