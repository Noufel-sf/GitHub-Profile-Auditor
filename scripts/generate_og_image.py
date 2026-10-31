import os
from PIL import Image, ImageDraw, ImageFont

def generate_og_image():
    width = 1200
    height = 630

    # Create image in RGB mode
    img = Image.new("RGB", (width, height), (9, 9, 11)) # #09090b
    draw = ImageDraw.Draw(img)

    # 1. Subtle Retro Grid Lines (every 40px)
    grid_color = (24, 24, 27) # #18181b
    for x in range(0, width, 40):
        draw.line([(x, 0), (x, height)], fill=grid_color, width=1)
    for y in range(0, height, 40):
        draw.line([(0, y), (width, y)], fill=grid_color, width=1)

    # 2. Outer Retro Frame with margin
    margin = 32
    frame_rect = [margin, margin, width - margin, height - margin]
    draw.rectangle(frame_rect, outline=(39, 39, 42), width=3) # #27272a
    draw.rectangle([margin + 4, margin + 4, width - margin - 4, height - margin - 4], outline=(24, 24, 27), width=1)

    # Corner 8-bit Pixel Accents
    # Top Left (Neon Cyan)
    draw.rectangle([margin - 2, margin - 2, margin + 14, margin + 4], fill=(34, 211, 238))
    draw.rectangle([margin - 2, margin - 2, margin + 4, margin + 14], fill=(34, 211, 238))

    # Top Right (Neon Pink)
    draw.rectangle([width - margin - 14, margin - 2, width - margin + 2, margin + 4], fill=(236, 72, 153))
    draw.rectangle([width - margin - 4, margin - 2, width - margin + 2, margin + 14], fill=(236, 72, 153))

    # Bottom Left (Neon Green)
    draw.rectangle([margin - 2, height - margin - 4, margin + 14, height - margin + 2], fill=(163, 230, 53))
    draw.rectangle([margin - 2, height - margin - 14, margin + 4, height - margin + 2], fill=(163, 230, 53))

    # Bottom Right (Neon Yellow)
    draw.rectangle([width - margin - 14, height - margin - 4, width - margin + 2, height - margin + 2], fill=(250, 204, 21))
    draw.rectangle([width - margin - 4, height - margin - 14, width - margin + 2, height - margin + 2], fill=(250, 204, 21))

    # Load Fonts
    font_mono_bold_path = "C:/Windows/Fonts/consolab.ttf"
    font_sans_bold_path = "C:/Windows/Fonts/segoeuib.ttf"
    font_sans_reg_path = "C:/Windows/Fonts/segoeui.ttf"

    font_badge = ImageFont.truetype(font_mono_bold_path, 15)
    font_title_large = ImageFont.truetype(font_sans_bold_path, 48)
    font_title_accent = ImageFont.truetype(font_sans_bold_path, 50)
    font_subtitle = ImageFont.truetype(font_sans_reg_path, 18)
    font_score_num = ImageFont.truetype(font_mono_bold_path, 56)
    font_score_label = ImageFont.truetype(font_mono_bold_path, 14)
    font_card_head = ImageFont.truetype(font_mono_bold_path, 13)
    font_pill = ImageFont.truetype(font_mono_bold_path, 13)
    font_stat = ImageFont.truetype(font_mono_bold_path, 12)
    font_url = ImageFont.truetype(font_mono_bold_path, 16)

    # 3. Top Header Bar
    # Header badge left
    badge_x, badge_y = 64, 62
    draw.rectangle([badge_x, badge_y, badge_x + 360, badge_y + 32], fill=(18, 18, 21), outline=(34, 211, 238), width=2)
    draw.rectangle([badge_x + 10, badge_y + 11, badge_x + 18, badge_y + 19], fill=(34, 211, 238))
    draw.text((badge_x + 28, badge_y + 7), "DEV SCOPE // GITHUB AUDITOR", font=font_badge, fill=(250, 250, 250))

    # Live review tag right
    draw.rectangle([width - 390, badge_y, width - 64, badge_y + 32], fill=(18, 18, 21), outline=(168, 85, 247), width=1)
    draw.text((width - 370, badge_y + 7), "[ 100% DETERMINISTIC ENGINE ]", font=font_badge, fill=(168, 85, 247))

    # 4. Left Hero Content
    content_x = 64
    content_y = 126

    draw.text((content_x, content_y), "LEVEL UP YOUR", font=font_title_large, fill=(250, 250, 250))
    draw.text((content_x, content_y + 56), "GITHUB PRESENCE", font=font_title_accent, fill=(34, 211, 238)) # Neon Cyan

    # Decorative underline bar under title
    draw.rectangle([content_x, content_y + 118, content_x + 260, content_y + 122], fill=(168, 85, 247))
    draw.rectangle([content_x + 264, content_y + 118, content_x + 320, content_y + 122], fill=(236, 72, 153))

    # Subtitle description
    draw.text(
        (content_x, content_y + 138),
        "Instant code quality analysis, repository hygiene audit,",
        font=font_subtitle,
        fill=(161, 161, 170)
    )
    draw.text(
        (content_x, content_y + 166),
        "RPG quest roadmap, and AI-powered executive synthesis.",
        font=font_subtitle,
        fill=(161, 161, 170)
    )

    # Feature checklist pills
    pills = [
        ("⚡ Deterministic 5-Category Weights", (34, 211, 238)),
        ("📊 Competency Spider Matrix & Stacks", (168, 85, 247)),
        ("🏆 Gamified RPG Quest Log & Badges", (163, 230, 53)),
        ("🤖 Gemini-Powered Documentation AI", (236, 72, 153)),
    ]

    pill_y = content_y + 214
    for text, color in pills:
        draw.rectangle([content_x, pill_y, content_x + 490, pill_y + 28], fill=(18, 18, 21), outline=(39, 39, 42), width=1)
        draw.rectangle([content_x, pill_y, content_x + 5, pill_y + 28], fill=color)
        draw.text((content_x + 16, pill_y + 6), text, font=font_pill, fill=(250, 250, 250))
        pill_y += 36

    # 5. Right Side: Simulated Retro Scorecard Window
    card_x = 600
    card_y = 126
    card_w = 536
    card_h = 400

    # Card background & glowing border
    draw.rectangle([card_x, card_y, card_x + card_w, card_y + card_h], fill=(18, 18, 21), outline=(168, 85, 247), width=2)

    # Window Header
    draw.rectangle([card_x, card_y, card_x + card_w, card_y + 36], fill=(9, 9, 11), outline=(39, 39, 42), width=1)
    # Window dots
    draw.rectangle([card_x + 12, card_y + 12, card_x + 20, card_y + 20], fill=(239, 68, 68))
    draw.rectangle([card_x + 26, card_y + 12, card_x + 34, card_y + 20], fill=(250, 204, 21))
    draw.rectangle([card_x + 40, card_y + 12, card_x + 48, card_y + 20], fill=(163, 230, 53))
    draw.text((card_x + 60, card_y + 10), "AUDIT_RESULT // @developer", font=font_card_head, fill=(250, 250, 250))
    draw.text((card_x + card_w - 94, card_y + 10), "100% AUDITED", font=font_card_head, fill=(34, 211, 238))

    # Inner Score Banner
    score_box_y = card_y + 50
    draw.rectangle([card_x + 16, score_box_y, card_x + card_w - 16, score_box_y + 110], fill=(9, 9, 11), outline=(39, 39, 42), width=1)

    # Score Big Number
    draw.text((card_x + 36, score_box_y + 20), "94", font=font_score_num, fill=(250, 250, 250))
    draw.text((card_x + 110, score_box_y + 44), "/100", font=font_score_label, fill=(113, 113, 122))

    # Rank Badge
    draw.rectangle([card_x + 200, score_box_y + 24, card_x + 310, score_box_y + 60], fill=(163, 230, 53, 50), outline=(163, 230, 53), width=2)
    draw.text((card_x + 214, score_box_y + 32), "RANK S", font=font_score_label, fill=(163, 230, 53))

    draw.text((card_x + 200, score_box_y + 72), "ARCHITECTURAL SOVEREIGN", font=font_card_head, fill=(34, 211, 238))

    # Mini radar icon placeholder on right side of score
    ret_x, ret_y = card_x + card_w - 74, score_box_y + 55
    draw.rectangle([ret_x - 30, ret_y - 30, ret_x + 30, ret_y + 30], fill=(18, 18, 21), outline=(34, 211, 238), width=1)
    draw.ellipse([ret_x - 22, ret_y - 22, ret_x + 22, ret_y + 22], outline=(34, 211, 238), width=1)
    draw.line([(ret_x, ret_y - 26), (ret_x, ret_y + 26)], fill=(34, 211, 238), width=1)
    draw.line([(ret_x - 26, ret_y), (ret_x + 26, ret_y)], fill=(34, 211, 238), width=1)
    draw.rectangle([ret_x - 2, ret_y - 2, ret_x + 2, ret_y + 2], fill=(236, 72, 153))

    # Category Progress Breakdown
    cat_y = score_box_y + 126
    categories = [
        ("PROFILE HYGIENE (15%)", 95, (34, 211, 238)),
        ("REPOSITORY PORTFOLIO (30%)", 92, (168, 85, 247)),
        ("CODE QUALITY & TESTS (25%)", 96, (163, 230, 53)),
        ("DOCUMENTATION & README (15%)", 90, (250, 204, 21)),
        ("ENGINEERING CADENCE (15%)", 94, (236, 72, 153)),
    ]

    for cat_name, score, color in categories:
        # Category label + score
        draw.text((card_x + 20, cat_y), cat_name, font=font_stat, fill=(161, 161, 170))
        draw.text((card_x + card_w - 60, cat_y), f"{score}%", font=font_stat, fill=color)

        # Bar
        bar_bg_rect = [card_x + 20, cat_y + 16, card_x + card_w - 20, cat_y + 24]
        draw.rectangle(bar_bg_rect, fill=(9, 9, 11), outline=(39, 39, 42), width=1)

        bar_fill_w = int((card_w - 40) * (score / 100.0))
        draw.rectangle([card_x + 20, cat_y + 16, card_x + 20 + bar_fill_w, cat_y + 24], fill=color)

        cat_y += 40

    # 6. Bottom Banner / Footer
    footer_y = height - margin - 26
    draw.text((margin + 20, footer_y), "https://devscope.app", font=font_url, fill=(34, 211, 238))
    draw.text((margin + 260, footer_y + 2), "// THE RETRO ARCADE AUDITOR FOR SERIOUS DEVELOPERS", font=font_card_head, fill=(113, 113, 122))
    draw.text((width - margin - 220, footer_y), "INSERT COIN TO AUDIT ▶", font=font_url, fill=(250, 204, 21))

    # 7. Save and optimize for <100KB
    # First save as standard PNG
    temp_path = "public/og-image-full.png"
    img.save(temp_path, format="PNG", optimize=True)

    # Convert to high-quality indexed palette (256 colors) for crisp retro graphics and tiny file size
    quantized = img.quantize(colors=256, method=Image.Resampling.LANCZOS, dither=Image.Dither.NONE)
    
    og_path_public = "public/og-image.png"
    og_path_app = "src/app/opengraph-image.png"

    quantized.save(og_path_public, format="PNG", optimize=True)
    quantized.save(og_path_app, format="PNG", optimize=True)

    if os.path.exists(temp_path):
        os.remove(temp_path)

    size_kb = os.path.getsize(og_path_public) / 1024
    print(f"OpenGraph image created at {og_path_public} ({size_kb:.2f} KB)")

if __name__ == "__main__":
    generate_og_image()

