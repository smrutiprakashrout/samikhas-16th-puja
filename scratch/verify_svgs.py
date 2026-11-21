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
    "mandala.svg", "lotus.svg", "lotus-petal.svg", "diya.svg",
    "peacock.svg", "peacock-feather.svg", "marigold-petal.svg",
    "tile-wave.svg", "tile-jaali.svg", "divider-lotus.svg",
    "divider-diamond.svg"
]

all_passed = True

for fname in FILES:
    fpath = os.path.join("assets/svg", fname)
    if not os.path.exists(fpath):
        print(f"FAIL: {fname} does not exist!")
        all_passed = False
        continue

    size = os.path.getsize(fpath)
    if size > 40 * 1024:
        print(f"FAIL: {fname} exceeds 40 KB ({size} bytes)")
        all_passed = False

    with open(fpath, "r") as f:
        content = f.read()

    # Check for forbidden tags
    for forbidden in ["<image", "<text", "<tspan", "<font", "filter="]:
        if forbidden in content.lower():
            print(f"FAIL: {fname} contains forbidden element: {forbidden}")
            all_passed = False

    # Parse XML
    try:
        tree = ET.parse(fpath)
        root = tree.getroot()
    except Exception as e:
        print(f"FAIL: {fname} XML parse error: {e}")
        all_passed = False
        continue

    # Check viewBox
    vb = root.attrib.get("viewBox")
    if not vb:
        print(f"FAIL: {fname} missing viewBox")
        all_passed = False

    # Check that width/height in px don't conflict
    w = root.attrib.get("width")
    h = root.attrib.get("height")
    if w and ("px" in w or "%" not in w):
        print(f"WARNING: {fname} has width={w}")
    if h and ("px" in h or "%" not in h):
        print(f"WARNING: {fname} has height={h}")

    # Check IDs
    base_prefix = fname.replace(".svg", "")
    all_ids = re.findall(r'id=["\']([^"\']+)["\']', content)
    for elem_id in all_ids:
        # ID must start with prefix
        if not elem_id.startswith(base_prefix):
            print(f"FAIL: {fname} id '{elem_id}' does not start with '{base_prefix}-'")
            all_passed = False

    # Check colors (hex values)
    hex_colors = re.findall(r'#[0-9a-fA-F]{6}', content)
    for c in hex_colors:
        if c.lower() not in ALLOWED_COLORS:
            print(f"FAIL: {fname} contains unauthorized color: {c}")
            all_passed = False

# Check specific requirements
# 1. diya.svg groups
diya_content = open("assets/svg/diya.svg").read()
for req_id in ['id="diya-flame"', 'id="diya-glow"', 'id="diya-bowl"']:
    if req_id not in diya_content:
        print(f"FAIL: diya.svg missing required group: {req_id}")
        all_passed = False

if all_passed:
    print("ALL SVG TECHNICAL CHECKS PASSED PERFECTLY!")
else:
    print("SOME CHECKS FAILED!")
