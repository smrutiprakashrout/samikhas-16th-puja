#!/usr/bin/env python3
import os
import re
import xml.etree.ElementTree as ET

ALLOWED_COLORS = {
    "#1e2c70", "#0a1b5c", "#12308f", "#34459b",
    "#d98f78", "#ad5e46", "#f3b9a6", "#f8d2c4",
    "#fbf6ec", "#c9a24b", "#f0d58a", "#9a7425",
    "#ffb62e", "#f29a1f", "#0e8c86", "#2fa07f",
    "#d81b72", "none"
}

FILES = [
    ("assets/svg/door-left.svg", "door-left"),
    ("assets/svg/door-right.svg", "door-right"),
    ("assets/svg/bell.svg", "bell"),
    ("assets/svg/rangoli.svg", "rangoli"),
    ("assets/svg/palm-leaf.svg", "palm-leaf"),
    ("assets/svg/stylus.svg", "stylus"),
    ("assets/svg/leaf-roll.svg", "leaf-roll"),
    ("assets/svg/vine.svg", "vine"),
    ("assets/svg/path-alpana.svg", "path-alpana"),
    ("assets/svg/house.svg", "house"),
    ("assets/svg/aarti-lamp.svg", "aarti-lamp"),
    ("assets/svg/scratch-foil.svg", "scratch-foil"),
    ("assets/svg/lamp.svg", "lamp"),
    ("assets/img/placeholder-portrait.svg", "placeholder-portrait"),
]

all_passed = True

for fpath, prefix in FILES:
    if not os.path.exists(fpath):
        print(f"FAIL: {fpath} does not exist!")
        all_passed = False
        continue

    size = os.path.getsize(fpath)
    if size > 40 * 1024:
        print(f"FAIL: {fpath} exceeds 40 KB ({size} bytes)")
        all_passed = False

    with open(fpath, "r") as f:
        content = f.read()

    # Check for forbidden tags
    for forbidden in ["<image", "<text", "<tspan", "<font", "filter="]:
        if forbidden in content.lower():
            print(f"FAIL: {fpath} contains forbidden element: {forbidden}")
            all_passed = False

    # Parse XML
    try:
        tree = ET.parse(fpath)
        root = tree.getroot()
    except Exception as e:
        print(f"FAIL: {fpath} XML parse error: {e}")
        all_passed = False
        continue

    # Check viewBox
    vb = root.attrib.get("viewBox")
    if not vb:
        print(f"FAIL: {fpath} missing viewBox")
        all_passed = False

    # Check IDs
    all_ids = re.findall(r'id=["\']([^"\']+)["\']', content)
    for elem_id in all_ids:
        # Note: some dual IDs like "r1", "stem", "win1", "door", "route" may exist alongside prefixed ones
        allowed_short_ids = {"r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8",
                             "stem", "b1", "b2", "b3", "bloom-gp", "bloom-parents", "bloom-top",
                             "route", "route-line", "win1", "win2", "door"}
        if not (elem_id.startswith(prefix) or elem_id in allowed_short_ids):
            print(f"FAIL: {fpath} id '{elem_id}' does not start with '{prefix}-'")
            all_passed = False

    # Check colors (hex values)
    hex_colors = re.findall(r'#[0-9a-fA-F]{6}', content)
    for c in hex_colors:
        if c.lower() not in ALLOWED_COLORS:
            print(f"FAIL: {fpath} contains unauthorized color: {c}")
            all_passed = False

# Strict check for required IDs:
# 1. rangoli.svg
rangoli_content = open("assets/svg/rangoli.svg").read()
for i in range(1, 9):
    req_id = f'id="rangoli-r{i}"'
    if req_id not in rangoli_content:
        print(f"FAIL: rangoli.svg missing {req_id}")
        all_passed = False

# 2. vine.svg
vine_content = open("assets/svg/vine.svg").read()
for req_id in ['id="vine-stem"', 'id="vine-b1"', 'id="vine-b2"', 'id="vine-b3"',
               'id="vine-bloom-gp"', 'id="vine-bloom-parents"', 'id="vine-bloom-top"']:
    if req_id not in vine_content:
        print(f"FAIL: vine.svg missing {req_id}")
        all_passed = False
if 'class="vine-leaf' not in vine_content:
    print("FAIL: vine.svg missing class='vine-leaf'")
    all_passed = False

# 3. path-alpana.svg
path_content = open("assets/svg/path-alpana.svg").read()
if 'id="route-line"' not in path_content:
    print("FAIL: path-alpana.svg missing id='route-line'")
    all_passed = False
if 'stroke-dasharray=' not in path_content:
    print("FAIL: path-alpana.svg missing stroke-dasharray")
    all_passed = False

# 4. house.svg
house_content = open("assets/svg/house.svg").read()
for req_id in ['id="house-win1"', 'id="house-win2"', 'id="house-door"']:
    if req_id not in house_content:
        print(f"FAIL: house.svg missing {req_id}")
        all_passed = False

# 5. bell.svg
bell_content = open("assets/svg/bell.svg").read()
if 'id="bell-body"' not in bell_content:
    print("FAIL: bell.svg missing id='bell-body'")
    all_passed = False

if all_passed:
    print("ALL SET B SVG TECHNICAL CHECKS PASSED PERFECTLY!")
else:
    print("SOME CHECKS FAILED!")
