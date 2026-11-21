#!/usr/bin/env python3
"""
Test 3x3 tiling for tile-wave.svg and tile-jaali.svg
"""
import subprocess

def test_tiling(svg_name, tile_size, count=3):
    total_size = tile_size * count
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_size} {total_size}">
  <defs>
    <pattern id="pat" width="{tile_size}" height="{tile_size}" patternUnits="userSpaceOnUse">
      <image href="{svg_name}" width="{tile_size}" height="{tile_size}"/>
    </pattern>
  </defs>
  <rect width="{total_size}" height="{total_size}" fill="url(#pat)"/>
</svg>'''
    test_svg = f"scratch/test_tiled_{svg_name}"
    with open(test_svg, "w") as f:
        f.write(svg_content)
    test_png = f"scratch/test_tiled_{svg_name}.png"
    res = subprocess.run(["rsvg-convert", test_svg, "-o", test_png], capture_output=True, text=True)
    print(f"Tiling test for {svg_name}: exit {res.returncode}")

# Also test direct composite without <image> for rsvg compatibility
def test_direct_tiling(svg_path, tile_size, count=3):
    import xml.etree.ElementTree as ET
    tree = ET.parse(svg_path)
    root = tree.getroot()
    # strip namespace
    for elem in root.iter():
        if '}' in elem.tag:
            elem.tag = elem.tag.split('}', 1)[1]
            
    total_size = tile_size * count
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_size} {total_size}">']
    
    # defs if any
    defs = root.find('defs')
    if defs is not None:
        out.append(ET.tostring(defs, encoding='unicode'))
        
    for row in range(count):
        for col in range(count):
            ox = col * tile_size
            oy = row * tile_size
            out.append(f'<g transform="translate({ox}, {oy})">')
            for child in root:
                if child.tag != 'defs':
                    out.append(ET.tostring(child, encoding='unicode'))
            out.append('</g>')
    out.append('</svg>')
    
    base = os.path.basename(svg_path)
    out_svg = f"scratch/tiled_direct_{base}"
    with open(out_svg, "w") as f:
        f.write("\n".join(out))
    out_png = f"scratch/tiled_direct_{base}.png"
    res = subprocess.run(["rsvg-convert", out_svg, "-o", out_png], capture_output=True, text=True)
    print(f"Direct tiling test for {base}: exit {res.returncode}")

import os
test_direct_tiling("assets/svg/tile-wave.svg", 64, 3)
test_direct_tiling("assets/svg/tile-jaali.svg", 56, 3)
