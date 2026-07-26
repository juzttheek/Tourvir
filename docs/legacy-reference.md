# Legacy root reference

The nine root HTML files and the root `css/`, `js/` and `images/` directories are a temporary, reference-only rollback source during the Astro migration. They are not used by `npm run build`, are excluded from `dist/`, and must not be edited as the active implementation after Phase 4.

The deployable source is now:

- `src/pages/` for page documents;
- `src/layouts/`, `src/components/`, `src/content/`, `src/scripts/`, `src/services/`, `src/schemas/` and `src/styles/` for incremental extraction in later phases;
- `public/css/`, `public/js/` and `public/images/` for parity-preserved static assets.

Delete the root reference only after later parity and retention gates approve it. Never copy retired Firebase or public administration code back into either source tree.
