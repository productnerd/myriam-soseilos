#!/usr/bin/env python3
"""
Copy and resize product photos from productphotos/ to public/images/products/
Maps source filenames to product slugs based on visual matching with the PDF catalogue.
"""

import os
import json
import subprocess
from pathlib import Path

SRC_DIR = Path("/Users/mariap/projects/soswebsite/productphotos")
DEST_DIR = Path("/Users/mariap/projects/soswebsite/public/images/products")
MAX_WIDTH = 1200

# Mapping: source filename -> list of (product_slug, image_suffix)
# suffix: "" = primary, "-2" = 2nd view, "-model" = model shot, "-open" = alternate state
PHOTO_MAP = {
    # === TRANSFORMERS COLLECTION ===
    "From the Transformers Collection The Pomegranate Closed Look.jpg": [("pomegranate-ring", "")],
    "From the Transformers Collection The Pomegranate Open Look.jpg": [("pomegranate-ring", "-open")],
    "Magnetic Transformer how it works.jpg": [("magnetic-transformer-12-piece-component-ringearring", "")],
    "Magnetic Transformer set of 12 components Look A.jpg": [("magnetic-transformer-12-piece-component-ringearring", "-2")],
    "Transformer set of 12 components Look B.jpg": [("magnetic-transformer-12-piece-component-ringearring", "-3")],
    "Ongoing Collection (9).jpg": [("falcon", "")],

    # === OTHERWORLDLY COLLECTION ===
    "Aquilla ring.jpg": [("aquilla-ring", "")],
    "Aquilla & Lyra rings.jpg": [("aquilla-ring", "-2"), ("lyra-ring", "")],

    # === COSMIC DUST COLLECTION ===
    "Osmium Pendant.jpg": [("osmium", "")],
    "Osmium Pendant 2.jpg": [("osmium", "-2")],
    "THE AQUAWAVE OSMIUM RING.jpg": [("constellations-4", "")],
    "Triangle Pendant.jpg": [("constellations-triangle-2", "")],

    # MSOSJEWEL series → Cosmic Dust products (starburst/astral pendants, etc.)
    "MSOSJEWEL4.23-07.jpg": [("astral-chain-short-small", "")],  # starburst pendant
    "MSOSJEWEL4.23-08.jpg": [("astral-chain-short-small", "-2")],
    "MSOSJEWEL4.23-09.jpg": [("constellations-small", "")],  # cluster pendant
    "MSOSJEWEL4.23-01.jpg": [("constellations-cluster", "")],  # tri-tone statement ring
    "MSOSJEWEL4.23-02.jpg": [("constellations-cluster", "-2")],
    "MSOSJEWEL4.23-03.jpg": [("astral-regular", "")],  # dome pave ring
    "MSOSJEWEL4.23-04.jpg": [("constellations-2", "")],  # triple-row ring
    "MSOSJEWEL4.23-05.jpg": [("lakota-3", "")],  # spiral ring
    "MSOSJEWEL4.23-06.jpg": [("constellations", "")],  # ear climber earring
    "MSOSJEWEL4.23-10.jpg": [("astral", "")],  # rose gold bangle bracelet
    "MSOSJEWEL4.23-11.jpg": [("planet", "")],  # rose gold threader earring
    "MSOSJEWEL4.23-12.jpg": [("lakota-2", "")],  # white gold threader earring

    # MS.ADFR → Cosmic Dust double finger ring
    "MS.ADFR.R.RG.jpg": [("astral-double-finger", "")],

    # SOS.15.1.20 series → sculptural ring (OtherWorldly)
    "SOS.15.1.20_A.jpg": [("aeternum-ring", "")],
    "SOS.15.1.20_B.jpg": [("aeternum-ring", "-2")],
    "SOS.15.1.20_C.jpg": [("aeternum-ring", "-model")],
    "SOS.15.1.20_D.jpg": [("aeternum-ring", "-3")],

    # === JAGGED COLLECTION (named files) ===
    "Jagged bracelet.jpg": [("jagged-bracelet", "")],
    "Jagged Choker.jpg": [("jagged-choker", "")],
    "Jagged Chain choker.jpg": [("jagged-chain-choker", "")],
    "Jagged tennis bracelet.jpg": [("jagged-tennis-plain", "")],
    "Jagged tennis bracelet & Jagged bracelet.jpg": [("jagged-tennis-plain", "-2"), ("jagged-bracelet", "-2")],
    "Jagged tennis bracelet & Jagged bracelet 2.jpg": [("jagged-tennis-plain", "-3")],
    "Jagged eternity ring - mid height.jpg": [("jagged-eternity-ring-mediumlowflat-height", "")],
    "Jagged twirl ring.jpg": [("twirl-top", "")],
    "JAGGED LONG RING.jpg": [("inside-out-ring", "")],
    'Jagged "Flexi" Earring.jpg': [("jagged-flexi-earring", "")],
    "Jagged conch earring : small loop earring.jpg": [("jagged-conch-earring-small-loop-earring", "")],
    'Jagged "Mix n Match" stud.jpg': [("jagged-mix-n-match-chain-earrings", "-stud")],
    'Jagged "Mix n Match" chain earrings.jpg': [("jagged-mix-n-match-chain-earrings", "")],
    'Jagged "Mix n Match" chain earring worn at the back of a pendant.jpg': [("jagged-mix-n-match-chain-earrings", "-model")],
    'Jagged "Mix n Match" chain earring worn at the back of a pendant 2.jpg': [("jagged-mix-n-match-chain-earrings", "-model2")],
    'Jagged "Mix n Match" chain earring worn at the back of a pendant 3.jpg': [("jagged-mix-n-match-chain-earrings", "-model3")],
    "Jagged Hair pin:earring.jpg": [("jagged-hair-pinearring", "")],
    "Jagged Hair pin:earring 2.jpg": [("jagged-hair-pinearring", "-2")],
    "Jagged Ring:Pendant.jpg": [("ringpendant", "")],
    "SUPERFLEXI JAGGED RING.jpg": [("jagged-flexi-x4", "")],
    "SUPERFLEXI JAGGED RING 2.jpg": [("jagged-flexi-x4", "-2")],
    "CHAIN EARRING 13CM CHAIN.jpg": [("chain-earring", "")],
    "CHAIN EARRING 33CM LENGTH CHAIN.jpg": [("chain-earring", "-2")],
    "CHAIN EARRINGS 2 EARRINGS WORN TOGETHER.jpg": [("chain-earring", "-model")],

    # JAGGED II TRANSFORMER series (best representative shots)
    "JAGGED II TRANSFORMER RING (A).jpg": [("ringpendant", "-ring")],
    "JAGGED II TRANSFORMER STUD EARRING.jpg": [("jagged-conch-earring-small-loop-earring", "-2")],
    "JAGGED II TRANSFORMER SHORT PENDANT(A).jpg": [("cluster-pendant", "")],
    "JAGGED II TRANSFORMER SHORT PENDANT(B).jpg": [("cluster-pendant", "-2")],
    "JAGGED II TRANSFORMER SHORT PENDANT(C).jpg": [("stick-pendant", "")],
    "JAGGED II TRANSFORMER SHORT PENDANT(D).jpg": [("stick-pendant", "-2")],
    "JAGGED II TRANSFORMER RING AND BRACELET.jpg": [("jagged-chain-bracelet", "")],
    "JAGGED II TRANSFORMER STUD AND RING.jpg": [("ringpendant", "-model")],
    "JAGGED II TRANSFORMER TURNAROUND EARRING FRONT.jpg": [("jagged-flexi-earring", "-2")],
    "JAGGED II TRANSFORMER EARRING AND BRACELET CLIP ON(A).jpg": [("jagged-chain-bracelet", "-2")],
    "JAGGED II TRANSFORMER FIRST HALF BRACELET CLIP ON (A).jpg": [("jagged-stick-chain-bracelet", "")],
    "JAGGED II TRANSFORMER FIRST HALF BRACELET CLIP ON (B).jpg": [("jagged-stick-chain-bracelet", "-2")],
    "JAGGED II TRANSFORMER PENDANT, RING CLIP ON (A).jpg": [("ringpendant", "-2")],
    "JAGGED II TRANSFORMER RING CLIP ON (A).jpg": [("jagged-flex-triangle", "")],
    "JAGGED II TRANSFORMER RING CLIP ON (B).jpg": [("jagged-flex-triangle", "-2")],
    "JAGGED II TRANSFORMER SECOND HALF BRACELET CLIP ON (A).jpg": [("jagged", "")],

    # === NAKED SQUARE COLLECTION (008-020 series) ===
    "008 copy.jpg": [("eternity-square-ring", "")],
    "009 copy.jpg": [("eternity-square-ring", "-2")],
    "010 copy.jpg": [("eternity-square-on-square-ring", "")],
    "011 copy.jpg": [("eternity-square-on-square-ring", "-2")],
    "013 copy.jpg": [("eternity-double-finger-square-ring", "")],
    "014 copy.jpg": [("eternity-double-finger-square-ring", "-2")],
    "015 copy.jpg": [("eternity-cross-ring", "")],
    "016 copy.jpg": [("l-ring", "")],
    "017 copy.jpg": [("pin-ring", "")],
    "018 copy.jpg": [("z-ring", "")],
    "019 copy.jpg": [("z-ring", "-2")],
    "020 copy.jpg": [("cuddles-ring", "")],
    "0012 copy.jpg": [("double-loop-ring", "")],

    # === SKYLINE COLLECTION (001-007 series) ===
    "001 copy.jpg": [("empire-ring", "")],
    "002 copy.jpg": [("power-ring", "")],
    "003 copy.jpg": [("o2-ring", "")],
    "004 copy.jpg": [("hallgrimur-earrings", "")],
    "005 copy.jpg": [("hallgrimur-earrings", "-2")],
    "006 copy.jpg": [("allianz-bracelet", "")],
    "007 copy.jpg": [("velodrome-bracelet", "")],

    # === SOS!E COLLECTION ===
    "PEACOK RING.jpg": [("sose-ring", "")],
    "PEACOK PENDANT.jpg": [("good-luck-pendant", "")],
    "PEACOK EARRING.jpg": [("side-finger-triangle-ring", "-peacock")],
    "PEACOK PENDANT-\u0392.jpg": [("good-luck-pendant", "-2")],
    "PEACOCK RING-MODEL-1.jpg": [("sose-ring", "-model")],
    "PEACOCK RING-MODEL-2.jpg": [("sose-ring", "-model2")],
    "PEACOCK PENDANT-MODEL-1.jpg": [("good-luck-pendant", "-model")],
    "PEACOCK PENDANT-MODEL-2.jpg": [("good-luck-pendant", "-model2")],
    "PEACOCK EARRING-MODEL-1.jpg": [("side-finger-triangle-ring", "-model")],
    "FLOWER GARDEN.jpg": [("twist-ring", "")],
}


def resize_image(src_path, dest_path, max_width=MAX_WIDTH):
    """Resize image to max_width using sips (macOS built-in). Returns True on success."""
    try:
        # Copy first
        subprocess.run(["cp", str(src_path), str(dest_path)], check=True)
        # Get current width
        result = subprocess.run(
            ["sips", "-g", "pixelWidth", str(dest_path)],
            capture_output=True, text=True
        )
        width_line = [l for l in result.stdout.split("\n") if "pixelWidth" in l]
        if width_line:
            current_width = int(width_line[0].split(":")[-1].strip())
            if current_width > max_width:
                subprocess.run(
                    ["sips", "--resampleWidth", str(max_width), str(dest_path)],
                    capture_output=True, check=True
                )
        return True
    except Exception as e:
        print(f"  ERROR resizing {src_path.name}: {e}")
        return False


def main():
    DEST_DIR.mkdir(parents=True, exist_ok=True)

    # Track which product slugs got which images
    product_images = {}  # slug -> [list of relative paths]
    copied = 0
    skipped = 0
    errors = 0

    for src_filename, mappings in PHOTO_MAP.items():
        src_path = SRC_DIR / src_filename
        if not src_path.exists():
            print(f"  SKIP (not found): {src_filename}")
            skipped += 1
            continue

        for slug, suffix in mappings:
            dest_filename = f"{slug}{suffix}.jpg"
            dest_path = DEST_DIR / dest_filename

            if resize_image(src_path, dest_path):
                relative_path = f"/images/products/{dest_filename}"
                if slug not in product_images:
                    product_images[slug] = []
                product_images[slug].append(relative_path)
                copied += 1
                print(f"  OK: {src_filename} -> {dest_filename}")
            else:
                errors += 1

    # Output summary
    print(f"\n=== SUMMARY ===")
    print(f"Copied: {copied}")
    print(f"Skipped: {skipped}")
    print(f"Errors: {errors}")
    print(f"Products with images: {len(product_images)}")

    # Save mapping as JSON for use in updating products.ts
    mapping_path = DEST_DIR.parent.parent.parent / "scripts" / "product_images.json"
    with open(mapping_path, "w") as f:
        json.dump(product_images, f, indent=2)
    print(f"\nMapping saved to: {mapping_path}")


if __name__ == "__main__":
    main()
