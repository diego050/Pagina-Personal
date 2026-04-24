import os
import sys
from PIL import Image
import shutil

def process_images(source_dir, target_dir):
    print(f"Processing images from {source_dir} to {target_dir}")
    
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    variants = [
        ("sm", 400),
        ("md", 800),
        ("lg", 1200)
    ]

    supported_formats = (".jpg", ".jpeg", ".png", ".webp")

    for root, dirs, files in os.walk(source_dir):
        for file in files:
            if file.lower().endswith(supported_formats):
                file_path = os.path.join(root, file)
                
                # Determine relative path to maintain folder structure
                rel_path = os.path.relpath(root, source_dir)
                dest_folder = os.path.join(target_dir, rel_path)
                
                if not os.path.exists(dest_folder):
                    os.makedirs(dest_folder)

                base_name = os.path.splitext(file)[0]
                output_filename = f"{base_name}.webp"
                output_path = os.path.join(dest_folder, output_filename)

                try:
                    with Image.open(file_path) as img:
                        # Convert to RGB if necessary (for PNGs with alpha)
                        if img.mode in ('RGBA', 'P'):
                            img = img.convert('RGB')
                        
                        # Save main webp
                        print(f"Converting {file} to webp...")
                        img.save(output_path, "WEBP", quality=90)
                        
                        # Generate variants
                        original_width, original_height = img.size
                        for suffix, target_width in variants:
                            variant_filename = f"{base_name}-{suffix}.webp"
                            variant_path = os.path.join(dest_folder, variant_filename)
                            
                            if original_width > target_width:
                                print(f"  -> Generating {suffix} variant...")
                                target_height = int((target_width / original_width) * original_height)
                                resized_img = img.resize((target_width, target_height), Image.LANCZOS)
                                resized_img.save(variant_path, "WEBP", quality=85)
                            else:
                                print(f"  -> Original is smaller than {suffix}, copying...")
                                img.save(variant_path, "WEBP", quality=90)
                                
                    # Optional: move processed raw file to a "done" folder or delete
                    # For now, let's just leave it there or let the user delete it.
                    
                except Exception as e:
                    print(f"Error processing {file}: {e}")

if __name__ == "__main__":
    # Paths relative to the script's location
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static", "uploads"))
    source = os.path.join(base_dir, "import")
    target = base_dir # Process directly into uploads (maintaining structure)

    process_images(source, target)
    print("\nAll done! You can now delete the files in the 'import' folder.")
