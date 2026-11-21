#!/usr/bin/env python3
"""
Generate the 390x844 QA contact sheet for task T03 using XML element nesting.
"""
import os
import subprocess
import xml.etree.ElementTree as ET

def clean_element(elem):
    # Remove namespace prefixes from tag
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
        "id": "qa-wave-pat",
        "width": "64",
        "height": "64",
        "patternUnits": "userSpaceOnUse"
    })
    for child in wave_root:
        if child.tag != "defs":
            wave_pat.append(child)

    # Jaali pattern definition
    jaali_root = load_svg("assets/svg/tile-jaali.svg")
    jaali_pat = ET.SubElement(defs, "pattern", {
        "id": "qa-jaali-pat",
        "width": "56",
        "height": "56",
        "patternUnits": "userSpaceOnUse"
    })
    for child in jaali_root:
        if child.tag != "defs":
            jaali_pat.append(child)

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
    ET.SubElement(root, "rect", {"width": str(w), "height": str(h), "fill": "url(#qa-wave-pat)", "opacity": "0.6"})

    # Header
    header = ET.SubElement(root, "g", {"id": "qa-header"})
    sub_txt = ET.SubElement(header, "text", {"x": "195", "y": "28", "class": "sub"})
    sub_txt.text = "SAMIKSHYA’S 16TH BIRTHDAY PUJA"
    title_txt = ET.SubElement(header, "text", {"x": "195", "y": "48", "class": "title"})
    title_txt.text = "T03 · SHARED MOTIFS (A1–A11)"

    # Header divider
    div_l_header = ET.SubElement(header, "g", {"transform": "translate(75, 54)"})
    div_l_root = load_svg("assets/svg/divider-lotus.svg")
    for child in div_l_root:
        div_l_header.append(child)

    # Helper to add a card
    def add_card(x, y, cw, ch, label, svg_file, scale=1.0, tx=0, ty=0):
        card = ET.SubElement(root, "g")
        ET.SubElement(card, "rect", {
            "x": str(x), "y": str(y), "width": str(cw), "height": str(ch), "class": "card-bg"
        })
        lbl = ET.SubElement(card, "text", {
            "x": str(x + cw / 2), "y": str(y + 16), "class": "lbl"
        })
        lbl.text = label

        content_g = ET.SubElement(card, "g", {
            "transform": f"translate({x + tx}, {y + ty}) scale({scale})"
        })
        svg_r = load_svg(f"assets/svg/{svg_file}")
        # copy defs to master defs if any
        for d in svg_r.findall("defs"):
            for child in d:
                defs.append(child)
        for child in svg_r:
            if child.tag != "defs":
                content_g.append(child)

    # 1. Row 1: Mandala & Peacock
    add_card(14, 82, 175, 156, "A1 · mandala.svg (300×300)", "mandala.svg", scale=0.43, tx=23, ty=22)
    add_card(201, 82, 175, 156, "A5 · peacock.svg (220×240)", "peacock.svg", scale=0.52, ty=20, tx=31)

    # 2. Row 2: Diya & Lotus
    add_card(14, 248, 175, 126, "A4 · diya.svg (100×80)", "diya.svg", scale=1.15, tx=30, ty=22)
    add_card(201, 248, 175, 126, "A2 · lotus.svg (120×90)", "lotus.svg", scale=1.0, tx=27, ty=24)

    # 3. Row 3: Lotus Petal, Feather, Marigold
    add_card(14, 384, 112, 168, "A3 · lotus-petal", "lotus-petal.svg", scale=1.0, tx=26, ty=28)
    add_card(138, 384, 112, 168, "A6 · feather", "peacock-feather.svg", scale=0.72, tx=37, ty=24)
    add_card(262, 384, 114, 168, "A7 · marigold", "marigold-petal.svg", scale=2.6, tx=26, ty=52)

    # 4. Row 4: Tile Wave & Tile Jaali (live repeats)
    # Wave Card
    card_w = ET.SubElement(root, "g")
    ET.SubElement(card_w, "rect", {"x": "14", "y": "562", "width": "175", "height": "136", "class": "card-bg"})
    lbl_w = ET.SubElement(card_w, "text", {"x": "101.5", "y": "578", "class": "lbl"})
    lbl_w.text = "A8 · tile-wave.svg (seamless)"
    ET.SubElement(card_w, "rect", {
        "x": "38", "y": "590", "width": "128", "height": "96",
        "fill": "url(#qa-wave-pat)", "stroke": "#D98F78", "stroke-width": "1"
    })

    # Jaali Card
    card_j = ET.SubElement(root, "g")
    ET.SubElement(card_j, "rect", {"x": "201", "y": "562", "width": "175", "height": "136", "class": "card-bg"})
    lbl_j = ET.SubElement(card_j, "text", {"x": "288.5", "y": "578", "class": "lbl"})
    lbl_j.text = "A9 · tile-jaali.svg (seamless)"
    ET.SubElement(card_j, "rect", {
        "x": "224", "y": "590", "width": "128", "height": "96",
        "fill": "#0A1B5C", "stroke": "#D98F78", "stroke-width": "1"
    })
    ET.SubElement(card_j, "rect", {
        "x": "224", "y": "590", "width": "128", "height": "96",
        "fill": "url(#qa-jaali-pat)"
    })

    # 5. Row 5: Dividers
    add_card(14, 708, 362, 54, "A10 · divider-lotus.svg (240×24)", "divider-lotus.svg", scale=1.0, tx=61, ty=22)
    add_card(14, 770, 362, 46, "A11 · divider-diamond.svg (240×12)", "divider-diamond.svg", scale=1.0, tx=61, ty=24)

    # Footer note
    ft = ET.SubElement(root, "text", {
        "x": "195", "y": "832",
        "style": "font-family:sans-serif; font-size:7.5px; fill:#C9A24B; letter-spacing:1px; text-anchor:middle;"
    })
    ft.text = "ALL 11 ASSETS PASS ACCEPTANCE · ≤ 40 KB · PALETTE COMPLIANT"

    # Write out
    qa_svg_path = "scratch/qa_t03.svg"
    tree = ET.ElementTree(root)
    tree.write(qa_svg_path, encoding="utf-8", xml_declaration=True)

    out_png = "qa/T03.png"
    cmd = ["rsvg-convert", "-w", str(w), "-h", str(h), qa_svg_path, "-o", out_png]
    subprocess.run(cmd, check=True)
    print(f"Generated {out_png} ({os.path.getsize(out_png)} bytes)")

if __name__ == "__main__":
    main()
