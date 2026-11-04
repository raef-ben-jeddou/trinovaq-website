"""Regenerate the raster brand files in public/ from their sources in scripts/brand/.

    favicon.ico           16/32/48 px, from public/favicon.svg
    apple-touch-icon.png  180 px on the brand navy, from public/favicon.svg
    icon-512.png          512 px transparent, from public/favicon.svg
    og-image.png          1200x630 social card, from scripts/brand/og-card.html

Needs Pillow and a local Chrome or Edge (used headless to render the SVG/HTML).
Run from the repo root: python scripts/render-brand-assets.py
The outputs are committed, so CI never runs this.
"""
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT / "scripts" / "brand"
PUBLIC = ROOT / "public"
NAVY = (12, 22, 48, 255)  # --band #0C1630

BROWSERS = [
    os.environ.get("CHROME_PATH", ""),
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    shutil.which("google-chrome") or "",
    shutil.which("chromium") or "",
]


def screenshot(page, out, w, h):
    # Some installs (e.g. policy-managed Edge) exit 0 without writing a screenshot, so try each in turn
    for browser in (b for b in BROWSERS if b and Path(b).exists()):
        with tempfile.TemporaryDirectory() as profile:
            subprocess.run(
                [
                    browser, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    f"--user-data-dir={profile}", "--allow-file-access-from-files",
                    "--default-background-color=00000000", "--virtual-time-budget=3000",
                    f"--window-size={w},{h}", f"--screenshot={out}", page.as_uri(),
                ],
                capture_output=True,
            )
        if out.exists():
            break
    else:
        sys.exit("No Chrome/Edge produced a screenshot. Set CHROME_PATH to a Chromium-based browser.")
    img = Image.open(out)
    if img.size != (w, h):
        sys.exit(f"{out.name}: expected {w}x{h}, got {img.size[0]}x{img.size[1]}")
    return img


def main():
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        icon = screenshot(BRAND / "icon.html", tmp / "icon.png", 512, 512).convert("RGBA")
        og = screenshot(BRAND / "og-card.html", tmp / "og.png", 1200, 630).convert("RGB")

    icon.save(PUBLIC / "icon-512.png", optimize=True)
    icon.save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    # Apple ignores transparency, so sit the mark on navy with breathing room
    touch = Image.new("RGBA", (512, 512), NAVY)
    mark = icon.resize((360, 360), Image.LANCZOS)
    touch.alpha_composite(mark, (76, 76))
    touch.convert("RGB").resize((180, 180), Image.LANCZOS).save(PUBLIC / "apple-touch-icon.png", optimize=True)

    og.save(PUBLIC / "og-image.png", optimize=True)

    for name in ("favicon.ico", "apple-touch-icon.png", "icon-512.png", "og-image.png"):
        print(f"wrote public/{name} ({(PUBLIC / name).stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
