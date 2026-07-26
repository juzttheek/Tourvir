# Baseline metrics

These are static/local characterization values, not production field metrics.

## Repository/source

- HTML: 9 files, 3,436 lines, 387,791 bytes.
- CSS: 9 files, 4,977 lines, 102,069 bytes.
- JavaScript: 6 files, 1,416 lines, 50,646 bytes.
- Owned WebP images: 45 files, 11,855,894 bytes.
- Hero images: 16 files, 6,063,120 bytes.
- Local route requests: nine of nine returned HTTP 200.
- Missing local references: zero.
- Duplicate HTML IDs: zero.

## Per-page source bytes

| Page | HTML bytes |
|---|---:|
| Home | 59,926 |
| Packages | 47,895 |
| Vehicles | 55,188 |
| Gallery | 34,742 |
| Inquiry | 52,699 |
| Contact | 46,028 |
| Cookies | 30,521 |
| Privacy | 30,416 |
| Terms | 30,376 |

## Limitations

- No Node/build/test tooling exists at this baseline.
- Lighthouse/Core Web Vitals were not rerun during Phase 1 because no browser automation/toolchain is installed yet. The master audit's performance statements remain design-level until Phase 3 adds repeatable tooling.
- Headless screenshots cover the initial viewport, not every scrolled state.
- External Firebase requests may fail in the isolated capture environment and are not evidence of production availability.
