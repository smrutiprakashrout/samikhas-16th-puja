#!/usr/bin/env python3
"""
Generate SVG Set B (Scene Art: B1–B13) for Samikshya's 16th Birthday Puja.
All designs adhere strictly to docs/DESIGN-TOKENS.md and REQUIREMENTS.md.
"""
import math
import os

# Palette tokens
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

def gen_door(side="left"):
    """
    B1: door-left.svg / door-right.svg (195x844 each).
    Carved jharokha door halves, navy with copper panels and jaali lattice, meeting at center seam.
    """
    w, h = 195, 844
    is_left = (side == "left")
    prefix = f"door-{side}"
    
    # Seam is at x=195 for left door, x=0 for right door
    seam_x = 195 if is_left else 0
    hinge_x = 0 if is_left else 195
    
    lines = []
    lines.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">')
    lines.append('  <defs>')
    lines.append(f'    <pattern id="{prefix}-jaali" width="28" height="28" patternUnits="userSpaceOnUse">')
    lines.append(f'      <polygon points="14,2 18,10 26,14 18,18 14,26 10,18 2,14 10,10" fill="none" stroke="{GOLD_LIGHT}" stroke-width="0.8"/>')
    lines.append(f'      <circle cx="14" cy="14" r="2.5" fill="none" stroke="{GOLD_LIGHT}" stroke-width="0.7"/>')
    lines.append('    </pattern>')
    lines.append('  </defs>')
    lines.append(f'  <g id="{prefix}-root">')

    # Main door background
    lines.append(f'    <rect id="{prefix}-base" width="{w}" height="{h}" fill="{NAVY_DEEP}"/>')

    # Outer carved border frame (hinge side, top, bottom)
    if is_left:
        lines.append(f'    <rect id="{prefix}-frame" x="0" y="0" width="192" height="{h}" fill="none" stroke="{COPPER}" stroke-width="3"/>')
        lines.append(f'    <rect id="{prefix}-inner-keyline" x="8" y="8" width="176" height="{h-16}" fill="none" stroke="{COPPER}" stroke-width="1.2" stroke-dasharray="3,3"/>')
    else:
        lines.append(f'    <rect id="{prefix}-frame" x="3" y="0" width="192" height="{h}" fill="none" stroke="{COPPER}" stroke-width="3"/>')
        lines.append(f'    <rect id="{prefix}-inner-keyline" x="11" y="8" width="176" height="{h-16}" fill="none" stroke="{COPPER}" stroke-width="1.2" stroke-dasharray="3,3"/>')

    # Three stacked carved panels: Upper Jharokha, Middle Rosette, Lower Studded
    px = 16 if is_left else 24
    pw = 155
    
    # 1. UPPER PANEL: Cusped Jharokha Arch with Jaali (y=24 to 280)
    lines.append(f'    <rect id="{prefix}-panel-upper" x="{px}" y="24" width="{pw}" height="260" rx="4" fill="{NAVY_MID}" stroke="{COPPER}" stroke-width="1.5"/>')
    
    # Cusped multi-foil arch outline inside upper panel
    arch_cx = px + pw/2
    # Jharokha arch shape
    d_arch = f"M {px+10},260 L {px+10},120 Q {px+10},70 {arch_cx},40 Q {px+pw-10},70 {px+pw-10},120 L {px+pw-10},260 Z"
    lines.append(f'    <path id="{prefix}-arch-fill" d="{d_arch}" fill="{NAVY_DEEP}" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <path id="{prefix}-arch-jaali" d="{d_arch}" fill="url(#{prefix}-jaali)"/>')
    
    # Cusped arches along the curve
    lines.append(f'    <path id="{prefix}-arch-cusps" d="M {px+12},130 Q {px+24},105 {px+40},95 Q {px+60},75 {arch_cx},52 Q {px+pw-60},75 {px+pw-40},95 Q {px+pw-24},105 {px+pw-12},130" fill="none" stroke="{COPPER}" stroke-width="1.8"/>')

    # 2. MIDDLE PANEL: Ornate Rosette / Medallion (y=304 to 530)
    lines.append(f'    <rect id="{prefix}-panel-mid" x="{px}" y="304" width="{pw}" height="226" rx="4" fill="{NAVY_MID}" stroke="{COPPER}" stroke-width="1.5"/>')
    mid_cx = px + pw/2
    mid_cy = 417
    
    # Central carved lotus medallion
    lines.append(f'    <circle id="{prefix}-medallion-bg" cx="{mid_cx}" cy="{mid_cy}" r="54" fill="{NAVY_DEEP}" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <circle id="{prefix}-medallion-dash" cx="{mid_cx}" cy="{mid_cy}" r="48" fill="none" stroke="{COPPER}" stroke-width="1" stroke-dasharray="2,2"/>')
    
    # 8-Petal Rosette
    for i in range(8):
        rad = math.radians(i * 45)
        pet_ax = mid_cx + 42 * math.cos(rad)
        pet_ay = mid_cy + 42 * math.sin(rad)
        c1x = mid_cx + 36 * math.cos(rad - 0.25)
        c1y = mid_cy + 36 * math.sin(rad - 0.25)
        c2x = mid_cx + 36 * math.cos(rad + 0.25)
        c2y = mid_cy + 36 * math.sin(rad + 0.25)
        lines.append(f'    <path d="M {mid_cx},{mid_cy} Q {c1x:.1f},{c1y:.1f} {pet_ax:.1f},{pet_ay:.1f} Q {c2x:.1f},{c2y:.1f} {mid_cx},{mid_cy} Z" fill="{PEACH}" stroke="{COPPER}" stroke-width="1"/>')
    
    lines.append(f'    <circle id="{prefix}-medallion-core" cx="{mid_cx}" cy="{mid_cy}" r="12" fill="{GOLD}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <circle id="{prefix}-medallion-dot" cx="{mid_cx}" cy="{mid_cy}" r="4" fill="{IVORY}"/>')

    # 3. LOWER PANEL: Studded Royal Field (y=550 to 820)
    lines.append(f'    <rect id="{prefix}-panel-lower" x="{px}" y="550" width="{pw}" height="270" rx="4" fill="{NAVY_MID}" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <rect id="{prefix}-panel-lower-inner" x="{px+8}" y="558" width="{pw-16}" height="254" fill="{NAVY_DEEP}" stroke="{COPPER}" stroke-width="1"/>')
    
    # Grid of brass studs (bosses)
    stud_cols = 3
    stud_rows = 5
    for r in range(stud_rows):
        for c in range(stud_cols):
            sx = px + 24 + c * 53
            sy = 582 + r * 52
            lines.append(f'    <circle cx="{sx}" cy="{sy}" r="7" fill="{GOLD}" stroke="{COPPER}" stroke-width="1.2"/>')
            lines.append(f'    <circle cx="{sx-1}" cy="{sy-1}" r="2.5" fill="{GOLD_LIGHT}"/>')

    # CENTER SEAM & DOOR KNOCKER
    if is_left:
        # Seam vertical bead strip on right edge
        lines.append(f'    <rect id="{prefix}-seam-bead" x="190" y="0" width="5" height="{h}" fill="{COPPER}"/>')
        # Brass knocker plate & ring at y=422
        lines.append(f'    <circle id="{prefix}-knocker-plate" cx="185" cy="422" r="14" fill="{GOLD}" stroke="{COPPER}" stroke-width="1.5"/>')
        lines.append(f'    <circle id="{prefix}-knocker-ring" cx="185" cy="432" r="10" fill="none" stroke="{COPPER_TEXT}" stroke-width="2.5"/>')
    else:
        # Seam vertical bead strip on left edge
        lines.append(f'    <rect id="{prefix}-seam-bead" x="0" y="0" width="5" height="{h}" fill="{COPPER}"/>')
        # Brass knocker plate & ring at y=422
        lines.append(f'    <circle id="{prefix}-knocker-plate" cx="10" cy="422" r="14" fill="{GOLD}" stroke="{COPPER}" stroke-width="1.5"/>')
        lines.append(f'    <circle id="{prefix}-knocker-ring" cx="10" cy="432" r="10" fill="none" stroke="{COPPER_TEXT}" stroke-width="2.5"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_bell():
    """
    B2: bell.svg (120x260).
    Brass temple bell with rope and handle at bottom.
    Body id="bell-body" so it can swing from top.
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 260">')
    lines.append('  <defs>')
    lines.append('    <linearGradient id="bell-gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">')
    lines.append(f'      <stop offset="0%" stop-color="{GOLD_DARK}"/>')
    lines.append(f'      <stop offset="35%" stop-color="{GOLD_LIGHT}"/>')
    lines.append(f'      <stop offset="70%" stop-color="{GOLD}"/>')
    lines.append(f'      <stop offset="100%" stop-color="{GOLD_DARK}"/>')
    lines.append('    </linearGradient>')
    lines.append('  </defs>')
    lines.append('  <g id="bell-root">')

    # Fixed Hanging Bracket / Ring at top
    lines.append(f'    <circle id="bell-top-anchor" cx="60" cy="14" r="8" fill="none" stroke="{COPPER}" stroke-width="3"/>')
    lines.append(f'    <rect id="bell-beam-hook" x="57" y="0" width="6" height="12" fill="{COPPER}"/>')

    # Bell Body Group (swingable from top origin (60, 24))
    lines.append('  <g id="bell-body">')
    # Crown loop connecting to top ring
    lines.append(f'    <path id="bell-crown-loop" d="M 52,24 C 52,14 68,14 68,24 Z" fill="{GOLD}" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <rect id="bell-dome-cap" x="48" y="24" width="24" height="6" rx="2" fill="{GOLD_LIGHT}" stroke="{COPPER}" stroke-width="1"/>')

    # Main Bell Dome & Flared Rim (from y=30 to y=110)
    d_bell = "M 48,30 C 48,50 30,75 22,98 L 18,108 C 18,112 102,112 102,108 L 98,98 C 90,75 72,50 72,30 Z"
    lines.append(f'    <path id="bell-dome" d="{d_bell}" fill="url(#bell-gold-grad)" stroke="{COPPER}" stroke-width="1.5" stroke-linejoin="round"/>')

    # Rim Lip (ellipse)
    lines.append(f'    <ellipse id="bell-rim-lip" cx="60" cy="108" rx="42" ry="7" fill="{GOLD}" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <ellipse id="bell-rim-inner" cx="60" cy="108" rx="36" ry="5" fill="{NAVY_DEEP}" opacity="0.75"/>')

    # Carved ornamental bands on bell body
    lines.append(f'    <path d="M 36,65 Q 60,72 84,65" fill="none" stroke="{COPPER}" stroke-width="1.2"/>')
    lines.append(f'    <path d="M 30,82 Q 60,90 90,82" fill="none" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <path d="M 24,96 Q 60,105 96,96" fill="none" stroke="{COPPER}" stroke-width="1.2" stroke-dasharray="2,2"/>')

    # Clapper (tongue) inside bell
    lines.append(f'    <path id="bell-clapper" d="M 58,105 L 57,124 A 6,6 0 1,0 63,124 L 62,105 Z" fill="{GOLD_DARK}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append('  </g>')

    # Rope and Pull Handle (hanging down from clapper)
    # Twisted cord from y=128 to y=205
    lines.append(f'    <path id="bell-rope" d="M 60,128 Q 58,165 60,205" stroke="{GOLD}" stroke-width="2.5" stroke-dasharray="4,2" fill="none"/>')

    # Handle / Tassel at bottom (y=205 to 255 - ≥ 44px hit target)
    lines.append('  <g id="bell-handle">')
    lines.append(f'    <rect id="bell-handle-top-ring" x="55" y="205" width="10" height="4" rx="2" fill="{COPPER}"/>')
    lines.append(f'    <circle id="bell-handle-jewel" cx="60" cy="214" r="5" fill="{ROSE}" stroke="{COPPER}" stroke-width="1"/>')
    # Ornate brass drop handle
    d_handle = "M 57,219 L 55,242 C 55,250 65,250 65,242 L 63,219 Z"
    lines.append(f'    <path id="bell-handle-body" d="{d_handle}" fill="{GOLD}" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <circle id="bell-handle-bottom-ball" cx="60" cy="246" r="6" fill="{GOLD_LIGHT}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append('  </g>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_rangoli():
    """
    B3: rangoli.svg (300x300).
    Concentric rings and petals as separate stroke-only <path>s with ids rangoli-r1...rangoli-r8 (inner to outer).
    fill="none", stroke-linecap="round", each path is one continuous stroke.
    """
    cx, cy = 150, 150
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">')
    lines.append('  <g id="rangoli-root" fill="none" stroke-linecap="round" stroke-linejoin="round">')

    # r1: Inner core circle (r=12)
    # One continuous closed circular arc path
    d_r1 = f"M {cx-12},{cy} A 12,12 0 1,0 {cx+12},{cy} A 12,12 0 1,0 {cx-12},{cy} Z"
    lines.append(f'    <path id="rangoli-r1" class="r1" d="{d_r1}" stroke="{IVORY}" stroke-width="1.8"/>')

    # r2: 8-petal inner flower loop (r=26)
    pts_r2 = []
    for i in range(8):
        deg = i * 45
        rad = math.radians(deg)
        ax = cx + 26 * math.cos(rad)
        ay = cy + 26 * math.sin(rad)
        rad_b = math.radians(deg + 22.5)
        bx = cx + 16 * math.cos(rad_b)
        by = cy + 16 * math.sin(rad_b)
        if i == 0:
            pts_r2.append(f"M {ax:.2f},{ay:.2f}")
        else:
            pts_r2.append(f"L {ax:.2f},{ay:.2f}")
        pts_r2.append(f"Q {bx:.2f},{by:.2f}")
    pts_r2.append("Z")
    # Smooth continuous 8-petal flower path
    d_r2_parts = []
    for i in range(8):
        deg = i * 45
        rad = math.radians(deg)
        ax = cx + 26 * math.cos(rad)
        ay = cy + 26 * math.sin(rad)
        rad_l = math.radians(deg - 15)
        rad_r = math.radians(deg + 15)
        c1x = cx + 22 * math.cos(rad_l)
        c1y = cy + 22 * math.sin(rad_l)
        c2x = cx + 22 * math.cos(rad_r)
        c2y = cy + 22 * math.sin(rad_r)
        bx = cx + 14 * math.cos(math.radians(deg + 22.5))
        by = cy + 14 * math.sin(math.radians(deg + 22.5))
        if i == 0:
            d_r2_parts.append(f"M {cx+14*math.cos(math.radians(-22.5)):.2f},{cy+14*math.sin(math.radians(-22.5)):.2f}")
        d_r2_parts.append(f"Q {c1x:.2f},{c1y:.2f} {ax:.2f},{ay:.2f} Q {c2x:.2f},{c2y:.2f} {bx:.2f},{by:.2f}")
    d_r2_parts.append("Z")
    lines.append(f'    <path id="rangoli-r2" class="r2" d="{" ".join(d_r2_parts)}" stroke="{PEACH}" stroke-width="1.6"/>')

    # r3: Ring circle at r=40
    d_r3 = f"M {cx-40},{cy} A 40,40 0 1,0 {cx+40},{cy} A 40,40 0 1,0 {cx-40},{cy} Z"
    lines.append(f'    <path id="rangoli-r3" class="r3" d="{d_r3}" stroke="{COPPER}" stroke-width="1.8"/>')

    # r4: 12 Scalloped Arcs / Waves along r=40 to r=58
    d_r4_parts = []
    for i in range(12):
        deg = i * 30
        rad = math.radians(deg)
        rad_next = math.radians((i + 1) * 30)
        p1x = cx + 42 * math.cos(rad)
        p1y = cy + 42 * math.sin(rad)
        p2x = cx + 42 * math.cos(rad_next)
        p2y = cy + 42 * math.sin(rad_next)
        mid_rad = math.radians(deg + 15)
        cmx = cx + 58 * math.cos(mid_rad)
        cmy = cy + 58 * math.sin(mid_rad)
        if i == 0:
            d_r4_parts.append(f"M {p1x:.2f},{p1y:.2f}")
        d_r4_parts.append(f"Q {cmx:.2f},{cmy:.2f} {p2x:.2f},{p2y:.2f}")
    d_r4_parts.append("Z")
    lines.append(f'    <path id="rangoli-r4" class="r4" d="{" ".join(d_r4_parts)}" stroke="{GOLD_LIGHT}" stroke-width="1.6"/>')

    # r5: Concentric Ring at r=68
    d_r5 = f"M {cx-68},{cy} A 68,68 0 1,0 {cx+68},{cy} A 68,68 0 1,0 {cx-68},{cy} Z"
    lines.append(f'    <path id="rangoli-r5" class="r5" d="{d_r5}" stroke="{COPPER}" stroke-width="2.0"/>')

    # r6: 12 Pointed Lotus Petals (r=68 to r=98)
    d_r6_parts = []
    for i in range(12):
        deg = i * 30
        rad = math.radians(deg)
        rad_next = math.radians((i + 1) * 30)
        p1x = cx + 69 * math.cos(rad)
        p1y = cy + 69 * math.sin(rad)
        p2x = cx + 69 * math.cos(rad_next)
        p2y = cy + 69 * math.sin(rad_next)
        
        apex_rad = math.radians(deg + 15)
        ax = cx + 98 * math.cos(apex_rad)
        ay = cy + 98 * math.sin(apex_rad)
        
        c1x = cx + 88 * math.cos(apex_rad - 0.12)
        c1y = cy + 88 * math.sin(apex_rad - 0.12)
        c2x = cx + 88 * math.cos(apex_rad + 0.12)
        c2y = cy + 88 * math.sin(apex_rad + 0.12)
        
        if i == 0:
            d_r6_parts.append(f"M {p1x:.2f},{p1y:.2f}")
        d_r6_parts.append(f"Q {c1x:.2f},{c1y:.2f} {ax:.2f},{ay:.2f} Q {c2x:.2f},{c2y:.2f} {p2x:.2f},{p2y:.2f}")
    d_r6_parts.append("Z")
    lines.append(f'    <path id="rangoli-r6" class="r6" d="{" ".join(d_r6_parts)}" stroke="{IVORY}" stroke-width="1.8"/>')

    # r7: Concentric Ring at r=108
    d_r7 = f"M {cx-108},{cy} A 108,108 0 1,0 {cx+108},{cy} A 108,108 0 1,0 {cx-108},{cy} Z"
    lines.append(f'    <path id="rangoli-r7" class="r7" d="{d_r7}" stroke="{PEACH}" stroke-width="2.0"/>')

    # r8: Outer Halo of 24 Flourish Petal Cusps (r=108 to r=142)
    d_r8_parts = []
    for i in range(24):
        deg = i * 15
        rad = math.radians(deg)
        rad_next = math.radians((i + 1) * 15)
        p1x = cx + 110 * math.cos(rad)
        p1y = cy + 110 * math.sin(rad)
        p2x = cx + 110 * math.cos(rad_next)
        p2y = cy + 110 * math.sin(rad_next)
        
        apex_rad = math.radians(deg + 7.5)
        ax = cx + 140 * math.cos(apex_rad)
        ay = cy + 140 * math.sin(apex_rad)
        
        c1x = cx + 132 * math.cos(apex_rad - 0.08)
        c1y = cy + 132 * math.sin(apex_rad - 0.08)
        c2x = cx + 132 * math.cos(apex_rad + 0.08)
        c2y = cy + 132 * math.sin(apex_rad + 0.08)
        
        if i == 0:
            d_r8_parts.append(f"M {p1x:.2f},{p1y:.2f}")
        d_r8_parts.append(f"Q {c1x:.2f},{c1y:.2f} {ax:.2f},{ay:.2f} Q {c2x:.2f},{c2y:.2f} {p2x:.2f},{p2y:.2f}")
    d_r8_parts.append("Z")
    lines.append(f'    <path id="rangoli-r8" class="r8" d="{" ".join(d_r8_parts)}" stroke="{COPPER}" stroke-width="1.8"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_palm_leaf():
    """
    B4: palm-leaf.svg (340x560).
    Peach/ivory body with copper edge lines, two string holes and gold cord at top.
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 560">')
    lines.append('  <g id="palm-leaf-root">')

    # Palm Leaf Parchment Body
    lines.append(f'    <rect id="palm-leaf-body" x="8" y="10" width="324" height="540" rx="8" fill="{PEACH_LIGHT}" stroke="{COPPER}" stroke-width="2"/>')
    # Inner border
    lines.append(f'    <rect id="palm-leaf-inner-border" x="18" y="20" width="304" height="520" rx="4" fill="none" stroke="{COPPER}" stroke-width="1.2" stroke-dasharray="4,3"/>')

    # Odia Manuscript Carved Side Margins (foliate borders)
    for y in range(45, 520, 24):
        # Left border flourishes
        lines.append(f'    <path d="M 20,{y} Q 28,{y+6} 20,{y+12} Q 28,{y+18} 20,{y+24}" fill="none" stroke="{COPPER}" stroke-width="0.8"/>')
        # Right border flourishes
        lines.append(f'    <path d="M 320,{y} Q 312,{y+6} 320,{y+12} Q 312,{y+18} 320,{y+24}" fill="none" stroke="{COPPER}" stroke-width="0.8"/>')

    # String Holes (two circular holes through the leaf)
    # Hole 1: x=65, y=36. Hole 2: x=275, y=36.
    h1x, h2x, hy = 65, 275, 36
    for hx in [h1x, h2x]:
        lines.append(f'    <circle cx="{hx}" cy="{hy}" r="9" fill="{NAVY_DEEP}" stroke="{COPPER}" stroke-width="1.5"/>')
        lines.append(f'    <circle cx="{hx}" cy="{hy}" r="12" fill="none" stroke="{COPPER}" stroke-width="1" stroke-dasharray="2,2"/>')

    # Gold Binding Cord (threaded through the two holes and tied at top)
    d_cord = f"M {h1x},60 L {h1x},{hy} C {h1x},14 170,16 170,10 C 170,16 {h2x},14 {h2x},{hy} L {h2x},60"
    lines.append(f'    <path id="palm-leaf-cord" d="{d_cord}" fill="none" stroke="{GOLD}" stroke-width="2.5" stroke-linecap="round"/>')
    # Cord knot and tassels at center top (170, 10)
    lines.append(f'    <circle id="palm-leaf-cord-knot" cx="170" cy="10" r="3.5" fill="{GOLD_LIGHT}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <path id="palm-leaf-tassel-1" d="M 170,12 Q 165,22 163,28" stroke="{GOLD}" stroke-width="1.5" fill="none"/>')
    lines.append(f'    <path id="palm-leaf-tassel-2" d="M 170,12 Q 175,22 177,28" stroke="{GOLD}" stroke-width="1.5" fill="none"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_stylus():
    """
    B5: stylus.svg (24x60).
    Small copper iron stylus (lohakanthaka) with carved handle and sharp nib.
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 60">')
    lines.append('  <g id="stylus-root">')

    # Top Finial (lotus bud knob, y=2 to 14)
    lines.append(f'    <circle id="stylus-knob-top" cx="12" cy="4" r="3" fill="{GOLD}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <path id="stylus-finial" d="M 8,14 C 6,9 18,9 16,14 Z" fill="{COPPER}" stroke="{COPPER_TEXT}" stroke-width="0.8"/>')

    # Turned Shaft with Grip Bands (y=14 to 45)
    lines.append(f'    <rect id="stylus-shaft" x="9.5" y="14" width="5" height="31" fill="{COPPER}" stroke="{COPPER_TEXT}" stroke-width="0.8"/>')
    # Decorative gold rings on shaft
    for y in [18, 24, 32, 40]:
        lines.append(f'    <line x1="8.5" y1="{y}" x2="15.5" y2="{y}" stroke="{GOLD}" stroke-width="1.5"/>')

    # Tapered Nib (y=45 to 58)
    d_nib = "M 9.5,45 L 11.5,58 L 12.5,58 L 14.5,45 Z"
    lines.append(f'    <path id="stylus-nib" d="{d_nib}" fill="{GOLD_DARK}" stroke="{COPPER_TEXT}" stroke-width="0.8" stroke-linejoin="round"/>')
    # Sharp nib tip point
    lines.append(f'    <line id="stylus-tip-line" x1="12" y1="48" x2="12" y2="58" stroke="{IVORY}" stroke-width="0.6"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_leaf_roll():
    """
    B6: leaf-roll.svg (340x24).
    Rolled-edge strip for palm leaf unroll animation.
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 24">')
    lines.append('  <defs>')
    lines.append('    <linearGradient id="leaf-roll-grad" x1="0%" y1="0%" x2="0%" y2="100%">')
    lines.append(f'      <stop offset="0%" stop-color="{COPPER}"/>')
    lines.append(f'      <stop offset="25%" stop-color="{PEACH}"/>')
    lines.append(f'      <stop offset="55%" stop-color="{PEACH_LIGHT}"/>')
    lines.append(f'      <stop offset="85%" stop-color="{COPPER_TEXT}"/>')
    lines.append(f'      <stop offset="100%" stop-color="{NAVY_DEEP}"/>')
    lines.append('    </linearGradient>')
    lines.append('  </defs>')
    lines.append('  <g id="leaf-roll-root">')

    # Main 3D cylinder roll
    lines.append(f'    <rect id="leaf-roll-cylinder" x="4" y="3" width="332" height="16" rx="4" fill="url(#leaf-roll-grad)" stroke="{COPPER}" stroke-width="1.2"/>')
    # Highlight gleam
    lines.append(f'    <line id="leaf-roll-shine" x1="12" y1="9" x2="328" y2="9" stroke="{IVORY}" stroke-width="1" opacity="0.65"/>')

    # Left & Right curled roll ends (scroll spiral profiles)
    lines.append(f'    <ellipse id="leaf-roll-cap-l" cx="10" cy="11" rx="5" ry="7" fill="{COPPER}" stroke="{COPPER_TEXT}" stroke-width="1"/>')
    lines.append(f'    <circle id="leaf-roll-core-l" cx="10" cy="11" r="2.5" fill="{NAVY_DEEP}"/>')

    lines.append(f'    <ellipse id="leaf-roll-cap-r" cx="330" cy="11" rx="5" ry="7" fill="{COPPER}" stroke="{COPPER_TEXT}" stroke-width="1"/>')
    lines.append(f'    <circle id="leaf-roll-core-r" cx="330" cy="11" r="2.5" fill="{NAVY_DEEP}"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_vine():
    """
    B7: vine.svg (390x700).
    Tree of life vine linking three generations:
    - stem path id="vine-stem" running bottom to top (one continuous path)
    - branches id="vine-b1", "vine-b2", "vine-b3"
    - leaves class="vine-leaf" (many)
    - flower nodes id="vine-bloom-gp" (low, y~520), "vine-bloom-parents" (mid, y~320), "vine-bloom-top" (high, y~120, lotus)
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 700">')
    lines.append('  <g id="vine-root">')

    # 1. STEM PATH: One continuous undulating path from bottom (195, 690) to top (195, 120)
    # Undulates gently: passes near GP branch at y=520, Parents branch at y=320, up to Top at y=120
    d_stem = "M 195,690 C 185,640 160,580 175,520 C 190,460 225,400 205,320 C 185,240 180,180 195,120"
    lines.append(f'    <path id="vine-stem" class="stem" d="{d_stem}" fill="none" stroke="{GREEN}" stroke-width="3.5" stroke-linecap="round"/>')

    # 2. BRANCHES: vine-b1 (GP, y~520), vine-b2 (Parents, y~320), vine-b3 (Top crown, y~140)
    # Branch 1 (Grandparents, branching left and right around y=520)
    d_b1 = "M 175,530 C 150,540 110,535 90,520 M 175,530 C 195,540 235,535 255,520"
    lines.append(f'    <path id="vine-b1" class="b1" d="{d_b1}" fill="none" stroke="{GREEN}" stroke-width="2.5" stroke-linecap="round"/>')

    # Branch 2 (Parents, branching left and right around y=320)
    d_b2 = "M 205,335 C 175,340 130,330 105,315 M 205,335 C 235,340 275,330 295,315"
    lines.append(f'    <path id="vine-b2" class="b2" d="{d_b2}" fill="none" stroke="{GREEN}" stroke-width="2.5" stroke-linecap="round"/>')

    # Branch 3 (Top crown support, branching around y=145)
    d_b3 = "M 193,150 C 170,150 145,135 135,115 M 197,150 C 220,150 245,135 255,115"
    lines.append(f'    <path id="vine-b3" class="b3" d="{d_b3}" fill="none" stroke="{GREEN}" stroke-width="2.2" stroke-linecap="round"/>')

    # 3. LEAVES: many with class="vine-leaf"
    # Helper to create curved leaf
    def make_leaf(lx, ly, rot, scale=1.0):
        return f'<g transform="translate({lx},{ly}) rotate({rot}) scale({scale})">' + \
               f'<path class="vine-leaf leaf" d="M 0,0 C -5,-10 0,-20 10,-22 C 10,-12 5,-2 0,0 Z" fill="{GREEN}" stroke="{COPPER}" stroke-width="0.8"/>' + \
               f'<line x1="0" y1="0" x2="8" y2="-18" stroke="{TEAL}" stroke-width="0.7"/>' + \
               '</g>'

    leaf_coords = [
        # Lower section (y=560-680)
        (190, 660, -45, 1.1), (200, 630, 40, 1.0),
        (175, 595, -50, 1.1), (185, 565, 35, 1.0),
        # GP branch leaves (y=500-540)
        (120, 528, -80, 0.9), (145, 538, -30, 0.9),
        (225, 538, 30, 0.9), (245, 526, 75, 0.9),
        # Mid section (y=370-490)
        (182, 480, -35, 1.0), (198, 440, 45, 1.1),
        (215, 400, 50, 1.0), (195, 365, -40, 1.0),
        # Parents branch leaves (y=300-340)
        (140, 328, -75, 0.9), (165, 338, -25, 0.9),
        (240, 338, 25, 0.9), (270, 325, 80, 0.9),
        # Upper section (y=160-290)
        (192, 280, -45, 1.0), (188, 235, 35, 1.0),
        (186, 195, -30, 0.9), (198, 165, 40, 0.9),
        # Top branch leaves
        (150, 130, -60, 0.8), (240, 130, 60, 0.8),
    ]

    for lx, ly, rot, sc in leaf_coords:
        lines.append(f'    {make_leaf(lx, ly, rot, sc)}')

    # 4. FLOWER NODES:
    # A. Low node: vine-bloom-gp (y~520, center 175, 520)
    lines.append('  <g id="bloom-gp">')
    lines.append('  <g id="vine-bloom-gp" class="bloom-gp">')
    lines.append(f'    <circle cx="175" cy="520" r="14" fill="{GOLD}" stroke="{COPPER}" stroke-width="1.5"/>')
    for i in range(6):
        rad = math.radians(i * 60)
        px = 175 + 18 * math.cos(rad)
        py = 520 + 18 * math.sin(rad)
        lines.append(f'    <circle cx="{px:.1f}" cy="{py:.1f}" r="5" fill="{PEACH}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <circle cx="175" cy="520" r="6" fill="{IVORY}"/>')
    lines.append('  </g>')
    lines.append('  </g>')

    # B. Mid node: vine-bloom-parents (y~320, center 205, 320)
    lines.append('  <g id="bloom-parents">')
    lines.append('  <g id="vine-bloom-parents" class="bloom-parents">')
    lines.append(f'    <circle cx="205" cy="320" r="16" fill="{PEACH}" stroke="{COPPER}" stroke-width="1.5"/>')
    for i in range(8):
        rad = math.radians(i * 45)
        px = 205 + 21 * math.cos(rad)
        py = 320 + 21 * math.sin(rad)
        lines.append(f'    <circle cx="{px:.1f}" cy="{py:.1f}" r="6" fill="{PEACH_LIGHT}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <circle cx="205" cy="320" r="8" fill="{GOLD}" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <circle cx="205" cy="320" r="3" fill="{IVORY}"/>')
    lines.append('  </g>')
    lines.append('  </g>')

    # C. High node: vine-bloom-top (y~120, crowning royal lotus, center 195, 120)
    lines.append('  <g id="bloom-top">')
    lines.append('  <g id="vine-bloom-top" class="bloom-top">')
    # Mini lotus bloom crowning the tree
    lines.append(f'    <path d="M 195,125 C 182,125 168,118 156,104 C 166,100 182,106 195,116 Z" fill="{PEACH}" stroke="{COPPER}" stroke-width="1.2"/>')
    lines.append(f'    <path d="M 195,125 C 208,125 222,118 234,104 C 224,100 208,106 195,116 Z" fill="{PEACH}" stroke="{COPPER}" stroke-width="1.2"/>')
    lines.append(f'    <path d="M 195,125 C 184,115 174,96 172,78 C 184,82 192,96 195,112 Z" fill="{PEACH_LIGHT}" stroke="{COPPER}" stroke-width="1.2"/>')
    lines.append(f'    <path d="M 195,125 C 206,115 216,96 218,78 C 206,82 198,96 195,112 Z" fill="{PEACH_LIGHT}" stroke="{COPPER}" stroke-width="1.2"/>')
    # Center hero petal
    lines.append(f'    <path d="M 195,125 C 186,108 185,88 195,68 C 205,88 204,108 195,125 Z" fill="{PEACH_LIGHT}" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <circle cx="195" cy="76" r="2.5" fill="{GOLD}"/>')
    lines.append('  </g>')
    lines.append('  </g>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_path_alpana():
    """
    B8: path-alpana.svg (390x640).
    Vertical S-curve path with id="route-line" (top to bottom),
    dotted copper stroke with stroke-dasharray (so getPointAtLength works).
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 640">')
    lines.append('  <g id="path-alpana-root">')

    # Dotted S-curve from top (195, 30) down to house entrance (195, 580)
    # Curves right towards 310 at y=170, across center to 90 at y=370, then returns to 195 at y=580
    d_route = "M 195,30 C 330,120 330,240 195,310 C 60,380 60,500 195,580"

    # Wrap in route group so document.getElementById('route') and getElementById('route-line') both work
    lines.append('  <g id="route">')
    lines.append(f'    <path id="route-line" class="route" d="{d_route}" fill="none" stroke="{COPPER}" stroke-width="3" stroke-dasharray="4,8" stroke-linecap="round"/>')
    lines.append('  </g>')

    # Decorative traditional Alpana / Kolam motifs along the path margins
    alpana_points = [
        (195, 30), (250, 100), (300, 180), (270, 260),
        (195, 310), (120, 360), (90, 440), (130, 520), (195, 580)
    ]
    for px, py in alpana_points:
        lines.append(f'    <circle cx="{px}" cy="{py}" r="3" fill="{GOLD}" stroke="{COPPER}" stroke-width="0.8"/>')
        lines.append(f'    <circle cx="{px-5}" cy="{py}" r="1.2" fill="{PEACH}"/>')
        lines.append(f'    <circle cx="{px+5}" cy="{py}" r="1.2" fill="{PEACH}"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_house():
    """
    B9: house.svg (200x180).
    Simple village house, windows id="house-win1", "house-win2", door id="house-door",
    dark navy-mid fill by default (they light up with code).
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180">')
    lines.append('  <g id="house-root">')

    # Base house wall (y=75 to 175)
    lines.append(f'    <rect id="house-walls" x="22" y="75" width="156" height="100" rx="3" fill="{NAVY_DEEP}" stroke="{COPPER}" stroke-width="1.8"/>')
    # Wall baseline plinth
    lines.append(f'    <rect id="house-plinth" x="18" y="170" width="164" height="6" fill="{NAVY_MID}" stroke="{COPPER}" stroke-width="1"/>')

    # Sloped Thatched / Tiled Traditional Roof (Chala) with overhang
    d_roof = "M 10,75 L 100,16 L 190,75 C 190,75 160,78 100,78 C 40,78 10,75 10,75 Z"
    lines.append(f'    <path id="house-roof" d="{d_roof}" fill="{NAVY_MID}" stroke="{COPPER}" stroke-width="2" stroke-linejoin="round"/>')
    # Roof ridge lines / rafters
    lines.append(f'    <line x1="100" y1="16" x2="100" y2="78" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <line x1="100" y1="16" x2="55" y2="76" stroke="{COPPER}" stroke-width="1.2"/>')
    lines.append(f'    <line x1="100" y1="16" x2="145" y2="76" stroke="{COPPER}" stroke-width="1.2"/>')
    # Roof apex finial (kalasa)
    lines.append(f'    <circle id="house-roof-finial" cx="100" cy="14" r="3.5" fill="{GOLD}" stroke="{COPPER}" stroke-width="1"/>')

    # Windows: win1 (left) and win2 (right)
    # Default fill: NAVY_MID (dark by default, animated to flame with code)
    # Left Window
    lines.append('  <g id="win1">')
    lines.append(f'    <rect id="house-win1" class="win1" x="38" y="94" width="28" height="32" rx="3" fill="{NAVY_MID}" stroke="{COPPER}" stroke-width="1.4"/>')
    lines.append(f'    <line x1="52" y1="94" x2="52" y2="126" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <line x1="38" y1="110" x2="66" y2="110" stroke="{COPPER}" stroke-width="1"/>')
    lines.append('  </g>')

    # Right Window
    lines.append('  <g id="win2">')
    lines.append(f'    <rect id="house-win2" class="win2" x="134" y="94" width="28" height="32" rx="3" fill="{NAVY_MID}" stroke="{COPPER}" stroke-width="1.4"/>')
    lines.append(f'    <line x1="148" y1="94" x2="148" y2="126" stroke="{COPPER}" stroke-width="1"/>')
    lines.append(f'    <line x1="134" y1="110" x2="162" y2="110" stroke="{COPPER}" stroke-width="1"/>')
    lines.append('  </g>')

    # Door (center, arched)
    lines.append('  <g id="door">')
    d_door = "M 84,170 L 84,106 C 84,94 116,94 116,106 L 116,170 Z"
    lines.append(f'    <path id="house-door" class="door" d="{d_door}" fill="{NAVY_MID}" stroke="{COPPER}" stroke-width="1.6"/>')
    lines.append(f'    <circle id="house-door-knob" cx="110" cy="138" r="2" fill="{GOLD}"/>')
    lines.append('  </g>')

    # Eaves decorative scallops
    lines.append(f'    <path d="M 16,77 Q 30,83 45,77 Q 60,83 75,77 Q 90,83 100,77 Q 110,83 125,77 Q 140,83 155,77 Q 170,83 184,77" fill="none" stroke="{COPPER}" stroke-width="1"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_aarti_lamp():
    """
    B10: aarti-lamp.svg (44x44).
    Aarti thali / lamp icon with glowing flame.
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44">')
    lines.append('  <defs>')
    lines.append('    <radialGradient id="aarti-lamp-glow" cx="50%" cy="50%" r="50%">')
    lines.append(f'      <stop offset="0%" stop-color="{FLAME}" stop-opacity="0.8"/>')
    lines.append(f'      <stop offset="60%" stop-color="{FLAME_DEEP}" stop-opacity="0.3"/>')
    lines.append(f'      <stop offset="100%" stop-color="{FLAME_DEEP}" stop-opacity="0"/>')
    lines.append('    </radialGradient>')
    lines.append('  </defs>')
    lines.append('  <g id="aarti-lamp-root">')

    # Radial Glow
    lines.append('    <circle id="aarti-lamp-glow-aura" cx="22" cy="18" r="14" fill="url(#aarti-lamp-glow)"/>')

    # Flame (teardrop rising from y=24 to y=6)
    d_flame = "M 22,24 C 18,22 15,18 16,13 C 17,9 20,6 22,4 C 24,6 27,9 28,13 C 29,18 26,22 22,24 Z"
    lines.append(f'    <path id="aarti-lamp-flame-outer" d="{d_flame}" fill="{FLAME}"/>')
    lines.append(f'    <path id="aarti-lamp-flame-core" d="M 22,23 C 20,21 18,18 19,15 C 20,12 21,9 22,7 C 23,9 24,12 25,15 C 26,18 24,21 22,23 Z" fill="{IVORY}"/>')

    # Brass Diya Cup
    d_cup = "M 14,25 C 14,31 30,31 30,25 Z"
    lines.append(f'    <path id="aarti-lamp-cup" d="{d_cup}" fill="{GOLD}" stroke="{COPPER}" stroke-width="1"/>')

    # Thali (Plate)
    lines.append(f'    <ellipse id="aarti-lamp-plate" cx="22" cy="33" rx="16" ry="5" fill="{GOLD_LIGHT}" stroke="{COPPER}" stroke-width="1.2"/>')
    lines.append(f'    <ellipse id="aarti-lamp-plate-inner" cx="22" cy="33" rx="12" ry="3.5" fill="{GOLD}" stroke="{COPPER}" stroke-width="0.8"/>')
    # Tiny flowers on thali
    lines.append(f'    <circle cx="12" cy="33" r="1.5" fill="{ROSE}"/>')
    lines.append(f'    <circle cx="32" cy="33" r="1.5" fill="{ROSE}"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_scratch_foil():
    """
    B11: scratch-foil.svg (330x210).
    Gold foil with tone-on-tone mandala pattern (no text).
    """
    cx, cy = 165, 105
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 210">')
    lines.append('  <defs>')
    lines.append('    <linearGradient id="scratch-foil-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">')
    lines.append(f'      <stop offset="0%" stop-color="{GOLD_LIGHT}"/>')
    lines.append(f'      <stop offset="35%" stop-color="{GOLD}"/>')
    lines.append(f'      <stop offset="70%" stop-color="{GOLD_DARK}"/>')
    lines.append(f'      <stop offset="100%" stop-color="{GOLD}"/>')
    lines.append('    </linearGradient>')
    lines.append('  </defs>')
    lines.append('  <g id="scratch-foil-root">')

    # Metallic gold background
    lines.append(f'    <rect id="scratch-foil-bg" width="330" height="210" rx="8" fill="url(#scratch-foil-gold-grad)"/>')

    # Border Keyline
    lines.append(f'    <rect id="scratch-foil-border-outer" x="6" y="6" width="318" height="198" rx="6" fill="none" stroke="{COPPER}" stroke-width="1.5"/>')
    lines.append(f'    <rect id="scratch-foil-border-inner" x="12" y="12" width="306" height="186" rx="4" fill="none" stroke="{GOLD_DARK}" stroke-width="1" stroke-dasharray="3,3"/>')

    # Tone-on-tone Mandala Pattern in center (tone-on-tone: gold-dark stroke with low opacity)
    lines.append(f'    <circle cx="{cx}" cy="{cy}" r="75" fill="none" stroke="{GOLD_DARK}" stroke-width="1.2" opacity="0.4"/>')
    lines.append(f'    <circle cx="{cx}" cy="{cy}" r="65" fill="none" stroke="{GOLD_LIGHT}" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>')

    # 12 Petals tone-on-tone
    for i in range(12):
        rad = math.radians(i * 30)
        ax = cx + 62 * math.cos(rad)
        ay = cy + 62 * math.sin(rad)
        c1x = cx + 54 * math.cos(rad - 0.15)
        c1y = cy + 54 * math.sin(rad - 0.15)
        c2x = cx + 54 * math.cos(rad + 0.15)
        c2y = cy + 54 * math.sin(rad + 0.15)
        lines.append(f'    <path d="M {cx},{cy} Q {c1x:.1f},{c1y:.1f} {ax:.1f},{ay:.1f} Q {c2x:.1f},{c2y:.1f} {cx},{cy} Z" fill="{GOLD_LIGHT}" fill-opacity="0.2" stroke="{GOLD_DARK}" stroke-width="0.8" opacity="0.5"/>')

    lines.append(f'    <circle cx="{cx}" cy="{cy}" r="38" fill="none" stroke="{GOLD_DARK}" stroke-width="1.2" opacity="0.5"/>')
    lines.append(f'    <circle cx="{cx}" cy="{cy}" r="22" fill="none" stroke="{GOLD_LIGHT}" stroke-width="1" opacity="0.6"/>')
    lines.append(f'    <circle cx="{cx}" cy="{cy}" r="8" fill="{GOLD_DARK}" opacity="0.4"/>')

    # Corner tone-on-tone quarter mandalas
    for cor_x, cor_y in [(12, 12), (318, 12), (12, 198), (318, 198)]:
        lines.append(f'    <circle cx="{cor_x}" cy="{cor_y}" r="35" fill="none" stroke="{GOLD_DARK}" stroke-width="1" opacity="0.35"/>')
        lines.append(f'    <circle cx="{cor_x}" cy="{cor_y}" r="20" fill="none" stroke="{GOLD_LIGHT}" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.4"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_lamp():
    """
    B12: lamp.svg (28x28).
    Small flame-lamp marker positioned along path-alpana.
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">')
    lines.append('  <defs>')
    lines.append('    <radialGradient id="lamp-glow" cx="50%" cy="50%" r="50%">')
    lines.append(f'      <stop offset="0%" stop-color="{FLAME}" stop-opacity="0.85"/>')
    lines.append(f'      <stop offset="60%" stop-color="{FLAME_DEEP}" stop-opacity="0.3"/>')
    lines.append(f'      <stop offset="100%" stop-color="{FLAME_DEEP}" stop-opacity="0"/>')
    lines.append('    </radialGradient>')
    lines.append('  </defs>')
    lines.append('  <g id="lamp-root">')

    # Glowing Aura
    lines.append('    <circle id="lamp-glow-aura" cx="14" cy="11" r="10" fill="url(#lamp-glow)"/>')

    # Flame Teardrop (y=3 to 17)
    d_flame = "M 14,17 C 11,15 9,12 10,8.5 C 11,5.5 13,3 14,2 C 15,3 17,5.5 18,8.5 C 19,12 17,15 14,17 Z"
    lines.append(f'    <path id="lamp-flame" d="{d_flame}" fill="{FLAME}"/>')
    lines.append(f'    <path id="lamp-flame-core" d="M 14,16 C 12.5,14 11.5,12 12,9.5 C 12.5,7.5 13.5,5 14,4 C 14.5,5 15.5,7.5 16,9.5 C 16.5,12 15.5,14 14,16 Z" fill="{IVORY}"/>')

    # Diya Base Cup (y=17 to 24)
    d_base = "M 6,18 C 6,24 22,24 22,18 Z"
    lines.append(f'    <path id="lamp-base" d="{d_base}" fill="{GOLD}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <line id="lamp-pedestal" x1="10" y1="24" x2="18" y2="24" stroke="{COPPER}" stroke-width="1.2"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def gen_placeholder_portrait():
    """
    B13: assets/img/placeholder-portrait.svg (300x300).
    Neutral peach/copper portrait silhouette of young Indian woman.
    """
    lines = []
    lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">')
    lines.append('  <defs>')
    lines.append('    <linearGradient id="placeholder-portrait-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">')
    lines.append(f'      <stop offset="0%" stop-color="{NAVY_DEEP}"/>')
    lines.append(f'      <stop offset="100%" stop-color="{NAVY_MID}"/>')
    lines.append('    </linearGradient>')
    lines.append('  </defs>')
    lines.append('  <g id="placeholder-portrait-root">')

    # Outer Circular Backdrop
    lines.append(f'    <circle id="placeholder-portrait-bg" cx="150" cy="150" r="146" fill="url(#placeholder-portrait-bg-grad)" stroke="{COPPER}" stroke-width="2"/>')
    lines.append(f'    <circle id="placeholder-portrait-dash" cx="150" cy="150" r="140" fill="none" stroke="{COPPER}" stroke-width="1.2" stroke-dasharray="4,4"/>')

    # Halo / Aura behind head
    lines.append(f'    <circle id="placeholder-portrait-aura" cx="150" cy="130" r="85" fill="{PEACH_LIGHT}" opacity="0.12"/>')

    # Portrait Silhouette: Regal young Indian woman profile facing left
    # Hair / Bun (Jooda) with jasmine garland (gajra)
    d_hair = "M 135,70 C 175,60 205,85 205,120 C 205,145 190,165 175,175 C 185,185 200,210 205,245 C 180,248 155,245 140,240 C 135,210 132,185 130,175 Z"
    lines.append(f'    <path id="placeholder-portrait-hair" d="{d_hair}" fill="{NAVY_LINE}" stroke="{COPPER}" stroke-width="1.2"/>')

    # Hair Bun (Jooda) at back
    lines.append(f'    <circle id="placeholder-portrait-bun" cx="195" cy="120" r="28" fill="{NAVY_LINE}" stroke="{COPPER}" stroke-width="1.2"/>')
    # Jasmine Gajra (white pearl garland around bun)
    for i in range(10):
        rad = math.radians(-110 + i * 22)
        gx = 195 + 31 * math.cos(rad)
        gy = 120 + 31 * math.sin(rad)
        lines.append(f'    <circle cx="{gx:.1f}" cy="{gy:.1f}" r="3.5" fill="{IVORY}" stroke="{COPPER}" stroke-width="0.8"/>')

    # Face Profile (forehead, nose, lips, chin, neck)
    d_face = "M 140,75 C 122,80 114,92 110,105 L 102,122 L 110,126 C 108,132 104,136 108,140 C 106,145 110,148 114,148 C 112,156 120,162 128,162 C 130,178 135,198 140,220 L 168,220 C 160,195 155,175 152,160 C 158,140 156,105 140,75 Z"
    lines.append(f'    <path id="placeholder-portrait-face" d="{d_face}" fill="{PEACH}" stroke="{COPPER}" stroke-width="1.2" stroke-linejoin="round"/>')

    # Traditional Maang Tikka on forehead
    lines.append(f'    <line x1="140" y1="75" x2="120" y2="92" stroke="{GOLD}" stroke-width="1.2"/>')
    lines.append(f'    <circle cx="120" cy="92" r="3" fill="{GOLD}" stroke="{COPPER}" stroke-width="0.8"/>')
    lines.append(f'    <circle cx="120" cy="92" r="1.2" fill="{ROSE}"/>')

    # Jhumka Earring at ear (152, 138)
    lines.append(f'    <circle cx="152" cy="138" r="2.5" fill="{GOLD}"/>')
    lines.append(f'    <path d="M 148,143 Q 152,141 156,143 L 157,148 L 147,148 Z" fill="{GOLD}" stroke="{COPPER}" stroke-width="0.6"/>')
    lines.append(f'    <circle cx="152" cy="151" r="1.5" fill="{PEACH_LIGHT}"/>')

    # Saree / Dupatta Drape across shoulder
    d_drape = "M 95,260 C 115,225 150,220 205,245 C 215,255 220,270 220,285 L 80,285 C 80,275 88,265 95,260 Z"
    lines.append(f'    <path id="placeholder-portrait-drape" d="{d_drape}" fill="{COPPER}" stroke="{COPPER_TEXT}" stroke-width="1.5"/>')
    lines.append(f'    <path d="M 95,260 Q 140,235 205,245" fill="none" stroke="{GOLD}" stroke-width="2"/>')
    lines.append(f'    <path d="M 105,272 Q 150,248 215,260" fill="none" stroke="{PEACH_LIGHT}" stroke-width="1" stroke-dasharray="3,3"/>')

    lines.append('  </g>')
    lines.append('</svg>')
    return '\n'.join(lines)


def main():
    svg_dir = "assets/svg"
    img_dir = "assets/img"
    os.makedirs(svg_dir, exist_ok=True)
    os.makedirs(img_dir, exist_ok=True)

    files = {
        os.path.join(svg_dir, "door-left.svg"): gen_door("left"),
        os.path.join(svg_dir, "door-right.svg"): gen_door("right"),
        os.path.join(svg_dir, "bell.svg"): gen_bell(),
        os.path.join(svg_dir, "rangoli.svg"): gen_rangoli(),
        os.path.join(svg_dir, "palm-leaf.svg"): gen_palm_leaf(),
        os.path.join(svg_dir, "stylus.svg"): gen_stylus(),
        os.path.join(svg_dir, "leaf-roll.svg"): gen_leaf_roll(),
        os.path.join(svg_dir, "vine.svg"): gen_vine(),
        os.path.join(svg_dir, "path-alpana.svg"): gen_path_alpana(),
        os.path.join(svg_dir, "house.svg"): gen_house(),
        os.path.join(svg_dir, "aarti-lamp.svg"): gen_aarti_lamp(),
        os.path.join(svg_dir, "scratch-foil.svg"): gen_scratch_foil(),
        os.path.join(svg_dir, "lamp.svg"): gen_lamp(),
        os.path.join(img_dir, "placeholder-portrait.svg"): gen_placeholder_portrait(),
    }

    print("Generating Set B SVGs...")
    for fpath, content in files.items():
        with open(fpath, "w") as f:
            f.write(content)
        size_kb = len(content.encode('utf-8')) / 1024
        print(f"  {os.path.basename(fpath):28} : {size_kb:6.2f} KB (limit: 40 KB)")

if __name__ == "__main__":
    main()
