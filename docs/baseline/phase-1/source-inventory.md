# Source and dependency inventory

## Repository baseline

- Git commit: `ee0561a2a8bef784face52e9fe65dbc10f093588`
- Git tree: `6568ce7dd79f44ffff81cff6399c5b6767a3a693`
- Tracked files at baseline: 74
- Application files visible to `rg --files`: 71
- Deployment definitions: Firebase Hosting and GitHub Pages
- Package manifest: absent
- Meaningful package lock: absent (`package-lock.json` has no packages)
- Runtime/build pipeline: absent
- Test/lint/typecheck pipeline: absent

## Application sources

| Type | Files | Lines | Bytes |
|---|---:|---:|---:|
| HTML pages | 9 | 3,436 | 387,791 |
| CSS | 9 | 4,977 | 102,069 |
| JavaScript | 6 | 1,416 | 50,646 |
| WebP images | 45 | — | 11,855,894 |

Hero directory: 16 files, 6,063,120 bytes.

## Routes/pages

| Page | Bytes | Lines | Forms | Images | Scripts |
|---|---:|---:|---:|---:|---:|
| `index.html` | 59,926 | 635 | 1 | 23 | 4 |
| `packages.html` | 47,895 | 423 | 0 | 8 | 5 |
| `vehicles.html` | 55,188 | 560 | 0 | 10 | 4 |
| `gallery.html` | 34,742 | 329 | 0 | 3 | 7 |
| `inquiry.html` | 52,699 | 507 | 1 | 1 | 5 |
| `contact.html` | 46,028 | 379 | 1 | 1 | 4 |
| `cookies.html` | 30,521 | 201 | 0 | 1 | 4 |
| `privacy.html` | 30,416 | 201 | 0 | 1 | 4 |
| `terms.html` | 30,376 | 201 | 0 | 1 | 4 |

Every page contains exactly one `h1`. No duplicate static HTML IDs were found. All local HTML `src`/`href` targets resolved at capture time.

## Browser dependencies and external origins

- Google Firebase compat App and Firestore SDKs are loaded from `www.gstatic.com` on every route.
- Gallery additionally loads Firebase Storage compat SDK.
- WhatsApp links target `wa.me`.
- Google Fonts are imported by CSS from `fonts.googleapis.com` and served from the corresponding Google font CDN at runtime.
- Firebase web project configuration is embedded in `js/firebase-init.js`; it is public configuration, not an authorization boundary.

## Firebase configuration found in source

- Project alias: `tourvir-fd341`
- Hosting public directory: repository root (`.`)
- Committed `firestore.rules`: absent
- Committed `storage.rules`: absent
- Committed `firestore.indexes.json`: absent
- Local `.firebase/hosting..cache`: hosting deployment cache only, not a Firestore/Storage data backup

## Largest owned images

| Asset | Bytes |
|---|---:|
| `images/hero/hero_18bends_hq.webp` | 915,680 |
| `images/packages/complete_srilanka_experience.webp` | 894,908 |
| `images/hero/hero_wild_hq.webp` | 805,704 |
| `images/hero/hero_ocean_hq.webp` | 690,370 |
| `images/hero/hero_mountains_hq.webp` | 620,606 |
| `images/hero/hero_train_hq.webp` | 599,664 |
| `images/hero/hero_kandy_hq.webp` | 528,846 |
| `images/hero/hero_lotus_hq.webp` | 475,466 |
| `images/vehicles/luxury_suv.webp` | 358,540 |
| `images/hero/hero_temple_hq.webp` | 335,208 |

The baseline Git commit/tree is the authoritative complete source manifest. This summary exists to guide migration prioritization.
