#!/usr/bin/env python3
"""
Generate the 11 shared motif SVGs for Samikshya's 16th Birthday Puja invitation site.
All SVG designs strictly adhere to docs/DESIGN-TOKENS.md and REQUIREMENTS.md.
"""
import math
import os

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

def gen_mandala():
    """
    1. mandala.svg: 300x300, layered 12-petal copper-and-navy mandala,
    copper strokes on navy-mid fill, readable at 150px.
    """
    cx, cy = 150, 150
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">')
    lines.append('  <defs>')
    lines.append('    <style>')
    lines.append('      .m-stroke { stroke: ' + COPPER + '; stroke-linecap: round; stroke-linejoin: round; }')
    lines.append('    </style>')
    lines.append('  </defs>')
    lines.append('  <g id="mandala-root">')

    # Background circle (navy-deep/mid base)
    lines.append(f'    <circle id="mandala-bg" cx="{cx}" cy="{cy}" r="146" fill="{NAVY_DEEP}" stroke="{COPPER}" stroke-width="1.5" stroke-dasharray="3,3"/>')
    lines.append(f'    <circle id="mandala-bg-inner" cx="{cx}" cy="{cy}" r="141" fill="{NAVY_MID}" stroke="{COPPER}" stroke-width="1.5"/>')

    # 12 Outer Petals (pointed lotus cusps)
    # Each petal spans 30 deg, apex at r=138, base corners at r=106
    for i in range(12):
        deg = i * 30
        rad = math.radians(deg)
        r_apex = 138
        ax = cx + r_apex * math.cos(rad)
        ay = cy + r_apex * math.sin(rad)
        
        # Base left & right at r=106
        rad_l = math.radians(deg - 14)
        rad_r = math.radians(deg + 14)
        lx = cx + 106 * math.cos(rad_l)
        ly = cy + 106 * math.sin(rad_l)
        rx = cx + 106 * math.cos(rad_r)
        ry = cy + 106 * math.sin(rad_r)
        
        # Control points for cusped petal
        c1x = cx + 128 * math.cos(math.radians(deg - 9))
        c1y = cy + 128 * math.sin(math.radians(deg - 9))
        c2x = cx + 128 * math.cos(math.radians(deg + 9))
        c2y = cy + 128 * math.sin(math.radians(deg + 9))
        
        d = f"M {lx:.2f},{ly:.2f} Q {c1x:.2f},{c1y:.2f} {ax:.2f},{ay:.2f} Q {c2x:.2f},{c2y:.2f} {rx:.2f},{ry:.2f} Z"
        lines.append(f'    <path id="mandala-outer-petal-{i}" d="{d}" fill="{NAVY_MID}" stroke="{COPPER}" stroke-width="1.5"/>')
        
        # Inner spine & jewel dot
        sx = cx + 110 * math.cos(rad)
        sy = cy + 110 * math.sin(rad)
        ex = cx + 130 * math.cos(rad)
        ey = cy + 130 * math.sin(rad)
        lines.append(f'    <line x1="{sx:.2f}" y1="{sy:.2f}" x2="{ex:.2f}" y2="{ey:.2f}" stroke="{COPPER}" stroke-width="1.2"/>')
        
        # Small inner accent diamond in outer petal
        dx = cx + 120 * math.cos(rad)
        dy = cy + 120 * math.sin(rad)
        lines.append(f'    <circle cx="{dx:.2f}" cy="{dy:.2f}" r="2" fill="{PEACH}"/>')

    # Ring at r=106
    lines.append(f'    <circle id="mandala-ring-106" cx="{cx}" cy="{cy}" r="106" fill="{NAVY}" stroke="{COPPER}" stroke-width="1.5"/>')

    # 24 Beaded pearls along r=106
    for i in range(24):
        rad = math.radians(i * 15)
        px = cx + 101 * math.cos(rad)
        py = cy + 101 * math.sin(rad)
        lines.append(f'    <circle cx="{px:.2f}" cy="{py:.2f}" r="1.8" fill="{COPPER}"/>')

    # Intermediate 12 Petals (rotated by 15 deg, apex at r=96)
    for i in range(12):
        deg = i * 30 + 15
        rad = math.radians(deg)
        ax = cx + 96 * math.cos(rad)
        ay = cy + 96 * math.sin(rad)
        
        rad_l = math.radians(deg - 13)
        rad_r = math.radians(deg + 13)
        lx = cx + 72 * math.cos(rad_l)
        ly = cy + 72 * math.sin(rad_l)
        rx = cx + 72 * math.cos(rad_r)
        ry = cy + 72 * math.sin(rad_r)
        
        c1x = cx + 90 * math.cos(math.radians(deg - 7))
        c1y = cy + 90 * math.sin(math.radians(deg - 7))
        c2x = cx + 90 * math.cos(math.radians(deg + 7))
        c2y = cy + 90 * math.sin(math.radians(deg + 7))
        
        d = f"M {lx:.2f},{ly:.2f} Q {c1x:.2f},{c1y:.2f} {ax:.2f},{ay:.2f} Q {c2x:.2f},{c2y:.2f} {rx:.2f},{ry:.2f} Z"
        lines.append(f'    <path id="mandala-mid-petal-{i}" d="{d}" fill="{NAVY_MID}" stroke="{COPPER}" stroke-width="1.5"/>')
        
        # Teardrop inside
        tx = cx + 83 * math.cos(rad)
        ty = cy + 83 * math.sin(rad)
        lines.append(f'    <circle cx="{tx:.2f}" cy="{ty:.2f}" r="2.5" fill="{GOLD}"/>')

    # Concentric borders around r=72 and r=64
    lines.append(f'    <circle id="mandala-ring-72" cx="{cx}" cy="{cy}" r="72" fill="{NAVY}" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <circle id="mandala-ring-64" cx="{cx}" cy="{cy}" r="64" fill="{NAVY_MID}" stroke="{COPPER}" stroke-width="1.2" stroke-dasharray="2,2"/>')

    # Radiating ticks between r=64 and r=72
    for i in range(36):
        rad = math.radians(i * 10)
        t1x = cx + 65 * math.cos(rad)
        t1y = cy + 65 * math.sin(rad)
        t2x = cx + 71 * math.cos(rad)
        t2y = cy + 71 * math.sin(rad)
        lines.append(f'    <line x1="{t1x:.2f}" y1="{t1y:.2f}" x2="{t2x:.2f}" y2="{t2y:.2f}" stroke="{COPPER}" stroke-width="1"/>')

    # Inner 12-petal flower (r=38 to r=60)
    for i in range(12):
        deg = i * 30
        rad = math.radians(deg)
        ax = cx + 58 * math.cos(rad)
        ay = cy + 58 * math.sin(rad)
        
        rad_l = math.radians(deg - 11)
        rad_r = math.radians(deg + 11)
        lx = cx + 36 * math.cos(rad_l)
        ly = cy + 36 * math.sin(rad_l)
        rx = cx + 36 * math.cos(rad_r)
        ry = cy + 36 * math.sin(rad_r)
        
        d = f"M {lx:.2f},{ly:.2f} Q {cx + 52*math.cos(rad-0.1):.2f},{cy + 52*math.sin(rad-0.1):.2f} {ax:.2f},{ay:.2f} Q {cx + 52*math.cos(rad+0.1):.2f},{cy + 52*math.sin(rad+0.1):.2f} {rx:.2f},{ry:.2f} Z"
        lines.append(f'    <path id="mandala-inner-petal-{i}" d="{d}" fill="{NAVY_DEEP}" stroke="{COPPER}" stroke-width="1.4"/>')
        
        # Center petal spine
        sx = cx + 38 * math.cos(rad)
        sy = cy + 38 * math.sin(rad)
        lines.append(f'    <line x1="{sx:.2f}" y1="{sy:.2f}" x2="{ax:.2f}" y2="{ay:.2f}" stroke="{COPPER}" stroke-width="1"/>')

    # Central Lotus Star (r=36)
    lines.append(f'    <circle id="mandala-core-ring" cx="{cx}" cy="{cy}" r="36" fill="{NAVY_MID}" stroke="{COPPER}" stroke-width="1.5"/>')
    for i in range(12):
        rad = math.radians(i * 30)
        px = cx + 31 * math.cos(rad)
        py = cy + 31 * math.sin(rad)
        lines.append(f'    <circle cx="{px:.2f}" cy="{py:.2f}" r="1.5" fill="{PEACH}"/>')

    # Core 12-point star / flower
    pts = []
    for i in range(24):
        r_star = 24 if (i % 2 == 0) else 14
        rad = math.radians(i * 15)
        pts.append(f"{cx + r_star * math.cos(rad):.2f},{cy + r_star * math.sin(rad):.2f}")
    lines.append(f'    <polygon id="mandala-star" points="{" ".join(pts)}" fill="{NAVY_DEEP}" stroke="{COPPER}" stroke-width="1.2"/>')

    # Central Bindu
    lines.append(f'    <circle id="mandala-bindu-outer" cx="{cx}" cy="{cy}" r="10" fill="{NAVY_MID}" stroke="{COPPER}" stroke-width="1.2"/>')
    lines.append(f'    <circle id="mandala-bindu-gold" cx="{cx}" cy="{cy}" r="6" fill="{GOLD}"/>')
    lines.append(f'    <circle id="mandala-bindu-dot" cx="{cx}" cy="{cy}" r="2.5" fill="{IVORY}"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_lotus():
    """
    2. lotus.svg: 120x90, closed-to-open lotus, peach + copper outline.
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">')
    lines.append('  <g id="lotus-root">')

    # Calyx / Sepals at base
    lines.append(f'    <path id="lotus-calyx-left" d="M 60,78 C 50,82 42,80 34,74 C 42,72 52,74 60,78 Z" fill="{GREEN}" stroke="{COPPER}" stroke-width="1.2"/>')
    lines.append(f'    <path id="lotus-calyx-right" d="M 60,78 C 70,82 78,80 86,74 C 78,72 68,74 60,78 Z" fill="{GREEN}" stroke="{COPPER}" stroke-width="1.2"/>')
    lines.append(f'    <path id="lotus-calyx-mid" d="M 52,78 C 56,84 64,84 68,78 C 64,81 56,81 52,78 Z" fill="{GREEN}" stroke="{COPPER}" stroke-width="1.2"/>')

    # Outermost Blooming Petals (lowest spread)
    # Left outer low
    lines.append(f'    <path id="lotus-petal-outer-left" d="M 56,76 C 42,76 25,68 12,52 C 22,48 40,56 54,68 Z" fill="{PEACH}" stroke="{COPPER}" stroke-width="1.4" stroke-linejoin="round"/>')
    # Right outer low
    lines.append(f'    <path id="lotus-petal-outer-right" d="M 64,76 C 78,76 95,68 108,52 C 98,48 80,56 66,68 Z" fill="{PEACH}" stroke="{COPPER}" stroke-width="1.4" stroke-linejoin="round"/>')

    # Mid Outer Blooming Petals (gracefully sweeping up & out)
    # Left mid
    lines.append(f'    <path id="lotus-petal-mid-left" d="M 58,74 C 44,70 28,54 22,34 C 36,36 50,48 58,64 Z" fill="{PEACH_LIGHT}" stroke="{COPPER}" stroke-width="1.4" stroke-linejoin="round"/>')
    # Right mid
    lines.append(f'    <path id="lotus-petal-mid-right" d="M 62,74 C 76,70 92,54 98,34 C 84,36 70,48 62,64 Z" fill="{PEACH_LIGHT}" stroke="{COPPER}" stroke-width="1.4" stroke-linejoin="round"/>')

    # Inner Petals framing center
    # Left inner
    lines.append(f'    <path id="lotus-petal-inner-left" d="M 60,75 C 50,68 36,46 36,22 C 48,26 56,42 60,62 Z" fill="{PEACH}" stroke="{COPPER}" stroke-width="1.4" stroke-linejoin="round"/>')
    # Right inner
    lines.append(f'    <path id="lotus-petal-inner-right" d="M 60,75 C 70,68 84,46 84,22 C 72,26 64,42 60,62 Z" fill="{PEACH}" stroke="{COPPER}" stroke-width="1.4" stroke-linejoin="round"/>')

    # Center Hero Petal (tall, elegant bud standing upright)
    lines.append(f'    <path id="lotus-petal-center" d="M 60,75 C 50,56 48,34 60,10 C 72,34 70,56 60,75 Z" fill="{PEACH_LIGHT}" stroke="{COPPER}" stroke-width="1.5" stroke-linejoin="round"/>')
    # Center petal spine & highlight
    lines.append(f'    <line id="lotus-center-spine" x1="60" y1="22" x2="60" y2="70" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <circle id="lotus-center-dot" cx="60" cy="18" r="1.5" fill="{GOLD}"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_lotus_petal():
    """
    3. lotus-petal.svg: ONE petal, 60x120, pivot at bottom center (30, 120),
    pointing up to (30, 4), peach fill copper outline (will be rotated 16x).
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 120">')
    lines.append('  <g id="lotus-petal-root">')

    # Main Petal Body
    # Starts at base (30, 120), curves outwards symmetrically to max width at y=64 (x=6 to x=54),
    # then tapers smoothly to pointed apex at (30, 6)
    d_outer = "M 30,120 C 24,106 7,85 7,62 C 7,38 20,18 30,6 C 40,18 53,38 53,62 C 53,85 36,106 30,120 Z"
    lines.append(f'    <path id="lotus-petal-body" d="{d_outer}" fill="{PEACH}" stroke="{COPPER}" stroke-width="1.5" stroke-linejoin="round"/>')

    # Inner Tone / Highlight
    d_inner = "M 30,112 C 26,100 13,82 13,62 C 13,44 22,25 30,14 C 38,25 47,44 47,62 C 47,82 34,100 30,112 Z"
    lines.append(f'    <path id="lotus-petal-inner" d="{d_inner}" fill="{PEACH_LIGHT}" stroke="{COPPER}" stroke-width="0.8" opacity="0.85"/>')

    # Central Vein / Spine
    lines.append(f'    <line id="lotus-petal-spine" x1="30" y1="18" x2="30" y2="114" stroke="{COPPER}" stroke-width="1.2" stroke-linecap="round"/>')
    # Decorative petal ribs
    lines.append(f'    <path id="lotus-petal-rib-left" d="M 30,75 Q 22,65 18,55" fill="none" stroke="{COPPER}" stroke-width="0.8" stroke-linecap="round"/>')
    lines.append(f'    <path id="lotus-petal-rib-right" d="M 30,75 Q 38,65 42,55" fill="none" stroke="{COPPER}" stroke-width="0.8" stroke-linecap="round"/>')
    lines.append(f'    <path id="lotus-petal-rib-left2" d="M 30,52 Q 24,44 22,38" fill="none" stroke="{COPPER}" stroke-width="0.8" stroke-linecap="round"/>')
    lines.append(f'    <path id="lotus-petal-rib-right2" d="M 30,52 Q 36,44 38,38" fill="none" stroke="{COPPER}" stroke-width="0.8" stroke-linecap="round"/>')

    # Top jewel accent
    lines.append(f'    <circle id="lotus-petal-dot" cx="30" cy="14" r="1.5" fill="{GOLD}"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_diya():
    """
    4. diya.svg: 100x80, brass diya (gold gradient bowl),
    separable flame id="diya-flame", glow id="diya-glow", bowl id="diya-bowl".
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80">')
    lines.append('  <defs>')
    lines.append('    <radialGradient id="diya-glow-grad" cx="50%" cy="50%" r="50%">')
    lines.append(f'      <stop offset="0%" stop-color="{FLAME}" stop-opacity="0.85"/>')
    lines.append(f'      <stop offset="50%" stop-color="{FLAME_DEEP}" stop-opacity="0.35"/>')
    lines.append(f'      <stop offset="100%" stop-color="{FLAME_DEEP}" stop-opacity="0"/>')
    lines.append('    </radialGradient>')
    lines.append('    <linearGradient id="diya-brass-grad" x1="0%" y1="0%" x2="100%" y2="100%">')
    lines.append(f'      <stop offset="0%" stop-color="{GOLD_LIGHT}"/>')
    lines.append(f'      <stop offset="45%" stop-color="{GOLD}"/>')
    lines.append(f'      <stop offset="100%" stop-color="{GOLD_DARK}"/>')
    lines.append('    </linearGradient>')
    lines.append('    <linearGradient id="diya-rim-grad" x1="0%" y1="0%" x2="0%" y2="100%">')
    lines.append(f'      <stop offset="0%" stop-color="{GOLD_LIGHT}"/>')
    lines.append(f'      <stop offset="100%" stop-color="{GOLD}"/>')
    lines.append('    </linearGradient>')
    lines.append('  </defs>')

    # Glow group (separable, id="diya-glow")
    lines.append('  <g id="diya-glow" class="glow">')
    lines.append('    <circle cx="50" cy="24" r="22" fill="url(#diya-glow-grad)"/>')
    lines.append('  </g>')

    # Flame group (separable, id="diya-flame")
    lines.append('  <g id="diya-flame" class="flame">')
    # Outer flickering flame (teardrop curving upward)
    d_flame_outer = "M 50,42 C 41,39 36,30 38,22 C 40,14 47,8 50,4 C 53,8 60,14 62,22 C 64,30 59,39 50,42 Z"
    lines.append(f'    <path id="diya-flame-outer" d="{d_flame_outer}" fill="{FLAME}"/>')
    # Inner bright flame core (ivory / golden-white hot center)
    d_flame_inner = "M 50,41 C 45,38 42,32 43,25 C 44,19 48,14 50,10 C 52,14 56,19 57,25 C 58,32 55,38 50,41 Z"
    lines.append(f'    <path id="diya-flame-inner" d="{d_flame_inner}" fill="{IVORY}"/>')
    lines.append('  </g>')

    # Bowl group (separable, id="diya-bowl")
    lines.append('  <g id="diya-bowl" class="bowl">')
    # Wick sitting at center rim
    lines.append(f'    <path id="diya-wick" d="M 50,44 Q 50,39 51,37" stroke="{COPPER_TEXT}" stroke-width="2.2" stroke-linecap="round" fill="none"/>')

    # Main bowl basin: graceful curved brass cup with pedestal
    d_bowl = "M 14,46 C 14,60 36,65 44,65 L 42,72 L 32,74 L 32,77 L 68,77 L 68,74 L 58,72 L 56,65 C 64,65 86,60 86,46 Z"
    lines.append(f'    <path id="diya-bowl-body" d="{d_bowl}" fill="url(#diya-brass-grad)" stroke="{COPPER}" stroke-width="1.5" stroke-linejoin="round"/>')

    # Bowl upper lip rim (ellipse with 3D depth)
    lines.append(f'    <ellipse id="diya-bowl-rim" cx="50" cy="46" rx="36" ry="6" fill="url(#diya-rim-grad)" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <ellipse id="diya-bowl-inner-pool" cx="50" cy="46" rx="30" ry="4" fill="{GOLD_DARK}" opacity="0.6"/>')

    # Engraved decorative motifs on bowl body (scalloped lotus petals)
    lines.append(f'    <path id="diya-engraving-mid" d="M 50,49 Q 50,60 50,63" stroke="{COPPER}" stroke-width="1.2" fill="none"/>')
    lines.append(f'    <path id="diya-engraving-left" d="M 34,49 Q 38,58 44,63" stroke="{COPPER}" stroke-width="1.2" fill="none"/>')
    lines.append(f'    <path id="diya-engraving-right" d="M 66,49 Q 62,58 56,63" stroke="{COPPER}" stroke-width="1.2" fill="none"/>')

    # Base ring details
    lines.append(f'    <line id="diya-base-line" x1="33" y1="74" x2="67" y2="74" stroke="{COPPER}" stroke-width="1.2"/>')
    lines.append(f'    <circle id="diya-jewel-1" cx="44" cy="75.5" r="1" fill="{ROSE}"/>')
    lines.append(f'    <circle id="diya-jewel-2" cx="50" cy="75.5" r="1" fill="{ROSE}"/>')
    lines.append(f'    <circle id="diya-jewel-3" cx="56" cy="75.5" r="1" fill="{ROSE}"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_peacock():
    """
    5. peacock.svg: 220x240, peacock facing right, navy/teal/green body,
    gold eye feathers, thin copper outlines.
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 240">')
    lines.append('  <defs>')
    lines.append('    <linearGradient id="peacock-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">')
    lines.append(f'      <stop offset="0%" stop-color="{NAVY}"/>')
    lines.append(f'      <stop offset="40%" stop-color="{TEAL}"/>')
    lines.append(f'      <stop offset="100%" stop-color="{GREEN}"/>')
    lines.append('    </linearGradient>')
    lines.append('    <linearGradient id="peacock-tail-grad" x1="0%" y1="0%" x2="100%" y2="100%">')
    lines.append(f'      <stop offset="0%" stop-color="{TEAL}"/>')
    lines.append(f'      <stop offset="100%" stop-color="{NAVY_DEEP}"/>')
    lines.append('    </linearGradient>')
    lines.append('  </defs>')
    lines.append('  <g id="peacock-root">')

    # --- TAIL PLUMAGE (cascading left and down from body) ---
    # Background train fan
    lines.append(f'    <path id="peacock-train-bg" d="M 125,120 C 100,120 50,140 24,185 C 10,210 20,230 45,232 C 85,235 125,195 138,150 Z" fill="url(#peacock-tail-grad)" stroke="{COPPER}" stroke-width="1.5"/>')

    # Distinct tail feathers with peacock eyes (ocelli)
    eyes = [
        (35, 215, 12, 16, -20),
        (58, 222, 13, 17, -10),
        (85, 218, 14, 18, 5),
        (46, 188, 13, 17, -25),
        (72, 192, 14, 18, -15),
        (100, 186, 14, 18, 10),
        (68, 160, 13, 17, -20),
        (96, 158, 13, 17, 0),
        (120, 155, 12, 16, 15),
    ]

    for idx, (ex, ey, rx, ry, rot) in enumerate(eyes):
        lines.append(f'    <g id="peacock-eye-{idx}" transform="rotate({rot} {ex} {ey})">')
        # Feather barb strands leading to eye
        lines.append(f'      <line x1="{ex}" y1="{ey+15}" x2="{ex}" y2="{ey-15}" stroke="{GREEN}" stroke-width="1"/>')
        # Outer gold aura
        lines.append(f'      <ellipse cx="{ex}" cy="{ey}" rx="{rx}" ry="{ry}" fill="{GOLD}" stroke="{COPPER}" stroke-width="1"/>')
        # Teal iridescent ring
        lines.append(f'      <ellipse cx="{ex}" cy="{ey+1}" rx="{rx*0.72:.1f}" ry="{ry*0.72:.1f}" fill="{TEAL}"/>')
        # Deep navy pupil (heart / bean shape)
        lines.append(f'      <ellipse cx="{ex}" cy="{ey+2}" rx="{rx*0.45:.1f}" ry="{ry*0.45:.1f}" fill="{NAVY_DEEP}"/>')
        # Inner glint
        lines.append(f'      <circle cx="{ex-1.5}" cy="{ey}" r="1.5" fill="{IVORY}"/>')
        lines.append('    </g>')

    # Perch branch / foot support
    lines.append(f'    <path id="peacock-perch" d="M 80,188 Q 125,182 170,184" stroke="{COPPER}" stroke-width="2.5" stroke-linecap="round" fill="none"/>')
    # Claws
    lines.append(f'    <path id="peacock-foot" d="M 124,175 L 122,185 M 128,175 L 129,185 M 134,175 L 137,185" stroke="{COPPER_TEXT}" stroke-width="1.8" stroke-linecap="round"/>')

    # --- BODY & BREAST (facing right) ---
    # Back, breast and neck curve
    # Head at (152, 45), neck curves to (140, 75) and swells into breast at (168, 110)
    d_body = "M 150,42 C 142,60 134,80 132,105 C 130,130 134,152 145,168 C 158,166 172,150 174,130 C 176,112 172,96 160,80 C 156,66 158,54 154,42 Z"
    lines.append(f'    <path id="peacock-body" d="{d_body}" fill="url(#peacock-body-grad)" stroke="{COPPER}" stroke-width="1.5" stroke-linejoin="round"/>')

    # Folded Wing with scalloped tiers
    d_wing = "M 134,106 C 145,104 165,110 168,124 C 168,142 152,160 138,166 C 132,150 130,128 134,106 Z"
    lines.append(f'    <path id="peacock-wing-base" d="{d_wing}" fill="{TEAL}" stroke="{COPPER}" stroke-width="1.4"/>')
    # Scalloped covert feathers
    lines.append(f'    <path id="peacock-wing-scallop-1" d="M 140,116 Q 150,114 162,120" stroke="{COPPER}" stroke-width="1.2" fill="none"/>')
    lines.append(f'    <path id="peacock-wing-scallop-2" d="M 136,128 Q 148,126 162,132" stroke="{COPPER}" stroke-width="1.2" fill="none"/>')
    lines.append(f'    <path id="peacock-wing-scallop-3" d="M 135,140 Q 146,138 158,144" stroke="{COPPER}" stroke-width="1.2" fill="none"/>')
    lines.append(f'    <path id="peacock-wing-scallop-4" d="M 136,152 Q 144,150 152,155" stroke="{COPPER}" stroke-width="1.2" fill="none"/>')

    # Head & Neck details
    # Graceful head profile
    d_head = "M 148,46 C 146,38 154,32 162,36 C 168,40 166,48 160,54 C 154,58 149,54 148,46 Z"
    lines.append(f'    <path id="peacock-head" d="{d_head}" fill="{NAVY}" stroke="{COPPER}" stroke-width="1.3"/>')

    # Beak (sharp golden beak pointing right)
    lines.append(f'    <polygon id="peacock-beak" points="163,38 176,43 162,47" fill="{GOLD}" stroke="{COPPER}" stroke-width="1"/>')

    # Eye (regal almond eye)
    lines.append(f'    <path id="peacock-eye-almond" d="M 153,40 Q 158,36 163,40 Q 158,44 153,40 Z" fill="{IVORY}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <circle id="peacock-eye-pupil" cx="158" cy="40" r="1.8" fill="{NAVY_DEEP}"/>')
    lines.append(f'    <circle id="peacock-eye-glint" cx="157.3" cy="39.3" r="0.6" fill="{IVORY}"/>')

    # Crest / Kalangi (3 golden stalks with fan plumes at top)
    lines.append(f'    <path id="peacock-crest-stem-1" d="M 152,34 Q 152,20 156,12" stroke="{COPPER}" stroke-width="1.2" fill="none"/>')
    lines.append(f'    <path id="peacock-crest-stem-2" d="M 154,34 Q 158,20 165,14" stroke="{COPPER}" stroke-width="1.2" fill="none"/>')
    lines.append(f'    <path id="peacock-crest-stem-3" d="M 156,35 Q 164,22 174,18" stroke="{COPPER}" stroke-width="1.2" fill="none"/>')

    lines.append(f'    <circle id="peacock-crest-plume-1" cx="156" cy="11" r="3.2" fill="{GOLD}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <circle id="peacock-crest-center-1" cx="156" cy="11" r="1.5" fill="{TEAL}"/>')

    lines.append(f'    <circle id="peacock-crest-plume-2" cx="165" cy="13" r="3.2" fill="{GOLD}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <circle id="peacock-crest-center-2" cx="165" cy="13" r="1.5" fill="{TEAL}"/>')

    lines.append(f'    <circle id="peacock-crest-plume-3" cx="174" cy="17" r="3.2" fill="{GOLD}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <circle id="peacock-crest-center-3" cx="174" cy="17" r="1.5" fill="{TEAL}"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_peacock_feather():
    """
    6. peacock-feather.svg: ONE feather, 40x200, pivot at bottom center (20, 200),
    pointing up, with eye at the top.
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 200">')
    lines.append('  <g id="peacock-feather-root">')

    # Central Quill / Rachis (pivot at bottom center 20, 200)
    lines.append(f'    <line id="peacock-feather-quill" x1="20" y1="200" x2="20" y2="24" stroke="{GOLD}" stroke-width="1.8" stroke-linecap="round"/>')

    # Feather Barbs / Filaments flaring out from y=150 to y=60
    # Left & Right barbs
    for y in range(65, 150, 7):
        w = 16 * math.sin(math.radians((150 - y) / 90 * 180))
        lines.append(f'    <path d="M 20,{y} Q 12,{y-6} {20-w:.1f},{y-12}" stroke="{GREEN}" stroke-width="1.1" stroke-linecap="round" fill="none"/>')
        lines.append(f'    <path d="M 20,{y} Q 28,{y-6} {20+w:.1f},{y-12}" stroke="{TEAL}" stroke-width="1.1" stroke-linecap="round" fill="none"/>')

    # Fine upper barbs framing the eye
    for y in range(40, 65, 5):
        lines.append(f'    <path d="M 20,{y} Q 10,{y-4} 5,{y-8}" stroke="{GREEN}" stroke-width="0.9" stroke-linecap="round" fill="none"/>')
        lines.append(f'    <path d="M 20,{y} Q 30,{y-4} 35,{y-8}" stroke="{TEAL}" stroke-width="0.9" stroke-linecap="round" fill="none"/>')

    # Crown barbs above the eye (y=10 to 30)
    lines.append(f'    <path d="M 20,25 Q 12,16 10,8" stroke="{GREEN}" stroke-width="0.9" stroke-linecap="round" fill="none"/>')
    lines.append(f'    <path d="M 20,25 Q 28,16 30,8" stroke="{TEAL}" stroke-width="0.9" stroke-linecap="round" fill="none"/>')
    lines.append(f'    <path d="M 20,20 L 20,4" stroke="{GOLD}" stroke-width="1" stroke-linecap="round"/>')

    # --- THE EYE (OCELLUS) centered at (20, 44) ---
    # Outer Golden Halo
    lines.append(f'    <ellipse id="peacock-feather-eye-gold" cx="20" cy="44" rx="14" ry="18" fill="{GOLD}" stroke="{COPPER}" stroke-width="1"/>')
    # Rich Teal Ring
    lines.append(f'    <ellipse id="peacock-feather-eye-teal" cx="20" cy="45" rx="10.5" ry="13.5" fill="{TEAL}"/>')
    # Deep Navy Pupil (heart / kidney curve)
    d_pupil = "M 20,40 C 15,40 13,44 14,48 C 15,52 18,54 20,53 C 22,54 25,52 26,48 C 27,44 25,40 20,40 Z"
    lines.append(f'    <path id="peacock-feather-eye-pupil" d="{d_pupil}" fill="{NAVY_DEEP}"/>')
    # Inner light glint
    lines.append(f'    <circle id="peacock-feather-eye-glint" cx="18" cy="44" r="1.8" fill="{IVORY}"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_marigold_petal():
    """
    7. marigold-petal.svg: 24x24, single flame-orange petal, ruffled top edge.
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">')
    lines.append('  <g id="marigold-petal-root">')

    # Petal Body: base at (12, 23), spreading up with ruffled 3-lobe top edge
    d = "M 12,23 C 8,20 3,15 3,10 C 3,6 5,4 7,5 C 8.5,3 11,3 12,4.5 C 13,3 15.5,3 17,5 C 19,4 21,6 21,10 C 21,15 16,20 12,23 Z"
    lines.append(f'    <path id="marigold-petal-body" d="{d}" fill="{FLAME}" stroke="{FLAME_DEEP}" stroke-width="0.8" stroke-linejoin="round"/>')

    # Inner Shading / Crease
    d_crease = "M 12,22 C 10.5,18 7,12 8,7 C 9.5,10 11.5,16 12,22 Z"
    lines.append(f'    <path id="marigold-petal-shade" d="{d_crease}" fill="{FLAME_DEEP}" opacity="0.6"/>')

    # Delicate central vein
    lines.append(f'    <line id="marigold-petal-vein" x1="12" y1="21" x2="12" y2="6" stroke="{COPPER}" stroke-width="0.7" stroke-linecap="round"/>')
    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_tile_wave():
    """
    8. tile-wave.svg: 64x64, seamless navy wave-pattern tile (as the card border).
    Background: navy-deep (#0A1B5C).
    Concentric circular scalloped waves in wallpaper group cmm (centers at (0,0), (64,0), (32,32), (0,64), (64,64)).
    Tiles seamlessly in X and Y!
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">')
    lines.append('  <g id="tile-wave-root">')
    # Background
    lines.append(f'    <rect id="tile-wave-bg" width="64" height="64" fill="{NAVY_DEEP}"/>')

    # Centers of the wave groups
    # Every circle with center (cx, cy) and radius r is drawn.
    # To tile seamlessly across 0..64 in both dimensions:
    # Set of centers:
    # Corners: (0,0), (64,0), (0,64), (64,64)
    # Tile center: (32, 32)
    # Radii: 32, 24, 16, 8
    centers = [(0, 0), (64, 0), (0, 64), (64, 64), (32, 32)]
    radii = [32, 24, 16, 8]

    # Clip path to ensure clean bounding
    lines.append('    <defs>')
    lines.append('      <clipPath id="tile-wave-clip">')
    lines.append('        <rect width="64" height="64"/>')
    lines.append('      </clipPath>')
    lines.append('    </defs>')
    lines.append('    <g clip-path="url(#tile-wave-clip)">')

    for cx, cy in centers:
        for r in radii:
            # Subtle wave lines in navy-mid, navy, and navy-line
            color = NAVY_LINE if r == 32 else (NAVY_MID if r == 16 else NAVY)
            sw = 1.4 if r == 32 else 1.0
            lines.append(f'      <circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{color}" stroke-width="{sw}"/>')
        # Center pearl dot at each wave origin
        lines.append(f'      <circle cx="{cx}" cy="{cy}" r="2" fill="{COPPER}" opacity="0.6"/>')

    lines.append('    </g>')
    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_tile_jaali():
    """
    9. tile-jaali.svg: 56x56, seamless lattice tile (stars + circles), stroke gold-light (#F0D58A).
    Tiles seamlessly in X and Y!
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">')
    lines.append('  <g id="tile-jaali-root" fill="none" stroke="' + GOLD_LIGHT + '" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">')

    # Centers of 8-pointed stars:
    # 1. Center of tile: (28, 28)
    # 2. Four corners (quarter stars that unite when tiled): (0,0), (56,0), (0,56), (56,56)
    def star_pts(cx, cy, r_out=12, r_in=7):
        pts = []
        for i in range(16):
            r = r_out if (i % 2 == 0) else r_in
            rad = math.radians(i * 22.5)
            pts.append(f"{cx + r * math.cos(rad):.2f},{cy + r * math.sin(rad):.2f}")
        return " ".join(pts)

    # Clip to tile boundary
    lines.append('    <defs>')
    lines.append('      <clipPath id="tile-jaali-clip">')
    lines.append('        <rect width="56" height="56"/>')
    lines.append('      </clipPath>')
    lines.append('    </defs>')
    lines.append('    <g clip-path="url(#tile-jaali-clip)">')

    # Center star
    lines.append(f'      <polygon id="tile-jaali-star-center" points="{star_pts(28, 28, 12, 7)}"/>')
    lines.append('      <circle cx="28" cy="28" r="3" fill="none"/>')

    # Corner stars
    for idx, (cx, cy) in enumerate([(0,0), (56,0), (0,56), (56,56)]):
        lines.append(f'      <polygon id="tile-jaali-star-corner-{idx}" points="{star_pts(cx, cy, 12, 7)}"/>')
        lines.append(f'      <circle cx="{cx}" cy="{cy}" r="3" fill="none"/>')

    # Connecting circles at edge midpoints: (28,0), (28,56), (0,28), (56,28)
    # Radius = 8 (interlocks with star points at distance 28 - 12 = 16 / 2 = 8)
    for idx, (cx, cy) in enumerate([(28, 0), (28, 56), (0, 28), (56, 28)]):
        lines.append(f'      <circle id="tile-jaali-circle-{idx}" cx="{cx}" cy="{cy}" r="8"/>')
        lines.append(f'      <circle cx="{cx}" cy="{cy}" r="2" fill="{GOLD_LIGHT}"/>')

    lines.append('    </g>')
    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_divider_lotus():
    """
    10. divider-lotus.svg: 240x24, line-lotus-line divider.
    Center lotus flanked by delicate copper lines with diamond accents.
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 24">')
    lines.append('  <g id="divider-lotus-root">')

    # Horizontal Lines Left & Right
    # Left line: 10 to 105
    lines.append(f'    <line id="divider-lotus-line-left" x1="12" y1="12" x2="105" y2="12" stroke="{COPPER}" stroke-width="1"/>')
    # Right line: 135 to 228
    lines.append(f'    <line id="divider-lotus-line-right" x1="135" y1="12" x2="228" y2="12" stroke="{COPPER}" stroke-width="1"/>')

    # Terminal dots / diamonds
    lines.append(f'    <circle cx="12" cy="12" r="1.5" fill="{COPPER}"/>')
    lines.append(f'    <circle cx="228" cy="12" r="1.5" fill="{COPPER}"/>')

    # Accent diamonds on lines
    for x in [35, 70, 170, 205]:
        lines.append(f'    <polygon points="{x},9.5 {x+2.5},12 {x},14.5 {x-2.5},12" fill="{GOLD}" stroke="{COPPER}" stroke-width="0.6"/>')

    # Center Mini Lotus (x=105 to 135, y=3 to 21)
    # Base sepals / calyx
    lines.append(f'    <path id="divider-lotus-calyx-left" d="M 120,18 C 114,19 108,18 105,15 C 109,14 116,16 120,18 Z" fill="{GREEN}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <path id="divider-lotus-calyx-right" d="M 120,18 C 126,19 132,18 135,15 C 131,14 124,16 120,18 Z" fill="{GREEN}" stroke="{COPPER}" stroke-width="0.8"/>')

    # Flanking petals
    lines.append(f'    <path id="divider-lotus-petal-l" d="M 120,17 C 114,15 109,10 111,6 C 116,8 118,12 120,17 Z" fill="{PEACH}" stroke="{COPPER}" stroke-width="0.9"/>')
    lines.append(f'    <path id="divider-lotus-petal-r" d="M 120,17 C 126,15 131,10 129,6 C 124,8 122,12 120,17 Z" fill="{PEACH}" stroke="{COPPER}" stroke-width="0.9"/>')

    # Center petal
    lines.append(f'    <path id="divider-lotus-petal-c" d="M 120,17 C 117,12 116,7 120,3 C 124,7 123,12 120,17 Z" fill="{PEACH_LIGHT}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <circle cx="120" cy="8" r="1" fill="{GOLD}"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_divider_diamond():
    """
    11. divider-diamond.svg: 240x12, line-diamond-line divider.
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 12">')
    lines.append('  <g id="divider-diamond-root">')

    # Left & Right Lines
    lines.append(f'    <line id="divider-diamond-line-left" x1="12" y1="6" x2="104" y2="6" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <line id="divider-diamond-line-right" x1="136" y1="6" x2="228" y2="6" stroke="{COPPER}" stroke-width="1"/>')

    # Terminals
    lines.append(f'    <circle cx="12" cy="6" r="1.5" fill="{COPPER}"/>')
    lines.append(f'    <circle cx="228" cy="6" r="1.5" fill="{COPPER}"/>')

    # Accent dots along line
    for x in [45, 75, 165, 195]:
        lines.append(f'    <circle cx="{x}" cy="6" r="1.2" fill="{COPPER}"/>')

    # Center Cluster (x=104 to 136)
    # Flanking small diamonds
    lines.append(f'    <polygon id="divider-diamond-side-l" points="110,3.5 112.5,6 110,8.5 107.5,6" fill="{COPPER}"/>')
    lines.append(f'    <polygon id="divider-diamond-side-r" points="130,3.5 132.5,6 130,8.5 127.5,6" fill="{COPPER}"/>')
    lines.append(f'    <circle cx="104" cy="6" r="1.2" fill="{COPPER}"/>')
    lines.append(f'    <circle cx="136" cy="6" r="1.2" fill="{COPPER}"/>')

    # Main Hero Diamond at (120, 6)
    lines.append(f'    <polygon id="divider-diamond-main" points="120,1.5 124.5,6 120,10.5 115.5,6" fill="{GOLD}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <circle id="divider-diamond-center-dot" cx="120" cy="6" r="1.2" fill="{IVORY}"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def main():
    target_dir = "assets/svg"
    os.makedirs(target_dir, exist_ok=True)

    files = {
        "mandala.svg": gen_mandala(),
        "lotus.svg": gen_lotus(),
        "lotus-petal.svg": gen_lotus_petal(),
        "diya.svg": gen_diya(),
        "peacock.svg": gen_peacock(),
        "peacock-feather.svg": gen_peacock_feather(),
        "marigold-petal.svg": gen_marigold_petal(),
        "tile-wave.svg": gen_tile_wave(),
        "tile-jaali.svg": gen_tile_jaali(),
        "divider-lotus.svg": gen_divider_lotus(),
        "divider-diamond.svg": gen_divider_diamond(),
    }

    print("Generating SVGs...")
    for filename, content in files.items():
        filepath = os.path.join(target_dir, filename)
        with open(filepath, "w") as f:
            f.write(content)
        size_kb = len(content.encode('utf-8')) / 1024
        print(f"  {filename:22} : {size_kb:6.2f} KB (limit: 40 KB)")

if __name__ == "__main__":
    main()
