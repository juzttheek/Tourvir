# Visual baseline

## Matrix

All nine routes were captured in both `light` and `dark` themes at:

- 390×844 — modern phone portrait.
- 768×1024 — tablet portrait.
- 1440×900 — desktop.

Expected screenshots: 9 × 2 × 3 = **54**.

Captured screenshots: **54**.

Total bytes: **27,087,063**.

Aggregate SHA-256 of the sorted per-file SHA-256 manifest: `00aacd8d98618f16bd8b2aedb7b9387a5b8a6bed157b9cebffd67f6da5d84ac5`.

File naming:

```text
screenshots/<theme>/<route-name>-<width>x<height>.png
```

## Capture method

- Local origin: `http://127.0.0.1:4173` served by Python's static HTTP server.
- Browser: installed Microsoft Edge, headless mode.
- Dark theme: initialized through the same-origin `Tourvir-theme` local-storage key before capture.
- Screenshots are viewport captures and intentionally preserve current defects.

## Verified observation

The 390×844 home capture shows significant right-side clipping in both themes, including the header CTA and hero content. Later responsive work must improve this; visual regression should not require preserving the defect.

## Integrity note

The aggregate is computed from sorted entries of `<individual SHA-256><two spaces><workspace-relative path>`. Git object hashes after commit provide an additional integrity record for every PNG.
