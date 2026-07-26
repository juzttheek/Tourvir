# Phase 5 shared layout and content record

**Run date:** 2026-07-26

**Branch:** `main`

**Status:** complete

## Delivered

- Shared `BaseLayout` and `PageShell` used by all nine routes.
- One drawer/header/navigation, footer and floating-contact implementation.
- Central site identity/contact/navigation source in `src/content/site.ts`.
- Typed package and vehicle catalogs with stable IDs and build-time validation.
- Reusable PackageGrid and VehicleGrid components.
- Reusable Button, Card, Badge, FilterPills, ModalShell, StatusRegion and FormField primitives.
- Reusable PageHero and CallToAction layout boundaries.
- Page-level presentation extracted from 25 inline declarations into `public/css/legacy-utilities.css`.
- Inline package-search handler replaced by an owned JavaScript event listener.

## Verification

`npm run validate` passed:

- formatting, JavaScript/CSS lint and strict type checks: pass;
- unit tests: 5 passed, including stable catalog IDs, valid categories/prices and existing media;
- form/Firebase containment contract tests: 3 passed;
- Astro build and artifact allowlist: 9 routes, pass;
- HTML, links and content checks: pass;
- semantic compatibility across titles, headings, controls and main images for all 9 routes: pass;
- CSS and image byte parity: pass;
- browser/interaction/visual-geometry tests: 23 passed using two workers for stability;
- critical-impact axe scans: 4 passed;
- mobile/tablet/desktop smoke tests: 3 passed;
- Lighthouse performance: home 0.67, gallery 0.74, contact 0.91;
- Lighthouse accessibility: 0.93 on all audited routes;
- Lighthouse Best Practices and SEO: 1.00 on all audited routes.

## Deliberate boundaries

- Phase 5 componentizes structure and static content; legacy JavaScript behavior remains in `public/js/` until Phase 6.
- The shared chrome/footer use trusted repository-owned markup fragments so the large existing SVG icon set remains visually stable. There is no visitor-controlled interpolation. Phase 6 may replace these fragments with focused icon components as behavior modules are migrated.
- Page source has no inline `style` or `onclick`. Inline style attributes remaining in generated output belong to the documented repository-owned SVG/icon markup; runtime display/animation values remain controlled by legacy JavaScript until Phase 6.
- Existing phone, address, social and licensing claims remain marked `placeholder_pending_owner` in the centralized site record. They are now easy to replace once the business owner supplies verified values.

## Rollback

Revert the Phase 5 commit to return to full-page Astro sources from Phase 4. Do not restore Firebase, public gallery administration, false-success form handling or GitHub Pages deployment.
