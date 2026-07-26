# Phase 3 toolchain and validation record

**Run date:** 2026-07-26

**Branch:** `main`

**Status:** complete
**Dependency exception:** the owner explicitly instructed Phase 3 to proceed and accepted responsibility for deleting the unused remote Firebase project. Phase 2 remains blocked only on evidence of that external deletion; repository containment is complete.

## Delivered

- Node.js 24.18.0/npm 11 runtime pins, exact dependency versions and `package-lock.json`.
- Reproducible allowlist build containing nine HTML routes and only `css/`, `images/` and `js/` asset directories.
- Prettier, ESLint, Stylelint, strict TypeScript, HTML structure, local-link and content-contract checks.
- Vitest unit/contract suites and Playwright route, axe and responsive viewport suites.
- Lighthouse runner managed by Playwright, with JSON evidence written to ignored `.lighthouseci/results/`.
- Validation-only GitHub Actions workflow with read-only repository permissions and no deployment job.
- Install/development/build/test documentation and public-only environment variable examples.

No Astro page migration or root-source relocation was performed; that belongs to Phase 4 so the current visual baseline remains directly previewable.

## Verification results

`npm run validate` passed in full:

- formatting, JavaScript/CSS lint and strict type checking: pass;
- unit tests: 3 passed;
- form/Firebase containment contract tests: 3 passed;
- HTML structure, local references and content contracts across nine routes: pass;
- allowlist build: nine HTML routes and three asset directories;
- browser routes and fail-closed behavior: 11 passed;
- critical-impact axe scans: 4 passed using one worker for CI stability;
- responsive screenshot smoke tests (mobile/tablet/desktop): 3 passed;
- Lighthouse hard accessibility budget: pass on index (0.93), gallery (0.88) and contact (0.88);
- Lighthouse Best Practices and SEO: 1.00 on all three audited routes;
- CLS: within the 0.25 warning budget on all audited routes.

Additional supply-chain and gate checks:

- `npm ci --dry-run`: pass;
- `npm audit --audit-level=low`: zero vulnerabilities;
- deliberate ESLint syntax error: exit 1;
- corrected project source: exit 0.

## Known follow-ups

- Homepage Lighthouse performance is unstable and below the desired warning budget on a cold run (0.30 observed; 0.68 in the final full validation). Image sizing, formats, preload strategy and blocking CSS are assigned to later image/performance phases.
- The npm client warns that the transitive `esbuild` install script is not explicitly approved by npm's optional allow-scripts policy. Current build, tests and Astro CLI loading succeed. Reassess the policy when Phase 4 activates Astro's production build.
- Phase 2 still requires redacted proof that the remote Firebase Hosting/Firestore/Storage project was deleted or disabled by its authorized owner.
- CI configuration is locally validated, including deliberate failure behavior; its first hosted GitHub Actions run will supply the remote run URL.

## Rollback

Revert the Phase 3 commit to remove the toolchain. Do not restore the deleted Firebase runtime, public gallery administration, false-success form behavior or GitHub Pages root deployment workflow. The legacy root HTML/CSS/JavaScript site remains directly previewable throughout rollback.
