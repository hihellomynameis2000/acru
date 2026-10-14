# Acru V6 — 1440p WebP frame sequence

101 approved cinematic dolly frames, indexed 0000–0100, at 2560 × 1440.
These are uniformly downsampled from the approved native 4K render. There
is no crop, regenerated content, extra animation, or change to Acru's UI.

## Files

- `frames/0000.webp` through `frames/0100.webp`: the complete ordered dolly.
- `handoff_exact_2560x1440.png`: matching lossless endpoint, RGB PNG.
- `manifest.json`: frame order, progress, timing, encoder settings and hashes.

## Sequence mapping

- First frame: `frames/0000.webp`.
- Final frame: `frames/0100.webp`.
- Normalized progress runs from 0 to 1.
- Frame index = round(clamp(progress, 0, 1) × 100).
- A frame's reference time is its index divided by 24 seconds.
- All 101 frames played at 24 fps occupy 4.208333 seconds; the terminal
  frame starts at 4.166667 seconds.
- Opening and endpoint holds are not duplicated in this image sequence.

## Image quality and handoff

Each WebP uses quality 92, method 6, sharp YUV conversion, and an sRGB
image interpretation. It is lossy: small colour changes, chroma rounding
and compression differences are expected compared with the source PNG.

The separate endpoint PNG uses the same full-frame Lanczos downsample,
then lossless 8-bit RGB PNG encoding. Its outer background is exactly
`#1d1c1c` (RGB 29, 28, 28). Use this PNG for the final stable handoff when
the page background must match exactly; do not use lossy WebP colour
values as the page colour authority. All dashboard corners and internal
padding are preserved. The 4K source PNGs retain their original 16-bit
precision in the separate full-resolution package.

This archive contains images and metadata only. Keep the viewport at the
same 16:9 composition for the handoff. No website code, navigation, copy,
Lottie file, or editorial slide is included.

## Verification

The packager verifies all 101 source hashes against the approved native
4K manifest, every output frame's dimensions and index, the endpoint PNG's
background, and the ZIP's file list, order, hashes and CRCs. ZIP entries
have fixed timestamps so rerunning with the same ImageMagick/libwebp
version and inputs produces a reproducible archive.
