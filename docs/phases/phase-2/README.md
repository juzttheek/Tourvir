# Phase 2 containment record

**Run date:** 2026-07-26

**Branch:** `main`

**Status:** blocked on external Firebase project shutdown verification; local containment complete

## Local changes completed

- Removed Firebase App, Firestore and Storage SDK tags from every HTML route.
- Removed `js/firebase-init.js`, `.firebaserc`, `firebase.json` and the tracked Firebase Hosting cache.
- Removed the public gallery admin trigger, password gate, upload/manage interface, privileged bundle and admin-only CSS.
- Replaced the remote gallery dependency with six safe local gallery cards so filtering and lightbox behavior remain available until Cloudinary Phase 8.
- Corrected filtered-gallery lightbox indexing and added Enter/Space activation.
- Removed inquiry selectors for nonexistent fields and added arrival/departure date-order validation.
- Removed the feedback `feedback-email` mismatch and all Firebase timestamp/write paths.
- Removed false-success fallback behavior from contact, feedback and inquiry.
- Until Formspree is configured in Phase 7, submissions preserve entered values and clearly direct visitors to email or WhatsApp.

## Verification

- Firebase/runtime scan: no `firebase`, `firestore`, project ID, admin trigger/panel, `gallery-admin`, false-success message or broken selector remains outside historical documentation.
- All nine HTML routes returned HTTP 200 from a local server.
- All HTML pages passed duplicate-ID and local-reference checks.
- `git diff --check` passed.
- Microsoft Edge rendered gallery, inquiry and contact at 390×844 and wrote non-empty screenshots (324,402; 177,691; and 167,177 bytes respectively).
- The gallery screenshot confirmed the local cards render without an admin control. It also retained the known baseline mobile clipping that is assigned to Phase 9.

Node.js is unavailable, so a separate `node --check`/automated test runner could not be used. Browser execution covered the changed JavaScript entry points.

## External blocker

This environment has no Firebase/Google Cloud credentials or CLI. Therefore it cannot:

- disable the currently deployed Firebase Hosting release;
- confirm Firestore and Storage public access is closed;
- remove the remote Firebase project/resources; or
- inspect production logs after containment.

An authorized project owner must disable the old hosting deployment and Firestore/Storage access, then attach redacted Console/CLI evidence. Path B disposal is already approved, so no export is required and recovery capability is `NONE`.

Phase 2 must remain `blocked` until that external shutdown is verified. The local containment commit is safe to retain while waiting.

## Rollback

Do not restore Firebase scripts, public database writes or the gallery admin. If a visual regression is found, restore only static presentation from the previous commit. Forms must remain honestly unavailable until Formspree succeeds end to end.
