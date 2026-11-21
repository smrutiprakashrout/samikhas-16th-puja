#!/usr/bin/env python3
"""
Verify seamless tiling mathematically:
Check pixels along left edge vs right edge, top edge vs bottom edge.
"""
import subprocess
import os

def check_seamless_image(png_path, w, h):
    # Using imagemagick to compare edges
    # Crop left column of 1px and right column of 1px
    # Crop top row of 1px and bottom row of 1px
    cmd1 = f"magick {png_path} -crop 1x{h}+0+0 scratch/left.png"
    cmd2 = f"magick {png_path} -crop 1x{h}+{w-1}+0 scratch/right.png"
    cmd3 = f"magick {png_path} -crop {w}x1+0+0 scratch/top.png"
    cmd4 = f"magick {png_path} -crop {w}x1+0+{h-1} scratch/bottom.png"
    for cmd in [cmd1, cmd2, cmd3, cmd4]:
        subprocess.run(cmd, shell=True, check=True)
    
    # Compare left vs right
    res_lr = subprocess.run("magick compare -metric AE scratch/left.png scratch/right.png null: 2>&1", shell=True, capture_output=True, text=True)
    res_tb = subprocess.run("magick compare -metric AE scratch/top.png scratch/bottom.png null: 2>&1", shell=True, capture_output=True, text=True)
    print(f"{png_path} Left-Right difference: {res_lr.stdout.strip() or res_lr.stderr.strip()} pixels")
    print(f"{png_path} Top-Bottom difference: {res_tb.stdout.strip() or res_tb.stderr.strip()} pixels")

check_seamless_image("scratch/tile-wave.png", 64, 64)
check_seamless_image("scratch/tile-jaali.png", 56, 56)
