#!/usr/bin/env python3
"""
Update products.ts to replace fallback images with real product photos.
Reads the product_images.json mapping and patches products.ts.
"""

import json
import re
from pathlib import Path

PRODUCTS_FILE = Path("/Users/mariap/projects/soswebsite/src/data/products.ts")
MAPPING_FILE = Path("/Users/mariap/projects/soswebsite/scripts/product_images.json")

with open(MAPPING_FILE) as f:
    product_images = json.load(f)

with open(PRODUCTS_FILE) as f:
    content = f.read()

# For each product slug with real images, find its entry in products.ts and replace the images array
updated_count = 0

for slug, image_paths in product_images.items():
    # Build the new images array
    images_entries = []
    for path in image_paths:
        # Determine alt text from filename
        filename = path.split("/")[-1].replace(".jpg", "").replace("-", " ").title()
        images_entries.append(f'{{ src: "{path}", alt: "{filename}", type: "image" as const }}')

    new_images = "[\n      " + ",\n      ".join(images_entries) + ",\n    ]"

    # Find the product block by its slug and replace the images array
    # Pattern: find `slug: "the-slug"` then find the next `images: [...]` block
    # We need to be careful with the regex since images arrays can span multiple lines

    # Strategy: find the slug, then find the images array within the next ~20 lines
    slug_pattern = f'slug: "{slug}"'
    slug_pos = content.find(slug_pattern)

    if slug_pos == -1:
        print(f"  WARN: slug '{slug}' not found in products.ts")
        continue

    # Find the images: [ ... ] block after this slug
    # Look for "images: [" after the slug position
    images_start_pattern = "images: ["
    images_start = content.find(images_start_pattern, slug_pos)

    if images_start == -1 or images_start - slug_pos > 2000:
        print(f"  WARN: images array not found near slug '{slug}'")
        continue

    # Find the matching closing bracket
    bracket_depth = 0
    i = images_start + len("images: ")
    while i < len(content):
        if content[i] == "[":
            bracket_depth += 1
        elif content[i] == "]":
            bracket_depth -= 1
            if bracket_depth == 0:
                break
        i += 1

    images_end = i + 1  # include the ]

    # Check if there's a trailing comma
    old_images = content[images_start:images_end]

    # Replace
    new_images_full = f"images: {new_images}"
    content = content[:images_start] + new_images_full + content[images_end:]
    updated_count += 1
    print(f"  OK: {slug} ({len(image_paths)} images)")

with open(PRODUCTS_FILE, "w") as f:
    f.write(content)

print(f"\n=== Updated {updated_count} products with real images ===")
