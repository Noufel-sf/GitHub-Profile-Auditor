import os
from PIL import Image, ImageDraw, ImageFont

def create_icons():
    # 1. SVG Favicon
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#22D3EE"/>
    </filter>
  </defs>
  <!-- Background obsidian frame -->
  <rect width="64" height="64" rx="10" fill="#09090b"/>
  <rect x="2" y="2" width="60" height="60" rx="8" fill="#121215" stroke="#27272a" stroke-width="2"/>
  
  <!-- Pixel corner accents -->
  <rect x="5" y="5" width="5" height="2" fill="#22D3EE"/>
  <rect x="5" y="5" width="2" height="5" fill="#22D3EE"/>
  
  <rect x="54" y="5" width="5" height="2" fill="#EC4899"/>
  <rect x="57" y="5" width="2" height="5" fill="#EC4899"/>
  
  <rect x="5" y="57" width="5" height="2" fill="#A3E635"/>
  <rect x="5" y="54" width="2" height="5" fill="#A3E635"/>
  
  <rect x="54" y="57" width="5" height="2" fill="#FACC15"/>
  <rect x="57" y="54" width="2" height="5" fill="#FACC15"/>

  <!-- Git branch trunk -->
  <rect x="20" y="16" width="4" height="30" fill="#22D3EE"/>
  <!-- Branch fork -->
  <rect x="24" y="28" width="10" height="4" fill="#22D3EE"/>
  <rect x="34" y="20" width="4" height="12" fill="#22D3EE"/>

  <!-- Git commit nodes -->
  <!-- Top Node -->
  <rect x="17" y="12" width="10" height="10" fill="#A855F7"/>
  <rect x="19" y="14" width="6" height="6" fill="#FFFFFF"/>
  <rect x="21" y="16" width="2" height="2" fill="#09090b"/>

  <!-- Right Branch Node -->
  <rect x="31" y="16" width="10" height="10" fill="#A3E635"/>
  <rect x="33" y="18" width="6" height="6" fill="#FFFFFF"/>
  <rect x="35" y="20" width="2" height="2" fill="#09090b"/>

  <!-- Bottom Node -->
  <rect x="17" y="42" width="10" height="10" fill="#22D3EE"/>
  <rect x="19" y="44" width="6" height="6" fill="#FFFFFF"/>
  <rect x="21" y="46" width="2" height="2" fill="#09090b"/>

  <!-- Radar Scope Reticle Target on top right -->
  <circle cx="47" cy="41" r="9" fill="none" stroke="#EC4899" stroke-width="2"/>
  <circle cx="47" cy="41" r="4" fill="none" stroke="#EC4899" stroke-width="1.5" stroke-dasharray="2 2"/>
  <rect x="46" y="30" width="2" height="6" fill="#EC4899"/>
  <rect x="46" y="46" width="2" height="6" fill="#EC4899"/>
  <rect x="36" y="40" width="6" height="2" fill="#EC4899"/>
  <rect x="52" y="40" width="6" height="2" fill="#EC4899"/>
  <rect x="46" y="40" width="2" height="2" fill="#FFFFFF"/>
</svg>"""

    with open("public/icon.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)
    with open("src/app/icon.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)

    # 2. Render PNG / ICO icon using Pillow for crisp favicon & apple-touch-icon
    size = 180
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded rectangle background
    draw.rounded_rectangle([4, 4, size - 4, size - 4], radius=24, fill=(18, 18, 21, 255), outline=(39, 39, 42, 255), width=4)

    # Corners
    draw.rectangle([14, 14, 28, 20], fill=(34, 211, 238, 255))
    draw.rectangle([14, 14, 20, 28], fill=(34, 211, 238, 255))
    draw.rectangle([size - 28, 14, size - 14, 20], fill=(236, 72, 153, 255))
    draw.rectangle([size - 20, 14, size - 14, 28], fill=(236, 72, 153, 255))
    draw.rectangle([14, size - 20, 28, size - 14], fill=(163, 230, 53, 255))
    draw.rectangle([14, size - 28, 20, size - 14], fill=(163, 230, 53, 255))
    draw.rectangle([size - 28, size - 20, size - 14, size - 14], fill=(250, 204, 21, 255))
    draw.rectangle([size - 20, size - 28, size - 14, size - 14], fill=(250, 204, 21, 255))

    # Trunk & Branch
    draw.rectangle([56, 46, 68, 134], fill=(34, 211, 238, 255))
    draw.rectangle([68, 80, 96, 92], fill=(34, 211, 238, 255))
    draw.rectangle([96, 56, 108, 92], fill=(34, 211, 238, 255))

    # Commit Nodes
    # Top
    draw.rectangle([48, 36, 76, 64], fill=(168, 85, 247, 255))
    draw.rectangle([54, 42, 70, 58], fill=(255, 255, 255, 255))
    draw.rectangle([60, 48, 64, 52], fill=(9, 9, 11, 255))

    # Right
    draw.rectangle([88, 46, 116, 74], fill=(163, 230, 53, 255))
    draw.rectangle([94, 52, 110, 68], fill=(255, 255, 255, 255))
    draw.rectangle([100, 58, 104, 62], fill=(9, 9, 11, 255))

    # Bottom
    draw.rectangle([48, 120, 76, 148], fill=(34, 211, 238, 255))
    draw.rectangle([54, 126, 70, 142], fill=(255, 255, 255, 255))
    draw.rectangle([60, 132, 64, 136], fill=(9, 9, 11, 255))

    # Reticle / Scope
    rx, ry = 132, 116
    draw.ellipse([rx - 26, ry - 26, rx + 26, ry + 26], outline=(236, 72, 153, 255), width=4)
    draw.rectangle([rx - 2, ry - 36, rx + 2, ry - 20], fill=(236, 72, 153, 255))
    draw.rectangle([rx - 2, ry + 20, rx + 2, ry + 36], fill=(236, 72, 153, 255))
    draw.rectangle([rx - 36, ry - 2, rx - 20, ry + 2], fill=(236, 72, 153, 255))
    draw.rectangle([rx + 20, ry - 2, rx + 36, ry + 2], fill=(236, 72, 153, 255))
    draw.rectangle([rx - 3, ry - 3, rx + 3, ry + 3], fill=(255, 255, 255, 255))

    img.save("public/apple-icon.png", format="PNG", optimize=True)
    img.save("src/app/apple-icon.png", format="PNG", optimize=True)

    # Save multi-size favicon.ico (16, 32, 48)
    ico_img = img.resize((48, 48), Image.Resampling.LANCZOS)
    ico_img.save("public/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    ico_img.save("src/app/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

    print("Icons generated successfully!")

if __name__ == "__main__":
    create_icons()

