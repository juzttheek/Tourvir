# Phase 4 Astro migration record

**Run date:** 2026-07-26

**Branch:** `main`

**Status:** complete

## Delivered

- Static Astro source under `src/pages/` for all nine existing `.html` routes.
- Target folders for layouts, components, content, scripts, services, schemas and styles.
- Unchanged parity assets under `public/css/`, `public/js/` and `public/images/`.
- A typed `src/layouts/BaseLayout.astro` extraction boundary for Phase 5.
- File-format Astro output with HTML whitespace preservation.
- `vercel.json` configured to build Astro, preserve `.html` URLs and publish only `dist/`.
- Route/content/asset parity checks and a strict deploy-artifact allowlist audit.
- Temporary root reference policy documented in `docs/legacy-reference.md`.

The root HTML/CSS/JavaScript/image implementation remains reference-only for rollback and parity comparison. It is not read by the Astro build and cannot enter `dist/`.

## Verification

The complete Phase 3 validation pipeline passed after migration:

- formatting, JavaScript/CSS lint and strict type checks: pass;
- unit tests: 3 passed;
- containment contract tests against active `src/`/`public/` source: 3 passed;
- Astro production build: nine exact `.html` routes;
- HTML structure, local reference and content-contract checks against `dist/`: pass;
- DOM/content parity against the root reference: nine routes passed;
- SHA-256 byte parity: every CSS, JavaScript and image asset passed;
- browser suite: 23 passed, including nine DOM parity and three pixel-identical representative desktop comparisons;
- critical-impact axe scans: 4 passed;
- responsive mobile/tablet/desktop smoke checks: 3 passed;
- Lighthouse hard accessibility budget: pass; Best Practices and SEO: 1.00 on all audited routes;
- deploy artifact: only nine HTML files and approved static asset directories; no reports, tests, source configuration, secrets, Firebase or admin runtime.

## Important migration decision

Astro 7 defaults to JSX whitespace handling. Initial parity checks correctly detected removed spaces around inline elements. `compressHTML: false` is intentionally set until Phase 5 explicitly componentizes markup and adds deliberate whitespace. This preserves the reference rendering during migration.

## Known follow-ups

- `BaseLayout.astro` exists as a typed boundary but pages intentionally retain their full parity markup. Phase 5 will adopt it while extracting shared header, drawer, footer, floating actions and metadata.
- Root reference files are deliberately duplicated and should be deleted only after later parity/retention approval.
- Homepage and gallery Lighthouse performance remain below the preferred warning budget on some cold runs; image and CSS optimization remain assigned to later phases.
- The configured Vercel artifact is deploy-ready structurally, but no production deployment, domain change or provider integration occurs in Phase 4.
- Remote Firebase deletion evidence remains an external owner task from Phase 2.

## Rollback

Revert the Phase 4 commit. The root reference remains directly previewable. Do not restore Firebase code, public administration, false-success form behavior or the retired GitHub Pages deployment workflow.
