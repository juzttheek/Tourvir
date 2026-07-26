# Confirmed baseline issues

These issues existed before the upgrade branch and must have regression tests before correction.

| ID | Severity | Finding | Evidence |
|---|---|---|---|
| BASE-001 | P0 | Public gallery admin password/hash and privileged mutation code ship to visitors. | `js/gallery-admin.js` |
| BASE-002 | P0 | Firestore and Storage rules/indexes are not committed. | Repository/config inventory |
| BASE-003 | P0 | Inquiry serializer references fields absent from `inquiry.html`. | `js/inquiry.js:148` onward vs form IDs |
| BASE-004 | P0 | Feedback serializer expects `feedback-email`, but markup has `feedback-country`. | `js/main.js:321`, `index.html` |
| BASE-005 | P0 | Contact/inquiry fallback can announce success without persistence. | `js/main.js`, `js/inquiry.js` |
| BASE-006 | P0 | Firebase and GitHub Pages deploy repository root. | `firebase.json`, `.github/workflows/pages.yml` |
| BASE-007 | P1 | Remote gallery fields are rendered through `innerHTML`. | `js/gallery-admin.js` |
| BASE-008 | P1 | Legal page titles are copied from Contact. | cookies/privacy/terms head markup |
| BASE-009 | P1 | Placeholder-looking phone/WhatsApp data is repeated across pages. | HTML contact/footer markup |
| BASE-010 | P1 | Home loads eleven hero images eagerly; owned hero directory is about 6.06 MB. | `index.html`, image inventory |
| BASE-011 | P1 | Firebase compat SDK loads on pages with no Firebase behavior. | All route script lists |
| BASE-012 | P1 | Mobile home at 390 px has clipped header CTA and hero content. | `screenshots/*/index-390x844.png` |
| BASE-013 | P1 | Global `overflow-x: hidden` can conceal responsive overflow. | `css/style.css` |
| BASE-014 | P2 | Shared header/sidebar/footer/contact data are duplicated across pages. | Root HTML pages |
| BASE-015 | P2 | No build, lint, typecheck, automated test, monitoring or release gate exists. | Repository inventory |

See the master audit for remediation and phase ownership.
