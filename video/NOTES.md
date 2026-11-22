V00: host is Arch/Omarchy (not Debian/Ubuntu); all required Chrome libs were already present via ldconfig, so no sudo install was needed. Agent cannot view images; owner must open video/qa/V00-fonts.png to confirm Odia conjuncts.
V01: `scripts/compare.mjs` uses ImageMagick for the final hstack because Remotion's bundled ffmpeg has `--disable-filters` and no `hstack` filter.
