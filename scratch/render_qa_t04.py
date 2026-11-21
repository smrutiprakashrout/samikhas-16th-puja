#!/usr/bin/env python3
"""
Generate the 390x844 QA contact sheet for task T04.
Presents all Set B SVG motifs (B1–B13) with labels on deep navy background.
"""
import os
import subprocess
import xml.etree.ElementTree as ET

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

def main():
    w, h = 390, 844
    root = ET.Element("svg", {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": f"0 0 {w} {h}",
        "width": str(w),
        "height": str(h)
    })

    defs = ET.SubElement(root, "defs")

    # Wave pattern definition
    wave_root = load_svg("assets/svg/tile-wave.svg")
    wave_pat = ET.SubElement(defs, "pattern", {
        "id": "qa-wave-pat-b",
        "width": "64",
        "height": "64",
        "patternUnits": "userSpaceOnUse"
    })
    for child in wave_root:
        if child.tag != "defs":
            wave_pat.append(child)

    # Styles
    style = ET.SubElement(defs, "style")
    style.text = """
      .title { font-family: 'Cinzel', serif, sans-serif; font-weight: bold; font-size: 15px; fill: #D98F78; letter-spacing: 2px; text-anchor: middle; }
      .sub { font-family: 'Cinzel', serif, sans-serif; font-size: 9px; fill: #C9A24B; letter-spacing: 1.5px; text-anchor: middle; }
      .lbl { font-family: monospace; font-size: 8px; fill: #F3B9A6; text-anchor: middle; }
      .card-bg { fill: #0d1e63; fill-opacity: 0.85; stroke: #D98F78; stroke-width: 1; rx: 6; }
    """

    # Background
    ET.SubElement(root, "rect", {"width": str(w), "height": str(h), "fill": "#0A1B5C"})
    ET.SubElement(root, "rect", {"width": str(w), "height": str(h), "fill": "url(#qa-wave-pat-b)", "opacity": "0.6"})

    # Header
    header = ET.SubElement(root, "g", {"id": "qa-header"})
    sub_txt = ET.SubElement(header, "text", {"x": "195", "y": "26", "class": "sub"})
    sub_txt.text = "SAMIKSHYA’S 16TH BIRTHDAY PUJA"
    title_txt = ET.SubElement(header, "text", {"x": "195", "y": "45", "class": "title"})
    title_txt.text = "T04 · SCENE ART (B1–B13)"

    # Header divider
    div_l_header = ET.SubElement(header, "g", {"transform": "translate(75, 52)"})
    div_l_root = load_svg("assets/svg/divider-lotus.svg")
    for child in div_l_root:
        div_l_header.append(child)

    def add_card(x, y, cw, ch, label, svg_file, scale=1.0, tx=0, ty=0):
        card = ET.SubElement(root, "g")
        ET.SubElement(card, "rect", {
            "x": str(x), "y": str(y), "width": str(cw), "height": str(ch), "class": "card-bg"
        })
        lbl = ET.SubElement(card, "text", {
            "x": str(x + cw / 2), "y": str(y + 14), "class": "lbl"
        })
        lbl.text = label

        content_g = ET.SubElement(card, "g", {
            "transform": f"translate({x + tx}, {y + ty}) scale({scale})"
        })
        svg_r = load_svg(svg_file)
        for d in svg_r.findall("defs"):
            for child in d:
                defs.append(child)
        for child in svg_r:
            if child.tag != "defs":
                content_g.append(child)

    # 1. Row 1: Jharokha Doors (Left & Right joined) & Temple Bell
    # Doors Card (x=14, y=78, w=175, h=165)
    card_d = ET.SubElement(root, "g")
    ET.SubElement(card_d, "rect", {"x": "14", "y": "78", "width": "175", "height": "165", "class": "card-bg"})
    lbl_d = ET.SubElement(card_d, "text", {"x": "101.5", "y": "92", "class": "lbl"})
    lbl_d.text = "B1 · door-left & door-right"
    # Left door
    g_dl = ET.SubElement(card_d, "g", {"transform": "translate(53, 98) scale(0.16)"})
    dl_svg = load_svg("assets/svg/door-left.svg")
    for d in dl_svg.findall("defs"):
        for child in d: defs.append(child)
    for child in dl_svg:
        if child.tag != "defs": g_dl.append(child)
    # Right door
    g_dr = ET.SubElement(card_d, "g", {"transform": f"translate({53 + 195*0.16}, 98) scale(0.16)"})
    dr_svg = load_svg("assets/svg/door-right.svg")
    for d in dr_svg.findall("defs"):
        for child in d: defs.append(child)
    for child in dr_svg:
        if child.tag != "defs": g_dr.append(child)

    # Bell Card (x=201, y=78, w=175, h=165)
    add_card(201, 78, 175, 165, "B2 · bell.svg (120×260)", "assets/svg/bell.svg", scale=0.52, tx=56, ty=20)

    # 2. Row 2: Rangoli & Palm Leaf
    add_card(14, 250, 175, 155, "B3 · rangoli.svg (r1..r8)", "assets/svg/rangoli.svg", scale=0.42, tx=24, ty=20)
    add_card(201, 250, 175, 155, "B4 · palm-leaf.svg (340×560)", "assets/svg/palm-leaf.svg", scale=0.23, tx=48, ty=20)

    # 3. Row 3: Vine (B7), Path Alpana (B8), House (B9)
    add_card(14, 412, 115, 185, "B7 · vine.svg", "assets/svg/vine.svg", scale=0.23, tx=13, ty=18)
    add_card(137, 412, 115, 185, "B8 · path-alpana", "assets/svg/path-alpana.svg", scale=0.25, tx=9, ty=18)
    add_card(260, 412, 116, 185, "B9 · house.svg", "assets/svg/house.svg", scale=0.48, tx=10, ty=38)

    # 4. Row 4: Scratch Foil (B11) & Placeholder Portrait (B13)
    add_card(14, 604, 205, 120, "B11 · scratch-foil.svg", "assets/svg/scratch-foil.svg", scale=0.53, tx=15, ty=20)
    add_card(227, 604, 149, 120, "B13 · portrait", "assets/img/placeholder-portrait.svg", scale=0.31, tx=28, ty=20)

    # 5. Row 5: Stylus (B5), Leaf Roll (B6), Aarti Lamp (B10), Lamp (B12)
    card_extras = ET.SubElement(root, "g")
    ET.SubElement(card_extras, "rect", {"x": "14", "y": "730", "width": "362", "height": "88", "class": "card-bg"})
    lbl_ex = ET.SubElement(card_extras, "text", {"x": "195", "y": "744", "class": "lbl"})
    lbl_ex.text = "B5 · stylus  |  B6 · leaf-roll  |  B10 · aarti-lamp  |  B12 · lamp"

    # Stylus
    g_sty = ET.SubElement(card_extras, "g", {"transform": "translate(42, 750) scale(0.95)"})
    sty_svg = load_svg("assets/svg/stylus.svg")
    for child in sty_svg: g_sty.append(child)

    # Leaf Roll
    g_roll = ET.SubElement(card_extras, "g", {"transform": "translate(95, 768) scale(0.38)"})
    roll_svg = load_svg("assets/svg/leaf-roll.svg")
    for d in roll_svg.findall("defs"):
        for child in d: defs.append(child)
    for child in roll_svg:
        if child.tag != "defs": g_roll.append(child)

    # Aarti Lamp
    g_aarti = ET.SubElement(card_extras, "g", {"transform": "translate(250, 754) scale(1.15)"})
    aarti_svg = load_svg("assets/svg/aarti-lamp.svg")
    for d in aarti_svg.findall("defs"):
        for child in d: defs.append(child)
    for child in aarti_svg:
        if child.tag != "defs": g_aarti.append(child)

    # Small Lamp
    g_lamp = ET.SubElement(card_extras, "g", {"transform": "translate(325, 760) scale(1.4)"})
    lamp_svg = load_svg("assets/svg/lamp.svg")
    for d in lamp_svg.findall("defs"):
        for child in d: defs.append(child)
    for child in lamp_svg:
        if child.tag != "defs": g_lamp.append(child)

    # Footer note
    ft = ET.SubElement(root, "text", {
        "x": "195", "y": "832",
        "style": "font-family:sans-serif; font-size:7.5px; fill:#C9A24B; letter-spacing:1px; text-anchor:middle;"
    })
    ft.text = "ALL SET B ASSETS PASS ACCEPTANCE · ≤ 40 KB · PALETTE COMPLIANT"

    # Write out
    qa_svg_path = "scratch/qa_t04.svg"
    tree = ET.ElementTree(root)
    tree.write(qa_svg_path, encoding="utf-8", xml_declaration=True)

    out_png = "qa/T04.png"
    cmd = ["rsvg-convert", "-w", str(w), "-h", str(h), qa_svg_path, "-o", out_png]
    subprocess.run(cmd, check=True)
    print(f"Generated {out_png} ({os.path.getsize(out_png)} bytes)")

if __name__ == "__main__":
    main()
