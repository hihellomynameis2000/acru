# Mobile homepage motion

September 9, 2026. Local-preview update; no deployment performed.

- Enabled the authored hero camera sequence on screens up to 820px; desktop framing and sideways handoff remain unchanged.
- Mobile uses the same frames 0–84, resized proportionally from `public/media/acru-hero/v6-1440p/frames` to 1280 × 720 WebP at quality 78 in `public/media/acru-hero/v6-mobile-v1/frames`. All 85 compressed frames total 3,791,886 bytes. No frame is loaded until requested by the bounded scheduler.
- Matching mobile handoff (38,464 bytes) and dashboard (60,600 bytes) WebPs are delivered through responsive `<picture>` sources, avoiding the full-resolution desktop PNGs on phones. Original assets are unchanged.
- Four retained decoded frames and one temporary decode bound mobile frame memory to about 17.6 MiB, in addition to canvas, image and compressed-blob allocations. Offscreen/hidden work pauses. Reduced motion, data saving and load failures retain the static fallback.
- Mobile scroll travel uses a stable `100svh` measurement, rather than following collapsing browser controls. Portrait framing fits gradually and the dashboard settles above the payment tabs. The stage includes the complete tab content height, including enlarged text, before unpinning into normal scrolling.
- Mobile navigation now has expandable in-place sections with 48 × 36px illustrations beside the text, 40px minimum child-link targets, keyboard-accessible disclosure controls, and a separately scrolling body below the persistent close control. Images remain deferred until their section is opened.

Verification: unit/SSR tests cover responsive image sources, frame selection/size budgets, phone/tablet/landscape geometry, cache routing and disclosure markup. Browser/device visual testing was not requested and was not performed.
