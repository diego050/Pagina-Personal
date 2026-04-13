import os
from PIL import Image
import sys

def generate_variants(directory):
    print(f"Scanning directory: {directory}")
    
    # Target widths
    variants = [
        ("sm", 400),
        ("md", 800),
        ("lg", 1200)
    ]
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            # Only process original webp files, skip existing variants
            if file.endswith(".webp") and not any(f"-{suffix}.webp" in file for suffix, _ in variants):
                file_path = os.path.join(root, file)
                base_name = os.path.splitext(file_path)[0]
                
                try:
                    with Image.open(file_path) as img:
                        original_width, original_height = img.size
                        
                        for suffix, target_width in variants:
                            variant_path = f"{base_name}-{suffix}.webp"
                            
                            # Skip if already exists
                            if os.path.exists(variant_path):
                                continue
                                
                            # Only resize if original is larger than target
                            if original_width > target_width:
                                print(f"Generating {suffix} variant for {file}...")
                                # Calculate height maintaining aspect ratio
                                target_height = int((target_width / original_width) * original_height)
                                
                                # Resize and save
                                resized_img = img.resize((target_width, target_height), Image.LANCZOS)
                                resized_img.save(variant_path, "WEBP", quality=85)
                            else:
                                # If original is smaller, just copy it to represent the variant if missing
                                # but usually we just let the frontend fallback to original.
                                # To keep it simple and avoid 404s, we'll create a link or copy.
                                # But for now, let's just create the file so srcSet works.
                                print(f"Copying {suffix} variant for {file} (smaller than target)...")
                                img.save(variant_path, "WEBP", quality=90)
                                
                except Exception as e:
                    print(f"Error processing {file}: {e}")

if __name__ == "__main__":
    # If a path is provided as argument, use it; otherwise use default uploads path
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "static/uploads"
    if not os.path.exists(target_dir):
        # Fallback for local testing if run from wrong CWD
        target_dir = os.path.join(os.path.dirname(__file__), "..", "static", "uploads")
    
    generate_variants(target_dir)
    print("Done!")
