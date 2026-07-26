# Phase 1 baseline record

**Captured:** 2026-07-26 (Asia/Colombo)

**Branch:** `main`

**Baseline commit:** `ee0561a2a8bef784face52e9fe65dbc10f093588`

**Baseline tree:** `6568ce7dd79f44ffff81cff6399c5b6767a3a693`

**Phase status:** blocked pending authorized Firebase data-disposition approval

This directory characterizes the pre-upgrade Tourvir site. It is a migration reference, not an assertion that current behavior is correct. Known failures and insecure behavior are preserved as evidence so later phases can prove they have been removed.

## Evidence index

- [route-contract.json](route-contract.json): public paths and expected baseline responses.
- [source-inventory.md](source-inventory.md): source, asset and dependency inventory.
- [behavior-checklist.md](behavior-checklist.md): page-by-page interaction contract.
- [known-issues.md](known-issues.md): confirmed defects that must not be treated as intended parity.
- [firebase-backup-evidence.md](firebase-backup-evidence.md): legacy data-disposition prerequisite and remaining external action.
- [metrics.md](metrics.md): baseline repository and page-weight facts.
- [visual-baseline.md](visual-baseline.md): screenshot matrix, capture method and integrity summary.
- `screenshots/{light,dark}/`: 54 viewport screenshots, covering every route in both themes.

## Reproduction

From repository root:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open the routes in `route-contract.json`. Screenshots were captured with installed Microsoft Edge in headless mode at 390×844, 768×1024 and 1440×900.

## Phase 1 gate

Completed locally:

- Exact Git baseline recorded.
- Routes, sources, assets, forms and known behaviors inventoried.
- All nine HTML routes returned HTTP 200 from the local server.
- Local asset/link scan found no missing references.
- Duplicate-ID scan found none.
- 54 visual references captured and checked for non-zero output.
- Known conversion/security failures recorded explicitly.

Not completed externally:

- No authorized owner has yet selected and approved a Firebase disposition path. This environment cannot export/restore Firestore and Storage because it has no Firebase CLI, Google Cloud CLI, Node runtime, application credentials or Firebase token. Alternatively, an authorized owner may attest that no retained data is required and explicitly approve irreversible disposal. No attempt was made to bypass Firebase rules or download private lead data with the public web API key.

Phase 1 must remain `blocked`, not `complete`, until an authorized owner approves either the verified export/restore path or the no-required-data/approved-discard path described in `firebase-backup-evidence.md`.
