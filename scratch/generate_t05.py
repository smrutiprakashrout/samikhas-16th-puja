#!/usr/bin/env python3
"""
Generate T05 assets with ElementTree for robust XML composition:
1. assets/img/ganesha.webp (Ganesha on lotus with mouse, transparent background, 520px wide, < 200 KB)
2. assets/img/og.jpg (1200x630 share image, navy + wave + copper mandala + text, < 150 KB)
3. assets/favicon.svg (64x64 small copper diya/lotus on navy)
"""
import os
import subprocess
import math
import xml.etree.ElementTree as ET

# Palette Tokens
NAVY = "#1E2C70"
NAVY_DEEP = "#0A1B5C"
NAVY_MID = "#12308F"
NAVY_LINE = "#34459B"
COPPER = "#D98F78"
COPPER_TEXT = "#AD5E46"
PEACH = "#F3B9A6"
PEACH_LIGHT = "#F8D2C4"
IVORY = "#FBF6EC"
GOLD = "#C9A24B"
GOLD_LIGHT = "#F0D58A"
GOLD_DARK = "#9A7425"
FLAME = "#FFB62E"
FLAME_DEEP = "#F29A1F"
TEAL = "#0E8C86"
GREEN = "#2FA07F"
ROSE = "#D81B72"

def clean_element(elem):
    if '}' in elem.tag:
        elem.tag = elem.tag.split('}', 1)[1]
    for child in elem:
        clean_element(child)
    return elem

def load_svg(path):
    tree = ET.parse(path)
    root = tree.getroot()
    clean_element(root)
    return root

def gen_ganesha_svg():
    """
    Generate an authentic, classical Indian illustration of Lord Ganesha:
    Seated in Lalitasana upon a blooming lotus throne,
    four-armed (Chaturbhuja) holding an ankusha, pasha, modak bowl, and abhaya mudra,
    with Vakratunda trunk, auspicious tilak, crown, and his mouse vahana (Mushakraj).
    Canvas: 520 x 600 (520px wide).
    Transparent background.
    """
    w, h = 520, 600
    cx = 260
    lines = []
    lines.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">')
    lines.append('  <defs>')
    lines.append('    <linearGradient id="g-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">')
    lines.append(f'      <stop offset="0%" stop-color="{GOLD_LIGHT}"/>')
    lines.append(f'      <stop offset="50%" stop-color="{GOLD}"/>')
    lines.append(f'      <stop offset="100%" stop-color="{GOLD_DARK}"/>')
    lines.append('    </linearGradient>')
    lines.append('    <linearGradient id="g-peach-grad" x1="0%" y1="0%" x2="0%" y2="100%">')
    lines.append(f'      <stop offset="0%" stop-color="{PEACH_LIGHT}"/>')
    lines.append(f'      <stop offset="100%" stop-color="{PEACH}"/>')
    lines.append('    </linearGradient>')
    lines.append('  </defs>')
    lines.append('  <g id="ganesha-root">')

    # 1. PRABHAVALI / AURA (Divine Halo behind Ganesha's head)
    lines.append(f'    <circle cx="{cx}" cy="200" r="105" fill="{GOLD}" fill-opacity="0.15" stroke="{COPPER}" stroke-width="1.5" stroke-dasharray="4,4"/>')
    lines.append(f'    <circle cx="{cx}" cy="200" r="92" fill="{PEACH}" fill-opacity="0.1" stroke="{GOLD_LIGHT}" stroke-width="1"/>')
    for i in range(24):
        rad = math.radians(i * 15)
        rx1 = cx + 94 * math.cos(rad)
        ry1 = 200 + 94 * math.sin(rad)
        rx2 = cx + 104 * math.cos(rad)
        ry2 = 200 + 104 * math.sin(rad)
        lines.append(f'    <line x1="{rx1:.1f}" y1="{ry1:.1f}" x2="{rx2:.1f}" y2="{ry2:.1f}" stroke="{GOLD}" stroke-width="1.2"/>')

    # 2. LOTUS THRONE (Padmasana Base, y=450 to 560)
    d_lotus_outer = "M 80,510 C 120,560 400,560 440,510 C 410,545 110,545 80,510 Z"
    lines.append(f'    <path d="{d_lotus_outer}" fill="{PEACH}" stroke="{COPPER}" stroke-width="1.5"/>')
    
    petals = [
        (110, 480, 160, 535, 140, 490),
        (150, 475, 210, 545, 190, 485),
        (210, 480, 260, 550, 240, 490),
        (260, 490, 310, 550, 310, 480),
        (310, 485, 370, 545, 370, 475),
        (360, 490, 410, 535, 410, 480),
    ]
    for x1, y1, mx, my, x2, y2 in petals:
        d_p = f"M {x1},{y1} Q {mx},{my} {x2},{y2} Q {cx},490 {x1},{y1} Z"
        lines.append(f'    <path d="{d_p}" fill="url(#g-peach-grad)" stroke="{COPPER}" stroke-width="1.4"/>')

    lines.append(f'    <ellipse cx="{cx}" cy="485" rx="165" ry="24" fill="{GOLD}" stroke="{COPPER}" stroke-width="2"/>')
    lines.append(f'    <ellipse cx="{cx}" cy="485" rx="155" ry="18" fill="{GOLD_LIGHT}" stroke="{COPPER}" stroke-width="1" stroke-dasharray="3,3"/>')

    # 3. MUSHAKRAJ (The Divine Mouse / Vahana, bottom left at (115, 520))
    lines.append('  <g id="ganesha-mushak">')
    d_mouse_body = "M 100,535 C 90,525 95,510 115,515 C 130,518 135,535 125,542 C 110,545 100,542 100,535 Z"
    lines.append(f'    <path d="{d_mouse_body}" fill="{GOLD_DARK}" stroke="{COPPER}" stroke-width="1.2"/>')
    d_mouse_head = "M 118,518 C 122,510 132,512 135,518 C 132,525 122,525 118,518 Z"
    lines.append(f'    <path d="{d_mouse_head}" fill="{GOLD}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <circle cx="124" cy="512" r="4.5" fill="{PEACH}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <circle cx="134" cy="516" r="1.2" fill="{NAVY_DEEP}"/>')
    lines.append(f'    <circle cx="137" cy="522" r="3" fill="{GOLD_LIGHT}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <path d="M 100,538 Q 85,542 80,532 Q 78,522 84,520" fill="none" stroke="{COPPER}" stroke-width="1.4" stroke-linecap="round"/>')
    lines.append('  </g>')

    # 4. LOWER BODY & LEGS (Lalitasana posture)
    d_leg_left = "M 180,445 C 180,480 320,485 345,465 C 365,450 355,420 310,425 Z"
    lines.append(f'    <path d="{d_leg_left}" fill="{GOLD}" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <path d="M 210,440 Q 260,465 320,445" fill="none" stroke="{COPPER_TEXT}" stroke-width="1.2"/>')
    lines.append(f'    <path d="M 220,455 Q 265,475 315,458" fill="none" stroke="{COPPER_TEXT}" stroke-width="1.2"/>')
    d_leg_right = "M 155,415 C 140,430 145,465 175,475 C 200,470 205,440 185,420 Z"
    lines.append(f'    <path d="{d_leg_right}" fill="{GOLD}" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <line x1="165" y1="468" x2="185" y2="468" stroke="{GOLD_LIGHT}" stroke-width="2"/>')
    lines.append(f'    <circle cx="175" cy="468" r="2" fill="{ROSE}"/>')

    # 5. TORSO & ABDOMEN (Potbelly - Lambodara)
    d_belly = "M 195,330 C 160,370 170,445 260,445 C 350,445 360,370 325,330 Z"
    lines.append(f'    <path d="{d_belly}" fill="url(#g-peach-grad)" stroke="{COPPER}" stroke-width="1.8"/>')
    lines.append(f'    <circle cx="{cx}" cy="405" r="4" fill="{COPPER_TEXT}"/>')
    lines.append(f'    <path d="M 190,412 Q {cx},430 330,412" fill="none" stroke="{GREEN}" stroke-width="3" stroke-linecap="round"/>')
    lines.append(f'    <circle cx="{cx}" cy="422" r="3" fill="{GOLD}"/>')

    # Sacred Thread (Yajnopavita)
    lines.append(f'    <path d="M 210,290 Q 235,350 280,435" fill="none" stroke="{GOLD}" stroke-width="2.5"/>')
    lines.append(f'    <path d="M 212,290 Q 237,350 282,435" fill="none" stroke="{COPPER}" stroke-width="1" stroke-dasharray="3,3"/>')

    # 6. FOUR ARMS (Chaturbhuja)
    # Upper Right Arm (Ankusha)
    d_arm_ur = "M 205,290 C 160,285 140,240 155,215 C 165,225 175,260 215,280 Z"
    lines.append(f'    <path d="{d_arm_ur}" fill="{PEACH}" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <circle cx="152" cy="214" r="8" fill="{PEACH_LIGHT}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <line x1="145" y1="230" x2="160" y2="170" stroke="{GOLD_DARK}" stroke-width="3"/>')
    lines.append(f'    <path d="M 157,175 Q 170,180 165,190" fill="none" stroke="{GOLD}" stroke-width="3" stroke-linecap="round"/>')

    # Upper Left Arm (Pasha)
    d_arm_ul = "M 315,290 C 360,285 380,240 365,215 C 355,225 345,260 305,280 Z"
    lines.append(f'    <path d="{d_arm_ul}" fill="{PEACH}" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <circle cx="368" cy="214" r="8" fill="{PEACH_LIGHT}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <ellipse cx="372" cy="188" rx="10" ry="16" fill="none" stroke="{GOLD}" stroke-width="2.5"/>')

    # Lower Left Arm (Modak Bowl)
    d_arm_ll = "M 320,335 C 365,340 375,375 350,400 C 335,395 325,370 305,355 Z"
    lines.append(f'    <path d="{d_arm_ll}" fill="{PEACH}" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <path d="M 340,395 C 340,412 375,412 375,395 Z" fill="{GOLD}" stroke="{COPPER}" stroke-width="1.2"/>')
    lines.append(f'    <circle cx="352" cy="392" r="5" fill="{GOLD_LIGHT}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <circle cx="362" cy="392" r="5" fill="{GOLD_LIGHT}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <circle cx="357" cy="384" r="5" fill="{GOLD_LIGHT}" stroke="{COPPER}" stroke-width="0.8"/>')

    # Lower Right Arm (Abhaya Mudra)
    d_arm_lr = "M 200,335 C 160,340 155,370 175,390 C 185,380 195,365 215,355 Z"
    lines.append(f'    <path d="{d_arm_lr}" fill="{PEACH}" stroke="{COPPER}" stroke-width="1.5"/>')
    d_palm = "M 168,368 C 162,358 174,342 184,348 C 188,358 184,374 175,376 Z"
    lines.append(f'    <path d="{d_palm}" fill="{PEACH_LIGHT}" stroke="{COPPER}" stroke-width="1.2"/>')
    lines.append(f'    <circle cx="176" cy="360" r="3" fill="{ROSE}"/>')

    # 7. ELEPHANT HEAD & EARS
    d_ear_left = f"M 215,185 C 160,150 120,180 135,235 C 150,270 195,260 215,245 Z"
    lines.append(f'    <path d="{d_ear_left}" fill="url(#g-peach-grad)" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <path d="M 195,200 C 160,185 145,210 155,235" fill="none" stroke="{COPPER}" stroke-width="1.2"/>')

    d_ear_right = f"M 305,185 C 360,150 400,180 385,235 C 370,270 325,260 305,245 Z"
    lines.append(f'    <path d="{d_ear_right}" fill="url(#g-peach-grad)" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <path d="M 325,200 C 360,185 375,210 365,235" fill="none" stroke="{COPPER}" stroke-width="1.2"/>')

    d_head = f"M 215,185 C 215,135 {cx-25},130 {cx},130 C {cx+25},130 305,135 305,185 C 305,240 215,240 215,185 Z"
    lines.append(f'    <path d="{d_head}" fill="url(#g-peach-grad)" stroke="{COPPER}" stroke-width="1.8"/>')

    # Tusks
    lines.append(f'    <path d="M 235,260 L 220,275 L 235,270 Z" fill="{IVORY}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <path d="M 285,260 L 295,268 L 292,272 L 285,266 Z" fill="{IVORY}" stroke="{COPPER}" stroke-width="1"/>')

    # Trunk (Vakratunda)
    d_trunk = f"M 245,225 C 242,270 248,310 262,345 C 275,375 320,380 330,355 C 335,340 318,335 315,345 C 312,352 295,355 285,335 C 275,310 270,270 275,225 Z"
    lines.append(f'    <path d="{d_trunk}" fill="url(#g-peach-grad)" stroke="{COPPER}" stroke-width="1.8" stroke-linejoin="round"/>')
    for ty in [250, 275, 300, 325]:
        lines.append(f'    <path d="M 252,{ty} Q 260,{ty+6} 270,{ty}" fill="none" stroke="{COPPER_TEXT}" stroke-width="1"/>')
    lines.append(f'    <circle cx="324" cy="342" r="5" fill="{GOLD_LIGHT}" stroke="{COPPER}" stroke-width="0.8"/>')

    # Eyes
    lines.append(f'    <path d="M 234,195 Q 242,190 250,195 Q 242,200 234,195 Z" fill="{IVORY}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <circle cx="242" cy="195" r="1.8" fill="{NAVY_DEEP}"/>')
    lines.append(f'    <path d="M 270,195 Q 278,190 286,195 Q 278,200 270,195 Z" fill="{IVORY}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <circle cx="278" cy="195" r="1.8" fill="{NAVY_DEEP}"/>')

    # Tilak
    lines.append(f'    <path d="M {cx-14},162 Q {cx},175 {cx+14},162" fill="none" stroke="{ROSE}" stroke-width="2.5" stroke-linecap="round"/>')
    lines.append(f'    <line x1="{cx}" y1="152" x2="{cx}" y2="182" stroke="{GOLD}" stroke-width="2.5"/>')
    lines.append(f'    <circle cx="{cx}" cy="152" r="2.5" fill="{ROSE}"/>')

    # 8. CROWN (Kirita Mukut)
    d_crown_base = f"M 220,140 C 220,128 300,128 300,140 L 295,148 L 225,148 Z"
    lines.append(f'    <path d="{d_crown_base}" fill="{GOLD}" stroke="{COPPER}" stroke-width="1.5"/>')
    d_crown_tier1 = f"M 226,132 L 235,95 L 285,95 L 294,132 Z"
    lines.append(f'    <path d="{d_crown_tier1}" fill="url(#g-gold-grad)" stroke="{COPPER}" stroke-width="1.5"/>')
    d_crown_tier2 = f"M 238,95 L 246,68 L 274,68 L 282,95 Z"
    lines.append(f'    <path d="{d_crown_tier2}" fill="{GOLD}" stroke="{COPPER}" stroke-width="1.5"/>')
    
    # Crown finial
    lines.append(f'    <circle cx="{cx}" cy="60" r="7" fill="{GOLD_LIGHT}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <polygon points="{cx},48 {cx-3},56 {cx+3},56" fill="{GOLD}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <circle cx="{cx}" cy="60" r="3" fill="{ROSE}"/>')
    lines.append(f'    <circle cx="{cx}" cy="115" r="5" fill="{ROSE}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <circle cx="{cx-18}" cy="118" r="3.5" fill="{TEAL}" stroke="{COPPER}" stroke-width="0.6"/>')
    lines.append(f'    <circle cx="{cx+18}" cy="118" r="3.5" fill="{TEAL}" stroke="{COPPER}" stroke-width="0.6"/>')
    lines.append(f'    <circle cx="{cx}" cy="82" r="3.5" fill="{TEAL}" stroke="{COPPER}" stroke-width="0.6"/>')

    # Necklaces
    lines.append(f'    <path d="M 225,295 Q {cx},330 295,295" fill="none" stroke="{GOLD}" stroke-width="2"/>')
    lines.append(f'    <path d="M 220,308 Q {cx},350 300,308" fill="none" stroke="{GOLD}" stroke-width="2.5"/>')
    lines.append(f'    <circle cx="{cx}" cy="340" r="4.5" fill="{ROSE}" stroke="{COPPER}" stroke-width="0.8"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def build_og_image_xml():
    """
    Build 1200x630 share image using ElementTree:
    - Navy (#1E2C70 to #0A1B5C) gradient background
    - Seamless wave pattern
    - Copper mandala watermark
    - Ivory text "Samikshya's 16th Birthday Puja"
    - Subtitle line "Sunday, 29 November 2026"
    """
    w, h = 1200, 630
    cx, cy = 600, 315

    root = ET.Element("svg", {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": f"0 0 {w} {h}",
        "width": str(w),
        "height": str(h)
    })

    defs = ET.SubElement(root, "defs")

    # Navy gradient
    grad = ET.SubElement(defs, "linearGradient", {
        "id": "og-bg-grad", "x1": "0%", "y1": "0%", "x2": "100%", "y2": "100%"
    })
    ET.SubElement(grad, "stop", {"offset": "0%", "stop-color": NAVY})
    ET.SubElement(grad, "stop", {"offset": "100%", "stop-color": NAVY_DEEP})

    # Wave pattern definition
    wave_root = load_svg("assets/svg/tile-wave.svg")
    wave_pat = ET.SubElement(defs, "pattern", {
        "id": "og-wave-pat", "width": "64", "height": "64", "patternUnits": "userSpaceOnUse"
    })
    for child in wave_root:
        if child.tag != "defs":
            wave_pat.append(child)

    # Styles
    style = ET.SubElement(defs, "style")
    style.text = f"""
      .og-deva {{ font-family: 'Noto Serif Devanagari', serif; font-size: 22px; fill: {GOLD_LIGHT}; letter-spacing: 4px; text-anchor: middle; }}
      .og-sub {{ font-family: 'Cinzel', Georgia, serif; font-size: 18px; fill: {GOLD}; letter-spacing: 5px; text-anchor: middle; }}
      .og-title-script {{ font-family: 'Great Vibes', cursive; font-size: 78px; fill: {PEACH}; text-anchor: middle; }}
      .og-title-caps {{ font-family: 'Cinzel', Georgia, serif; font-weight: bold; font-size: 46px; fill: {IVORY}; letter-spacing: 4px; text-anchor: middle; }}
      .og-date {{ font-family: 'Cinzel', Georgia, serif; font-size: 22px; fill: {GOLD_LIGHT}; letter-spacing: 3px; text-anchor: middle; }}
    """

    # Background
    ET.SubElement(root, "rect", {"width": str(w), "height": str(h), "fill": "url(#og-bg-grad)"})
    ET.SubElement(root, "rect", {"width": str(w), "height": str(h), "fill": "url(#og-wave-pat)", "opacity": "0.45"})

    # Border frame
    ET.SubElement(root, "rect", {
        "x": "24", "y": "24", "width": str(w-48), "height": str(h-48),
        "rx": "8", "fill": "none", "stroke": COPPER, "stroke-width": "2"
    })
    ET.SubElement(root, "rect", {
        "x": "34", "y": "34", "width": str(w-68), "height": str(h-68),
        "rx": "6", "fill": "none", "stroke": COPPER, "stroke-width": "1.2", "stroke-dasharray": "6,4"
    })

    # Corner accents
    for cor_x, cor_y in [(34, 34), (w-34, 34), (34, h-34), (w-34, h-34)]:
        ET.SubElement(root, "circle", {"cx": str(cor_x), "cy": str(cor_y), "r": "18", "fill": "none", "stroke": COPPER, "stroke-width": "1.2"})
        ET.SubElement(root, "circle", {"cx": str(cor_x), "cy": str(cor_y), "r": "6", "fill": GOLD})

    # Central Copper Mandala Watermark
    g_mandala = ET.SubElement(root, "g", {
        "transform": f"translate({cx - 225}, {cy - 225}) scale(1.5)", "opacity": "0.22"
    })
    mandala_root = load_svg("assets/svg/mandala.svg")
    for child in mandala_root:
        if child.tag != "defs":
            g_mandala.append(child)

    # Flanking Peacocks
    peacock_root = load_svg("assets/svg/peacock.svg")
    g_p1 = ET.SubElement(root, "g", {"transform": "translate(60, 240) scale(0.65)", "opacity": "0.75"})
    for child in peacock_root:
        if child.tag != "defs": g_p1.append(child)

    g_p2 = ET.SubElement(root, "g", {"transform": "translate(1140, 240) scale(-0.65, 0.65)", "opacity": "0.75"})
    peacock_root2 = load_svg("assets/svg/peacock.svg")
    for child in peacock_root2:
        if child.tag != "defs": g_p2.append(child)

    # Invocation Text
    t_deva = ET.SubElement(root, "text", {"x": str(cx), "y": "115", "class": "og-deva"})
    t_deva.text = "॥ श्री गणेशाय नमः ॥"

    # Top Divider
    g_div1 = ET.SubElement(root, "g", {"transform": f"translate({cx - 120}, 128)"})
    div_l_root = load_svg("assets/svg/divider-lotus.svg")
    for child in div_l_root:
        if child.tag != "defs": g_div1.append(child)

    # Title lines
    t_title1 = ET.SubElement(root, "text", {"x": str(cx), "y": "225", "class": "og-title-script"})
    t_title1.text = "Samikshya’s"

    t_title2 = ET.SubElement(root, "text", {"x": str(cx), "y": "295", "class": "og-title-caps"})
    t_title2.text = "16TH BIRTHDAY PUJA"

    # Bottom Divider
    g_div2 = ET.SubElement(root, "g", {"transform": f"translate({cx - 120}, 330)"})
    div_d_root = load_svg("assets/svg/divider-diamond.svg")
    for child in div_d_root:
        if child.tag != "defs": g_div2.append(child)

    # Date and venue subtitle
    t_date = ET.SubElement(root, "text", {"x": str(cx), "y": "405", "class": "og-date"})
    t_date.text = "Sunday, 29 November 2026"

    t_sub = ET.SubElement(root, "text", {"x": str(cx), "y": "445", "class": "og-sub"})
    t_sub.text = "7:00 PM ONWARDS · SALEPUR, CUTTACK"

    # Small Diya Pair at bottom
    g_diya = ET.SubElement(root, "g", {"transform": f"translate({cx - 45}, 485) scale(0.9)"})
    diya_root = load_svg("assets/svg/diya.svg")
    for d in diya_root.findall("defs"):
        for child in d: defs.append(child)
    for child in diya_root:
        if child.tag != "defs": g_diya.append(child)

    return root


def gen_favicon_svg():
    """
    Generate 64x64 favicon.svg:
    A small copper diya with radiant golden flame on deep navy rounded square.
    """
    w, h = 64, 64
    lines = []
    lines.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">')
    lines.append('  <defs>')
    lines.append('    <radialGradient id="fav-glow" cx="50%" cy="50%" r="50%">')
    lines.append(f'      <stop offset="0%" stop-color="{FLAME}" stop-opacity="0.9"/>')
    lines.append(f'      <stop offset="60%" stop-color="{FLAME_DEEP}" stop-opacity="0.3"/>')
    lines.append(f'      <stop offset="100%" stop-color="{FLAME_DEEP}" stop-opacity="0"/>')
    lines.append('    </radialGradient>')
    lines.append('    <linearGradient id="fav-gold" x1="0%" y1="0%" x2="100%" y2="100%">')
    lines.append(f'      <stop offset="0%" stop-color="{GOLD_LIGHT}"/>')
    lines.append(f'      <stop offset="50%" stop-color="{GOLD}"/>')
    lines.append(f'      <stop offset="100%" stop-color="{GOLD_DARK}"/>')
    lines.append('    </linearGradient>')
    lines.append('  </defs>')
    lines.append('  <g id="favicon-root">')

    # Navy Rounded Backdrop
    lines.append(f'    <rect width="{w}" height="{h}" rx="14" fill="{NAVY_DEEP}"/>')
    lines.append(f'    <rect x="2" y="2" width="{w-4}" height="{h-4}" rx="12" fill="none" stroke="{COPPER}" stroke-width="1.2"/>')

    # Glowing Flame Aura
    lines.append('    <circle cx="32" cy="22" r="16" fill="url(#fav-glow)"/>')

    # Flame Teardrop
    d_flame = "M 32,34 C 26,31 22,24 24,18 C 25,12 30,7 32,4 C 34,7 39,12 40,18 C 42,24 38,31 32,34 Z"
    lines.append(f'    <path id="favicon-flame" d="{d_flame}" fill="{FLAME}"/>')
    lines.append(f'    <path id="favicon-flame-core" d="M 32,33 C 28,30 26,25 27,20 C 28,15 31,11 32,8 C 33,11 36,15 37,20 C 38,25 36,30 32,33 Z" fill="{IVORY}"/>')

    # Brass Diya Bowl
    d_bowl = "M 12,36 C 12,48 24,52 28,52 L 27,57 L 22,58 L 22,60 L 42,60 L 42,58 L 37,57 L 36,52 C 40,52 52,48 52,36 Z"
    lines.append(f'    <path id="favicon-bowl" d="{d_bowl}" fill="url(#fav-gold)" stroke="{COPPER}" stroke-width="1.2" stroke-linejoin="round"/>')
    lines.append(f'    <ellipse cx="32" cy="36" rx="20" ry="4" fill="{GOLD_LIGHT}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <circle cx="32" cy="58.5" r="1" fill="{ROSE}"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def main():
    os.makedirs("assets/img", exist_ok=True)
    os.makedirs("assets", exist_ok=True)
    os.makedirs("scratch", exist_ok=True)

    print("--- 1. Generating assets/img/ganesha.webp ---")
    ganesha_svg = gen_ganesha_svg()
    ganesha_svg_path = "scratch/ganesha_source.svg"
    with open(ganesha_svg_path, "w") as f:
        f.write(ganesha_svg)
    
    ganesha_png_path = "scratch/ganesha_520.png"
    subprocess.run(["rsvg-convert", "-w", "520", ganesha_svg_path, "-o", ganesha_png_path], check=True)
    
    ganesha_webp_path = "assets/img/ganesha.webp"
    subprocess.run(["magick", ganesha_png_path, "-quality", "90", "-define", "webp:lossless=false", ganesha_webp_path], check=True)
    ganesha_size = os.path.getsize(ganesha_webp_path)
    print(f"Created {ganesha_webp_path}: {ganesha_size/1024:.2f} KB (limit: 200 KB)")

    print("\n--- 2. Generating assets/img/og.jpg ---")
    og_xml_root = build_og_image_xml()
    og_svg_path = "scratch/og_source.svg"
    tree = ET.ElementTree(og_xml_root)
    tree.write(og_svg_path, encoding="utf-8", xml_declaration=True)
    
    og_png_path = "scratch/og_1200.png"
    subprocess.run(["rsvg-convert", "-w", "1200", "-h", "630", og_svg_path, "-o", og_png_path], check=True)
    
    og_jpg_path = "assets/img/og.jpg"
    subprocess.run(["magick", og_png_path, "-quality", "85", "-interlace", "JPEG", og_jpg_path], check=True)
    og_size = os.path.getsize(og_jpg_path)
    print(f"Created {og_jpg_path}: {og_size/1024:.2f} KB (limit: 150 KB)")

    print("\n--- 3. Generating assets/favicon.svg ---")
    favicon_svg = gen_favicon_svg()
    favicon_path = "assets/favicon.svg"
    with open(favicon_path, "w") as f:
        f.write(favicon_svg)
    fav_size = os.path.getsize(favicon_path)
    print(f"Created {favicon_path}: {fav_size/1024:.2f} KB")

if __name__ == "__main__":
    main()
