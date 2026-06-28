#!/usr/bin/env python3
"""
generate_icons.py  —  PatternLens PWA Icons
Generuje placeholder ikony PNG zgodne ze specyfikacją PWA 2026.
Wymaga: pip install Pillow

Uruchom z katalogu apps/patternlens/:
  python3 scripts/generate_icons.py

Ikony zostaną zapisane do public/icons/
"""

from pathlib import Path
from PIL import Image, ImageDraw

OUTPUT_DIR = Path(__file__).parent.parent / "public" / "icons"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

BG_COLOR    = (7, 7, 15)          # #07070f  Soft Noir
RING_COLOR  = (123, 140, 255)      # #7B8CFF  accent violet
GOLD_COLOR  = (212, 175, 55)       # #D4AF37  accent gold


def make_icon(size: int, maskable: bool = False) -> Image.Image:
    """
    Generuje prostą ikonę: ciemne tło + złoty prostokąt φ + fioletowy ring.
    Maskable: safe zone = 80% (20% padding z każdej strony).
    """
    img = Image.new("RGBA", (size, size), BG_COLOR + (255,))
    draw = ImageDraw.Draw(img)

    padding = int(size * 0.20) if maskable else int(size * 0.12)
    inner   = size - 2 * padding

    # Golden rectangle (portrait 1:φ) centered
    phi    = 1.618
    rect_w = int(inner * 0.55)
    rect_h = int(rect_w * phi)
    if rect_h > inner:
        rect_h = inner
        rect_w = int(rect_h / phi)

    x0 = padding + (inner - rect_w) // 2
    y0 = padding + (inner - rect_h) // 2
    x1 = x0 + rect_w
    y1 = y0 + rect_h

    # Gold fill
    draw.rectangle([x0, y0, x1, y1], fill=GOLD_COLOR + (200,))
    # Violet ring (border)
    border = max(1, size // 64)
    draw.rectangle([x0, y0, x1, y1], outline=RING_COLOR, width=border)

    return img


SPECS = [
    ("icon-192.png",          192, False),
    ("icon-512.png",          512, False),
    ("icon-192-maskable.png", 192, True),
    ("icon-512-maskable.png", 512, True),
    ("apple-touch-icon.png",  180, False),
]

for filename, size, maskable in SPECS:
    img  = make_icon(size, maskable=maskable)
    path = OUTPUT_DIR / filename
    img.save(path, "PNG", optimize=True)
    print(f"  ✅  {filename}  ({size}x{size}{'  maskable' if maskable else ''})")

print(f"\nIkony zapisane do: {OUTPUT_DIR}")
print("Następny krok: pwa-asset-generator do splash screens")
print("  npx pwa-asset-generator public/icons/icon-512.png public/icons")
print("    --background '#07070f' --splash-only --portrait-only")
