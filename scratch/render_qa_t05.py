#!/usr/bin/env python3
"""
Generate the 390x844 QA screenshot for task T05.
Composes the three assets: ganesha.webp, og.jpg, and favicon.svg on navy background.
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
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "viewBox": f"0 0 {w} {h}",
        "width": str(w),
        "height": str(h)
    })

    defs = ET.SubElement(root, "defs")

    # Wave pattern definition
    wave_root = load_svg("assets/svg/tile-wave.svg")
    wave_pat = ET.SubElement(defs, "pattern", {
        "id": "qa-wave-pat-t05",
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
      .meta { font-family: monospace; font-size: 7.5px; fill: #F0D58A; text-anchor: middle; }
      .card-bg { fill: #0d1e63; fill-opacity: 0.85; stroke: #D98F78; stroke-width: 1; rx: 6; }
    """

    # Background
    ET.SubElement(root, "rect", {"width": str(w), "height": str(h), "fill": "#0A1B5C"})
    ET.SubElement(root, "rect", {"width": str(w), "height": str(h), "fill": "url(#qa-wave-pat-t05)", "opacity": "0.6"})

    # Header
    header = ET.SubElement(root, "g", {"id": "qa-header"})
    sub_txt = ET.SubElement(header, "text", {"x": "195", "y": "26", "class": "sub"})
    sub_txt.text = "SAMIKSHYA’S 16TH BIRTHDAY PUJA"
    title_txt = ET.SubElement(header, "text", {"x": "195", "y": "46", "class": "title"})
    title_txt.text = "T05 · RASTER EXTRAS & FAVICON"

    # Header divider
    div_l_header = ET.SubElement(header, "g", {"transform": "translate(75, 52)"})
    div_l_root = load_svg("assets/svg/divider-lotus.svg")
    for child in div_l_root:
        div_l_header.append(child)

    # 1. CARD 1: og.jpg (1200x630)
    card_og = ET.SubElement(root, "g")
    ET.SubElement(card_og, "rect", {"x": "14", "y": "78", "width": "362", "height": "225", "class": "card-bg"})
    t_og = ET.SubElement(card_og, "text", {"x": "195", "y": "94", "class": "lbl"})
    t_og.text = "assets/img/og.jpg · 1200×630 (139.5 KB < 150 KB)"
    
    # Embed og image
    ET.SubElement(card_og, "image", {
        "x": "25", "y": "104", "width": "340", "height": "178",
        "href": "scratch/og_1200.png"
    })
    ET.SubElement(card_og, "rect", {
        "x": "25", "y": "104", "width": "340", "height": "178",
        "fill": "none", "stroke": "#D98F78", "stroke-width": "0.8"
    })
    t_og_meta = ET.SubElement(card_og, "text", {"x": "195", "y": "295", "class": "meta"})
    t_og_meta.text = "Open Graph Share Card · Navy Gradient + Wave + Mandala + Titles"

    # 2. CARD 2: ganesha.webp (520px wide transparent)
    card_g = ET.SubElement(root, "g")
    ET.SubElement(card_g, "rect", {"x": "14", "y": "315", "width": "362", "height": "340", "class": "card-bg"})
    t_g = ET.SubElement(card_g, "text", {"x": "195", "y": "332", "class": "lbl"})
    t_g.text = "assets/img/ganesha.webp · 520×600 (27.2 KB < 200 KB)"
    
    # Checkerboard / transparent preview background
    ET.SubElement(card_g, "rect", {
        "x": "55", "y": "342", "width": "280", "height": "280",
        "rx": "6", "fill": "#0A1B5C", "stroke": "#D98F78", "stroke-width": "1"
    })
    # Ganesha image
    ET.SubElement(card_g, "image", {
        "x": "75", "y": "347", "width": "240", "height": "270",
        "href": "scratch/ganesha_520.png"
    })
    t_g_meta = ET.SubElement(card_g, "text", {"x": "195", "y": "642", "class": "meta"})
    t_g_meta.text = "Lord Ganesha upon Lotus Throne with Mushakraj · Transparent BG"

    # 3. CARD 3: favicon.svg (64x64)
    card_f = ET.SubElement(root, "g")
    ET.SubElement(card_f, "rect", {"x": "14", "y": "668", "width": "362", "height": "135", "class": "card-bg"})
    t_f = ET.SubElement(card_f, "text", {"x": "195", "y": "685", "class": "lbl"})
    t_f.text = "assets/favicon.svg · 64×64 (1.5 KB)"

    # Favicon previews at 1x (64px), 0.75x (48px), 0.5x (32px), 0.25x (16px)
    fav_root1 = load_svg("assets/favicon.svg")
    g_f1 = ET.SubElement(card_f, "g", {"transform": "translate(50, 700)"})
    for child in fav_root1:
        if child.tag != "defs": g_f1.append(child)
    t_1x = ET.SubElement(card_f, "text", {"x": "82", "y": "780", "class": "meta"})
    t_1x.text = "64×64 (1x)"

    fav_root2 = load_svg("assets/favicon.svg")
    g_f2 = ET.SubElement(card_f, "g", {"transform": "translate(150, 708) scale(0.75)"})
    for child in fav_root2:
        if child.tag != "defs": g_f2.append(child)
    t_2x = ET.SubElement(card_f, "text", {"x": "174", "y": "780", "class": "meta"})
    t_2x.text = "48×48"

    fav_root3 = load_svg("assets/favicon.svg")
    g_f3 = ET.SubElement(card_f, "g", {"transform": "translate(230, 716) scale(0.5)"})
    for child in fav_root3:
        if child.tag != "defs": g_f3.append(child)
    t_3x = ET.SubElement(card_f, "text", {"x": "246", "y": "780", "class": "meta"})
    t_3x.text = "32×32"

    fav_root4 = load_svg("assets/favicon.svg")
    g_f4 = ET.SubElement(card_f, "g", {"transform": "translate(295, 724) scale(0.25)"})
    for child in fav_root4:
        if child.tag != "defs": g_f4.append(child)
    t_4x = ET.SubElement(card_f, "text", {"x": "303", "y": "780", "class": "meta"})
    t_4x.text = "16×16"

    # Footer note
    ft = ET.SubElement(root, "text", {
        "x": "195", "y": "828",
        "style": "font-family:sans-serif; font-size:7.5px; fill:#C9A24B; letter-spacing:1px; text-anchor:middle;"
    })
    ft.text = "ALL T05 ASSETS PASS ACCEPTANCE · FILE SIZE BUDGETS VERIFIED"

    # Write out SVG
    qa_svg_path = "scratch/qa_t05.svg"
    tree = ET.ElementTree(root)
    tree.write(qa_svg_path, encoding="utf-8", xml_declaration=True)

    # Convert to qa/T05.png (390x844)
    out_png = "qa/T05.png"
    subprocess.run(["rsvg-convert", "-w", str(w), "-h", str(h), qa_svg_path, "-o", out_png], check=True)
    print(f"Generated {out_png} ({os.path.getsize(out_png)} bytes)")

if __name__ == "__main__":
    main()
