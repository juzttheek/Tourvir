# Tourvir

Tourvir is a static tourism and lead-generation website built with Astro. The Phase 4 source lives in `src/` and `public/`; the root HTML/CSS/JavaScript files are retained temporarily as a reference-only parity and rollback source.

## Requirements

- Node.js 24.18.0 (Node 24 LTS)
- npm 11 or newer

Use `.node-version` or `.nvmrc` where your version manager supports it.

## Setup

```bash
npm ci
npx playwright install chromium
```

Copy `.env.example` to `.env` only when managed service identifiers are available. Never put Formspree account tokens, Cloudinary API secrets or other private credentials in browser variables.

## Development

```bash
npm run dev
npm run build
npm run preview
```

`npm run build` runs Astro and audits `dist/`. The artifact contains only the nine established `.html` routes, Astro output and the approved `css/`, `js/` and `images/` assets. Reports, root legacy references, tests and operational documents are not deployable.

## Validation

```bash
npm run validate
```

Individual commands are available for formatting, linting, strict type checking, unit/contract tests, HTML/link/content checks, Playwright route tests, axe smoke tests, responsive screenshot smoke tests and Lighthouse CI.

The GitHub Actions workflow performs validation only. It has no deployment permissions and does not publish GitHub Pages. Vercel integration is introduced through the deployment phases after the Astro build exists.

## Current form behavior

Contact, inquiry and feedback intentionally fail closed until Formspree is configured in Phase 7. They preserve entered data and direct visitors to email or WhatsApp; they never report unconfirmed success.
