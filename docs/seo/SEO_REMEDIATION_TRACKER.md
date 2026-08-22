# Tourvir SEO Remediation Tracker

**Started:** 2026-08-13
**Working branch:** `seo-remediation`
**Production baseline:** `main` at `34aff26`
**External audit:** `Tourvir_SEO_Audit_Report.pdf`
**Status:** Phase 0, Phase 1, Phase 2, Phase 4A, Phase 5 and Phase 6 complete; Phase 3 and remaining Phase 4 owner items blocked
**Production deployments from this programme:** none

## Purpose and closure rules

This file is the continuous source of truth for the SEO remediation programme. No report finding may be silently dropped. Each finding must finish as one of:

- `COMPLETE` — implemented and its tests passed.
- `VERIFIED-PASS` — already correct, with current evidence recorded.
- `REJECTED-WITH-EVIDENCE` — inaccurate, obsolete, unsafe or not applicable.
- `BLOCKED-OWNER` — requires genuine business information/access that must not be invented.

A phase is not complete merely because code was written. The completion gate, test log, evidence and rollback note must be present here first.

## Safety rules

1. Keep work isolated on `seo-remediation` until verified.
2. Preserve the completed production site and unrelated user files.
3. Use a Vercel Preview before production deployment.
4. Preserve existing public URLs or provide tested permanent redirects.
5. Never invent itineraries, inclusions, reviews, licences, policies, staff profiles or service claims.
6. Do not implement obsolete schema or SEO theatre for an automated score.
7. Run phase-specific tests and the full regression gate before release.
8. Record changes, tests, evidence, risks, approvals and rollback steps continuously.
9. Deploy small, reversible batches and smoke-test production after each release.
10. Implementation quality can be guaranteed; Google ranking and indexing dates cannot.

## Approved URL policy

- Preferred origin: `https://www.tourvir.lk`
- Homepage canonical: `https://www.tourvir.lk/`
- Interior routes: preserve existing `.html` URLs.
- `/index.html`: permanently redirect to `/` after internal home links are updated.
- HTTP and non-www variants: permanently redirect to matching HTTPS www URLs without avoidable chains.
- Sitemap, canonical, Open Graph, schema URLs, internal links and redirects must agree.

The `.html` routes are retained to avoid an unnecessary migration. Extensions do not harm SEO; conflicting or broken URLs do.

## Phase ledger

| Phase | Scope                                                        | Status        | Completion gate                                                                          |
| ----- | ------------------------------------------------------------ | ------------- | ---------------------------------------------------------------------------------------- |
| 0     | Protected baseline, finding register and test design         | COMPLETE      | All audit claims registered; baseline, safety controls and executable URL tests recorded |
| 1     | Canonicals, redirects, robots, sitemap and indexability      | COMPLETE      | Every sitemap URL reaches one canonical `200`; host/path signals agree                   |
| 2     | Titles, descriptions, social metadata and schema             | COMPLETE      | No unintended duplicates; supported schema validates and matches visible content         |
| 3     | Package, destination, service, About and guide content       | BLOCKED-OWNER | Customer-approved pages are accurate, substantial and conversion-ready                   |
| 4     | Gallery, reviews, licensing, email, social and trust         | IN PROGRESS   | No broken/placeholder media or unsupported trust claim remains                           |
| 5     | Information architecture and internal linking                | COMPLETE      | No orphan priority page; contextual link model passes crawler checks                     |
| 6     | Performance, mobile, media and accessibility                 | COMPLETE      | Performance/accessibility budgets pass without regressions                               |
| 7     | Preview, production release, GSC resubmission and monitoring | PENDING       | Preview/production smoke gates pass; GSC/analytics evidence recorded                     |

## Finding register

`P0` is release-critical, `P1` high, `P2` planned improvement, and `P3` low/monitor. Priorities reflect verified Tourvir risk, not automatically the audit company's label.

| ID      | Area          | Finding                                             | Baseline result                                                           | Priority | State / closure target                                                                                          |
| ------- | ------------- | --------------------------------------------------- | ------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| SEO-001 | Crawlability  | Robots and sitemap “unverified”                     | Both return `200`; audit method was incomplete                            | P0       | COMPLETE — Preview files return `200` and use preferred origin                                                  |
| SEO-002 | Sitemap       | Sitemap health                                      | Audit missed that 20/21 listed page URLs return `404`                     | P0       | COMPLETE — all 21 declared Preview page URLs return `200`                                                       |
| SEO-003 | Indexing      | No brand/site search result                         | GSC exposed 20 incorrect extensionless URLs from the production sitemap   | P0       | OPEN-MONITOR — branch fix ready; production/GSC validation remains                                              |
| SEO-004 | Canonical     | Canonicals use apex while pages serve on www        | Confirmed; apex redirects to www but signals still conflict               | P0       | COMPLETE — Preview canonicals and OG URLs use exact www URLs                                                    |
| SEO-005 | Canonical     | Homepage canonical is `/index.html` instead of `/`  | Confirmed                                                                 | P0       | COMPLETE — canonical `/`; Preview `/index.html` is `308` to `/`                                                 |
| SEO-006 | Redirects     | HTTP/HTTPS behavior unverified                      | Redirects exist; `http://tourvir.lk` currently takes two hops             | P1       | OPEN-RELEASE — path redirect passed; domain hops need production verification                                   |
| SEO-007 | URL           | `/blog/first-post.html` is non-descriptive          | Confirmed                                                                 | P2       | COMPLETE — descriptive canonical plus direct permanent redirects from both old forms                            |
| SEO-008 | URL           | Numeric package prefixes unnecessary                | True but explicitly not harmful; migration risk outweighs benefit         | P3       | REJECTED-WITH-EVIDENCE — preserve stable URLs                                                                   |
| SEO-009 | HTTPS         | Mixed content unverified                            | No failure observed in baseline browser checks                            | P1       | OPEN-VERIFY — automated production HTTPS scan                                                                   |
| SEO-010 | Widgets       | Weather/currency/counters appeared unresolved       | All resolved in live browser                                              | P2       | COMPLETE — real no-JS counters and honest API-failure weather/currency states                                   |
| SEO-011 | Performance   | PSI/CWV not measured                                | Correct audit limitation; local Lighthouse exists, field CWV still needed | P1       | COMPLETE — affected-route lab budgets pass; field monitoring remains Phase 7                                    |
| SEO-012 | Mobile        | Viewport meta present                               | Confirmed                                                                 | P3       | VERIFIED-PASS — preserve in regression                                                                          |
| SEO-013 | On-page       | Homepage metadata and one H1 are strong             | Confirmed                                                                 | P3       | VERIFIED-PASS — preserve                                                                                        |
| SEO-014 | Metadata      | Privacy/Terms/Cookies duplicate Contact metadata    | Confirmed                                                                 | P1       | COMPLETE — unique page-specific metadata passed local and Preview checks                                        |
| SEO-015 | Metadata      | Package descriptions are generic                    | Confirmed on all seven                                                    | P1       | COMPLETE — unique descriptions from visible facts passed generated-site gate                                    |
| SEO-016 | Headings      | Sigiriya post lacks H2/H3                           | Confirmed; it is one short paragraph                                      | P2       | COMPLETE — article now has a descriptive URL, introduction and two logical H2 sections                          |
| SEO-017 | Destinations  | No destination pages                                | Confirmed                                                                 | P1       | BLOCKED-OWNER — genuine destination content required                                                            |
| SEO-018 | Destinations  | Build ten priority pages                            | Directionally good; audit did not validate volumes                        | P1       | BLOCKED-OWNER — confirm offerings and research priority                                                         |
| SEO-019 | Packages      | Seven pages lack overview/itinerary/inclusions/FAQs | Confirmed                                                                 | P1       | BLOCKED-OWNER — full approved package content                                                                   |
| SEO-020 | Packages      | Route map is a placeholder                          | Incorrect; live map loaded six markers and tiles                          | P3       | VERIFIED-PASS — preserve and smoke-test                                                                         |
| SEO-021 | Packages      | Add category landing pages                          | Recommendation, not defect                                                | P2       | OPEN-DESIGN — evaluate after keyword research                                                                   |
| SEO-022 | Packages      | Adventure/family interests lack matching offers     | Confirmed alignment gap                                                   | P2       | BLOCKED-OWNER — add truthful offering or remove promise                                                         |
| SEO-023 | Content       | Practical planning information is limited           | Confirmed                                                                 | P2       | BLOCKED-OWNER — accurate travel-guide hub                                                                       |
| SEO-024 | Content       | “Why Tourvir” evidence is thin                      | Confirmed                                                                 | P2       | BLOCKED-OWNER — real differentiators/team/process                                                               |
| SEO-025 | Blog          | Four posts; newest January 2024                     | Confirmed                                                                 | P2       | BLOCKED-OWNER — new first-hand articles require an approved editorial source and cadence                        |
| SEO-026 | Blog          | Posts are short and weakly linked                   | Confirmed                                                                 | P2       | BLOCKED-OWNER — headings, responsive imagery and links complete; authoritative depth needs owner material       |
| SEO-027 | Local         | NAP, office hours, map and emergency contacts       | Confirmed strengths                                                       | P3       | VERIFIED-PASS — preserve and owner-verify                                                                       |
| SEO-028 | Trust         | Personal Gmail instead of branded email             | Confirmed trust issue, not direct ranking defect                          | P2       | BLOCKED-OWNER — working branded mailbox required                                                                |
| SEO-029 | Local         | Google Business Profile unverified                  | Still unverified                                                          | P1       | BLOCKED-OWNER — official invite or evidence                                                                     |
| SEO-030 | International | English/USD/nationality/ETA foundations             | Confirmed strengths                                                       | P3       | VERIFIED-PASS — preserve and validate claims                                                                    |
| SEO-031 | International | LKR widget broken                                   | Not reproduced; fallback still useful                                     | P3       | COMPLETE — live API remains; timeout and honest static/failure state are enforced                               |
| SEO-032 | International | Hreflang not needed                                 | Correct for current single-language site                                  | P3       | VERIFIED-PASS — do not add prematurely                                                                          |
| SEO-033 | Mobile        | Eight-column vehicle table may be difficult         | Potential; formal device evidence needed                                  | P1       | COMPLETE — named keyboard-scroll region, sticky row labels and 320/390px browser checks pass                    |
| SEO-034 | Performance   | Eleven-image hero may cost bandwidth                | Confirmed design risk despite lazy attributes                             | P1       | COMPLETE — one LCP image plus progressive template loading; request regression passes                           |
| SEO-035 | UX            | About Us navigation routes home                     | Confirmed; homepage has partial About content                             | P2       | BLOCKED-OWNER — genuine dedicated About page                                                                    |
| SEO-036 | Trust         | Only one testimonial                                | Confirmed                                                                 | P2       | BLOCKED-OWNER — permissioned/attributable reviews only                                                          |
| SEO-037 | Reviews       | Ratings/counts lack a visible source                | Confirmed; `AggregateRating` also emitted                                 | P0       | COMPLETE — schema and unsupported visible package ratings/counts removed                                        |
| SEO-038 | Services      | Six service paths route to Contact                  | Confirmed except Vehicles                                                 | P1       | BLOCKED-OWNER — truthful service pages/routing                                                                  |
| SEO-039 | Schema        | No TravelAgency/LocalBusiness detected              | Incorrect; homepage has `TravelAgency`                                    | P2       | COMPLETE — stable TravelAgency identity uses only the verified social URL                                       |
| SEO-040 | Schema        | No TouristTrip detected                             | Incorrect; package template emits it                                      | P2       | COMPLETE — seven trips align with metadata, offers and visible route maps                                       |
| SEO-041 | Schema        | No BlogPosting detected                             | Incorrect; blog template emits it                                         | P2       | COMPLETE — four posts align with visible authors, dates and canonical URLs                                      |
| SEO-042 | Schema        | BreadcrumbList absent                               | Confirmed                                                                 | P2       | COMPLETE — visible and structured breadcrumbs cover all 20 interior pages                                       |
| SEO-043 | Schema        | FAQPage will earn rich snippets                     | Outdated for tourism; Google limits regular FAQ rich results              | P3       | REJECTED-WITH-EVIDENCE — useful visible FAQs, no promise                                                        |
| SEO-044 | Schema        | WebSite can enable sitelinks search box             | Obsolete; Google removed feature in November 2024                         | P3       | REJECTED-WITH-EVIDENCE — no obsolete implementation                                                             |
| SEO-045 | Gallery       | `asd`, `logo`, raw filenames and broken image       | Confirmed; `asd` is broken live                                           | P0       | COMPLETE — test/product entries and their two unused raw assets removed                                         |
| SEO-046 | Images        | Package pages have one image                        | Confirmed                                                                 | P2       | BLOCKED-OWNER — licensed relevant images required                                                               |
| SEO-047 | Media         | File size/compression/lazy loading need measurement | Audit did not measure; repository has large/duplicate assets              | P1       | COMPLETE — 11,668,518 duplicate/unused bytes removed and responsive vehicle media reduced another 462,476 bytes |
| SEO-048 | Links         | Homepage destination cards are not links            | Confirmed                                                                 | P1       | COMPLETE — all three cards link to matching existing package routes                                             |
| SEO-049 | Links         | Packages do not link vehicles/related/destinations  | Confirmed                                                                 | P1       | COMPLETE — seven pages link vehicles, FAQs and three scored related tours                                       |
| SEO-050 | Links         | Blog does not link packages/destinations            | Confirmed                                                                 | P2       | COMPLETE — every guide links two matching packages, vehicles and inquiry FAQ                                    |
| SEO-051 | Links         | Inquiry FAQ is isolated                             | Confirmed                                                                 | P2       | COMPLETE — stable FAQ target linked from packages, guides and vehicles                                          |
| SEO-052 | E-E-A-T       | No guide/driver profiles                            | Confirmed                                                                 | P2       | BLOCKED-OWNER — approved real profiles                                                                          |
| SEO-053 | E-E-A-T       | SLTDA claim lacks number/verification               | Confirmed presentation gap; licence itself unverified                     | P0       | COMPLETE — unverified licence/certification/insurance claims neutralized                                        |
| SEO-054 | Social        | Facebook/X/TikTok link to `#`                       | Confirmed; Instagram works                                                | P0       | COMPLETE — dead icons removed; verified Instagram remains                                                       |
| SEO-055 | Legal         | Policies are generic                                | Confirmed content-quality/legal risk                                      | P1       | BLOCKED-OWNER — business/legal review and approval                                                              |
| SEO-056 | Competition   | Competitors show fuller tours/attributable reviews  | Directionally credible; no quantitative authority data                    | P2       | OPEN — close gaps without copying competitors                                                                   |
| SEO-057 | CRO           | Thin pages force basic-detail enquiries             | Confirmed                                                                 | P1       | BLOCKED-OWNER — resolved by complete content                                                                    |
| SEO-058 | CRO           | Add contextual CTAs                                 | Reasonable recommendation                                                 | P2       | COMPLETE — descriptive package, vehicle, guide, FAQ and inquiry CTAs added                                      |
| SEO-059 | CRO           | Add quick-estimate micro-form                       | Optional, not a defect                                                    | P3       | OPEN-DESIGN — only with owner workflow/evidence                                                                 |
| SEO-060 | Off-page      | Search visibility/backlinks/authority unknown       | Confirmed audit limitation                                                | P1       | BLOCKED-OWNER — GSC/GBP data and ethical growth plan                                                            |

## Owner information request

The customer-ready request is maintained at:

`docs/seo/CUSTOMER_INFORMATION_REQUEST.txt`

It requests business/licence details, package facts, destination/service confirmation, profiles, verified reviews, official social URLs, Search Console/Business Profile evidence, legal terms, media rights, target markets and conversion workflow. It explicitly prohibits password sharing.

## Baseline evidence — 2026-08-13

### Repository protection

- Production baseline: `34aff26 Update branding and Instagram links`.
- Protected working branch: `seo-remediation`.
- Pre-existing untracked user files preserved: external PDF and three branding source images.
- No production deployment or mutation performed during baseline.

### Live HTTP/SEO evidence

- `https://www.tourvir.lk/` returns `200`.
- `https://tourvir.lk/` returns `308` to `https://www.tourvir.lk/`.
- HTTP variants redirect to HTTPS; apex HTTP has an avoidable intermediate hop.
- Live robots, sitemap index and child sitemap return `200`.
- Child sitemap lists 21 page URLs: `/` is `200`; the 20 extensionless interior URLs are `404`.
- Homepage canonical is `https://tourvir.lk/index.html` while served at `https://www.tourvir.lk/`.
- Privacy duplicates Contact metadata; package metadata is the generic template.
- Live source includes `TravelAgency`, `TouristTrip` and `BlogPosting` JSON-LD.

### Live browser evidence

- Weather resolved to `Colombo: 29°C`.
- Currency resolved to USD/EUR/GBP LKR values.
- Counters resolved to `5,000+`, `50+`, `10+`, `98%`.
- Gallery has 10 entries; `asd` is broken (zero natural width).
- First gallery lightbox opened with a 1920px image.
- Cultural Triangle map initialized with six markers and nine loaded tiles.

### Lighthouse baseline

Command: `npm run test:lighthouse`

| Route          | Performance | Accessibility | Best Practices |  SEO |    CLS |
| -------------- | ----------: | ------------: | -------------: | ---: | -----: |
| `index.html`   |        0.70 |          0.94 |           0.96 | 1.00 |      0 |
| `gallery.html` |        0.83 |          0.94 |           0.96 | 1.00 | 0.0299 |
| `contact.html` |        0.81 |          0.95 |           0.96 | 1.00 | 0.0296 |

Lighthouse SEO 1.00 covers only its technical checklist; it does not prove indexing, rankings, content depth, authority or backlinks.

## Search Console follow-up — 2026-08-18

- Search Console identifies `https://tourvir.lk/` as the one excluded `Page with redirect`, last crawled 2026-08-13.
- Google documents this state as a non-canonical URL that redirects, so the source URL is not indexed while the redirect target is evaluated separately.
- Live `https://tourvir.lk/` returns permanent `308` to `https://www.tourvir.lk/`; the HTTP variants also redirect to HTTPS.
- This homepage exclusion is intentional and should remain a redirect to the preferred www canonical.
- Search Console also reports 20 `Discovered - currently not indexed` URLs, first detected 2026-08-15, with no last-crawled dates.
- Those 20 examples exactly match the incorrect apex, extensionless URLs still advertised by the production sitemap, including `/blog`, four `/blog/...` routes, nine top-level routes and seven `/packages/...` routes.
- Live verification confirms representative `/blog` ends at a `404`, while `/blog.html` reaches the real `200` page.
- The branch sitemap already advertises the correct HTTPS www `.html` URLs; 20 exact permanent legacy redirects were added so every Google-discovered URL preserves its route and reaches the matching canonical page.
- Protected Preview verification confirms all 20 old URLs return permanent `308` redirects to their exact `.html` destinations.
- Live `https://www.tourvir.lk/index.html` still returns `200` because Phase 1 has not been deployed.
- Do not start Search Console validation until the corrected sitemap and redirects are deployed to production.

## Regression gate

Each phase runs its relevant subset. Final Preview and production release run all commands:

```text
npm run format:check
npm run lint
npm run typecheck
npm run test:unit
npm run test:contract
npm run build
npm run check:html
npm run check:seo
npm run check:links
npm run check:content
npm run check:parity
npm run test:e2e
npm run test:a11y
npm run test:visual
npm run test:lighthouse
npm audit
```

Phase 1 must add automated checks that crawl every sitemap URL, compare final/canonical/sitemap/OG/schema URLs, detect unintended duplicate metadata, detect blocked/noindex routes, catch redirect loops/chains and validate representative JSON-LD.

## Known release blockers and environment notes

| Date       | Item                                                                                   | Status / next action                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-13 | Local shell initially used Node `22.23.2`/npm `10.9.8` instead of the project contract | RESOLVED — Node `24.18.0`/npm `11.16.0` installed through nvm; final gate must explicitly activate it                       |
| 2026-08-13 | npm reported 8 high-severity transitive development-tool advisories                    | RESOLVED LOCALLY — safe transitive updates plus Lighthouse `13.4.1`; current `npm audit` reports zero vulnerabilities       |
| 2026-08-13 | Actual Vercel redirect behavior cannot be proven from local configuration alone        | RESOLVED FOR PHASE 1 — protected Preview crawl passed; custom production-domain variants remain in the Phase 7 release gate |
| 2026-08-21 | Customer-approved business, package, destination and profile details not yet received  | BLOCKED-OWNER — Phase 3 factual expansion waits; independent trust, linking and performance work may continue               |

## Decision log

| Date       | Decision                                                                                | Reason                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 2026-08-13 | Isolate work on `seo-remediation`                                                       | Protect production and enable Preview verification                                                                 |
| 2026-08-13 | Prefer `https://www.tourvir.lk`                                                         | Current visitor host and apex redirect target                                                                      |
| 2026-08-13 | Preserve `.html` interior routes; homepage canonical `/`                                | Minimize migration risk and align discovery signals                                                                |
| 2026-08-13 | Reject FAQ rich-result and sitelinks-search-box promises                                | Obsolete/not applicable recommendations                                                                            |
| 2026-08-13 | Require owner approval for business facts                                               | Prevent fabricated content, reviews, credentials and policies                                                      |
| 2026-08-13 | Normalize the optional trailing slash on an origin-only sitemap URL during comparison   | `https://www.tourvir.lk` and `https://www.tourvir.lk/` identify the same root URL; all non-root paths remain exact |
| 2026-08-18 | Keep Vercel Preview protection enabled and verify through authenticated CLI access      | Validate the branch without exposing a private Preview or weakening deployment protection                          |
| 2026-08-21 | Remove or neutralize unsupported trust claims while owner evidence is unavailable       | Avoid publishing invented ratings, credentials, service guarantees or social profiles                              |
| 2026-08-22 | Link destination cards to fact-matched existing packages until owner pages are approved | Improve useful navigation without inventing destination landing-page content                                       |
| 2026-08-22 | Demand-load hero slides progressively from inert templates                              | Preserve the slider while preventing ten background images from competing with the LCP request                     |
| 2026-08-22 | Keep distinct full-resolution vehicle originals and compress tracked responsive media   | Preserve current visuals and fallbacks while reducing the files browsers normally request                          |
| 2026-08-22 | Redirect both retired Sigiriya URL forms directly to the new article                    | Preserve accumulated URL value without a redirect chain                                                            |

## Implementation and test log

| Date       | Phase | Change/check                                                    | Result              | Evidence/notes                                                                                                                 |
| ---------- | ----- | --------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 2026-08-13 | 0     | Created protected branch                                        | PASS                | `seo-remediation` from `34aff26`                                                                                               |
| 2026-08-13 | 0     | Read and reconciled all 42 PDF pages                            | PASS                | Findings SEO-001 through SEO-060 registered                                                                                    |
| 2026-08-13 | 0     | Live redirects/robots/sitemap/canonical checks                  | FAIL FOUND          | 20/21 sitemap page URLs 404; canonical conflict confirmed                                                                      |
| 2026-08-13 | 0     | Live widgets/counters/gallery/map checks                        | MIXED               | Widgets/counters/map work; one gallery entry broken                                                                            |
| 2026-08-13 | 0     | Local Lighthouse baseline                                       | PASS WITH FOLLOW-UP | Scores above; field CWV still needed                                                                                           |
| 2026-08-13 | 0     | Prepared customer information request                           | PASS                | Plain-text message created; no passwords requested                                                                             |
| 2026-08-13 | 0     | Added reusable SEO URL helpers and unit coverage                | PASS                | 44 unit tests across 9 files passed                                                                                            |
| 2026-08-13 | 0     | Proved new guard against the old output                         | EXPECTED FAIL       | Detected wrong origin, extensionless sitemap URLs, missing sitemap files and absent homepage redirect                          |
| 2026-08-13 | 0     | Phase 0 completion review                                       | COMPLETE            | Finding register, customer request, protected branch, baseline and executable URL gate are present                             |
| 2026-08-13 | 1     | Changed canonical origin to www and normalized homepage to `/`  | LOCAL PASS          | Typecheck and production build pass                                                                                            |
| 2026-08-13 | 1     | Serialized sitemap routes to deployed `.html` files             | LOCAL PASS          | SEO contract validates 21 sitemap routes against 21 indexable HTML files                                                       |
| 2026-08-13 | 1     | Aligned robots, OG/schema origins and internal Home links       | LOCAL PASS          | Link/content checks pass; legacy source scan leaves only intentional Vercel redirect source                                    |
| 2026-08-13 | 1     | Added permanent `/index.html` to `/` Vercel redirect            | LOCAL CONFIG PASS   | `check:seo` validates the version-controlled redirect; Preview HTTP verification still required                                |
| 2026-08-13 | 1     | Expanded HTML/link/content checks to nested generated routes    | PASS                | 23 HTML files link-checked; 22 public HTML files content-checked; recursive HTML validation passes                             |
| 2026-08-13 | 1     | Replaced obsolete legacy-source parity test                     | PASS                | 14 required outputs, 11 generated content routes and 176 public files verified                                                 |
| 2026-08-13 | 1     | Expanded HTML validation exposed previously hidden defects      | FAIL FOUND / FIXED  | Added CMS language, valid CORS attributes and a 60-character Kandy post SEO title; recursive check pass                        |
| 2026-08-13 | 1     | Rebuilt and ran URL/content/parity gate                         | PASS                | 21 sitemap/canonical routes, 23 link routes, 22 content routes, 176 public files                                               |
| 2026-08-13 | Cross | Queried current npm advisory database                           | FAIL FOUND          | 8 high advisories in development dependency chains; none are shipped browser runtime code                                      |
| 2026-08-13 | Cross | Applied non-breaking npm advisory resolutions                   | PASS                | brace-expansion, fast-uri, js-yaml and nanoid updated; remaining findings reduced from 8 to 4                                  |
| 2026-08-13 | Cross | Upgraded Lighthouse `12.6.1` to fixed `13.4.1`                  | LOCAL AUDIT PASS    | Node `24.18.0`, npm `11.16.0`; `npm audit --audit-level=high` reports zero vulnerabilities                                     |
| 2026-08-17 | 1     | Investigated GSC `Page with redirect` count of one              | EXPECTED / VERIFY   | Live apex redirects to www; exact GSC example URL requested before closure                                                     |
| 2026-08-17 | 1     | Full regression exposed obsolete port-4174 browser comparisons  | FAIL FOUND          | Deleted legacy comparison server no longer exists; site server itself was not the failure                                      |
| 2026-08-17 | 1     | Replaced legacy browser comparison with current route contracts | PASS                | 12/12 shell/generated-content browser contracts pass with a managed local static server                                        |
| 2026-08-17 | 1     | Replaced unreliable responsive `networkidle` readiness          | PASS                | 28/28 overflow checks pass at 320px, 390px, tablet and desktop widths                                                          |
| 2026-08-17 | 1     | Critical automated accessibility gate                           | PASS                | 4/4 home, gallery, contact and inquiry checks pass                                                                             |
| 2026-08-17 | 1     | Responsive visual-rendering gate                                | PASS                | 3/3 gallery screenshots are non-empty at mobile, tablet and desktop                                                            |
| 2026-08-17 | 1     | Lighthouse `13.4.1` compatibility and budgets                   | PASS WITH FOLLOW-UP | SEO 1.00 on all three routes; performance home 0.70, gallery 0.68, contact 0.81; gallery tracked in Phase 6                    |
| 2026-08-17 | 1     | Complete pinned-runtime regression gate                         | PASS                | `npm run validate`: 44 unit, 9 contract, 59 E2E, 4 accessibility and 3 visual tests; all build/content gates pass              |
| 2026-08-17 | Cross | Final security and diff-integrity gate                          | PASS                | `npm audit --audit-level=high` reports zero vulnerabilities; `git diff --check` is clean                                       |
| 2026-08-17 | 1     | Committed and pushed the verified implementation                | PASS                | Commit `51c185d` on `origin/seo-remediation`; `main` and production remained untouched                                         |
| 2026-08-17 | 1     | Vercel protected Preview build                                  | PASS                | Deployment `tourvir-j0o9gmu4i-nebulync.vercel.app` completed successfully                                                      |
| 2026-08-18 | 1     | Authenticated Preview sitemap crawl                             | PASS                | All 21 URLs declared by the deployed sitemap return `200`                                                                      |
| 2026-08-18 | 1     | Authenticated Preview homepage redirect                         | PASS                | `/index.html` returns permanent `308` to `/`                                                                                   |
| 2026-08-18 | 1     | Deployed robots and sitemap signal checks                       | PASS                | Sitemap index, 21-entry child sitemap and robots directive all use `https://www.tourvir.lk`                                    |
| 2026-08-18 | 1     | Deployed canonical and Open Graph URL checks                    | PASS                | Homepage `/` and representative `/packages.html` tags are exact, self-referencing and mutually consistent                      |
| 2026-08-18 | 1     | Phase 1 completion review                                       | COMPLETE            | Local regression and protected Preview gates passed; production/custom-domain verification remains in Phase 7                  |
| 2026-08-18 | 1     | Reconciled exact Search Console indexing examples               | FAIL FOUND          | Production sitemap advertises 20 apex extensionless URLs; representative `/blog` redirects to a final `404`                    |
| 2026-08-18 | 1     | Added exact legacy URL recovery redirects                       | LOCAL PASS          | 20 permanent extensionless-to-`.html` mappings; no wildcard redirects                                                          |
| 2026-08-18 | 1     | Expanded and ran the focused SEO URL contract                   | PASS                | Build passes; 21 sitemap routes, 21 indexable HTML files and all 20 legacy redirects validated                                 |
| 2026-08-18 | 1     | Deployed and authenticated the redirect follow-up Preview       | PASS                | Deployment `tourvir-r7c58k4wk-nebulync.vercel.app` completed successfully                                                      |
| 2026-08-18 | 1     | Crawled every Google-discovered extensionless URL on Preview    | PASS                | 20/20 return exact permanent `308` redirects to their matching canonical `.html` route                                         |
| 2026-08-18 | 1     | Search Console redirect follow-up completion review             | COMPLETE            | Source mappings, local contract and protected Preview behavior all passed                                                      |
| 2026-08-18 | 2     | Inventoried generated metadata and structured data              | FAIL FOUND          | Four duplicate legal/contact metadata sets; generic package descriptions; incomplete social/schema signals                     |
| 2026-08-18 | 2     | Replaced duplicate and generic metadata                         | LOCAL PASS          | 21/21 indexable pages now have unique titles and descriptions derived from existing visible content                            |
| 2026-08-18 | 2     | Standardized Open Graph and Twitter card metadata               | LOCAL PASS          | 21/21 pages have matching URLs, titles, descriptions, absolute images and image alt text                                       |
| 2026-08-18 | 2     | Added visible and JSON-LD breadcrumbs                           | LOCAL PASS          | 20/20 interior pages expose matching navigable BreadcrumbList paths                                                            |
| 2026-08-18 | 2     | Enriched existing business, trip and article entities           | LOCAL PASS          | One TravelAgency, seven TouristTrip and four BlogPosting entities align with canonical page data                               |
| 2026-08-18 | 2     | Removed unsupported aggregate-rating markup                     | LOCAL PASS          | Zero AggregateRating entities remain; visible rating claims stay blocked for owner proof or Phase 4 removal                    |
| 2026-08-18 | 2     | Ran focused Phase 2 quality gate                                | PASS                | Formatting, JS/CSS lint, build, HTML validation, SEO contract and diff integrity all pass                                      |
| 2026-08-20 | 2     | Committed and pushed the verified implementation                | PASS                | Commit `641d59d` on `origin/seo-remediation`; `main` and production remained untouched                                         |
| 2026-08-20 | 2     | Vercel protected Preview build                                  | PASS                | Deployment `tourvir-mh6g9b1to-nebulync.vercel.app` completed successfully                                                      |
| 2026-08-20 | 2     | Authenticated representative Preview verification               | PASS                | Home, privacy, package and blog routes return `200`; deployed metadata and schema assertions pass                              |
| 2026-08-20 | 2     | Phase 2 completion review                                       | COMPLETE            | Local generated-site gates and protected Preview verification passed; production remains reserved for Phase 7                  |
| 2026-08-21 | 3     | Deferred owner-dependent content expansion                      | BLOCKED-OWNER       | Customer request sent; no package, destination, About, guide, review or licence facts invented                                 |
| 2026-08-21 | 4A    | Removed test and unrelated gallery content                      | LOCAL PASS          | Deleted `asd`/logo entries and 1,154,056 bytes of assets used only by those entries; retained images relabelled                |
| 2026-08-21 | 4A    | Removed unsupported package ratings and review totals           | LOCAL PASS          | Public cards, catalogue types, seven JSON records and CMS package fields no longer expose unsupported counts                   |
| 2026-08-21 | 4A    | Removed dead social profiles and unsupported trust copy         | LOCAL PASS          | Generated chrome/contact retain verified Instagram only; licence, certification, insurance and 24/7 claims removed             |
| 2026-08-21 | 4A    | Replaced marketing counters with repository-derived counts      | LOCAL PASS          | Homepage and gallery display current package, vehicle, guide, image and category counts                                        |
| 2026-08-21 | 4A    | Added content regression guards                                 | PASS                | Generated output rejects dead `#` links, package ratings, SLTDA copy, test gallery content and count mismatches                |
| 2026-08-21 | 4A    | Ran focused local quality and browser gates                     | PASS                | Format, lint, typecheck, build, HTML, links, content and SEO pass; 31/31 responsive/visual browser checks pass                 |
| 2026-08-22 | 4A    | Rebuilt after deleting the two unused public assets             | PASS                | Final 22-page build, dist allowlist, content, link and diff-integrity checks pass; removed files are absent from dist          |
| 2026-08-22 | 4A    | Committed and pushed the verified implementation                | PASS                | Commit `d3539d0` on `origin/seo-remediation`; untracked user files, `main` and production remained untouched                   |
| 2026-08-22 | 4A    | Vercel protected Preview build                                  | PASS                | Deployment `tourvir-5w4g67mho-nebulync.vercel.app` completed successfully                                                      |
| 2026-08-22 | 4A    | Authenticated affected-route Preview verification               | PASS                | Home, packages, gallery, vehicles and contact return `200`; trust/gallery assertions pass                                      |
| 2026-08-22 | 4A    | Phase 4A completion review                                      | COMPLETE            | Focused local and protected Preview gates passed; remaining owner-dependent Phase 4 findings stay explicitly blocked           |
| 2026-08-22 | 5     | Added contextual navigation and conversion paths                | LOCAL PASS          | Three destination cards, seven package pages, four guides, vehicles and inquiry FAQ now form a tested link model               |
| 2026-08-22 | 5     | Rebuilt all four guide articles                                 | LOCAL PASS          | Introductions, two logical H2 sections, responsive covers and matching package/vehicle/inquiry links render                    |
| 2026-08-22 | 5     | Migrated the generic Sigiriya article URL                       | LOCAL PASS          | New `/blog/sigiriya-rock-fortress-guide.html`; both retired URL forms map directly with permanent redirects                    |
| 2026-08-22 | 5     | Added generated-content and URL regression contracts            | PASS                | All guide/package links, headings, destination cards, FAQ target, canonical route and retired redirects are enforced           |
| 2026-08-22 | 5     | Phase 5 completion review                                       | COMPLETE            | Build, HTML, SEO, local-link and content contracts pass across all 21 indexable routes                                         |
| 2026-08-22 | 6     | Improved vehicle comparison and widget fallbacks                | LOCAL PASS          | Sticky semantic row labels, named keyboard-scroll region, mobile hint, five-second API timeout and honest static copy          |
| 2026-08-22 | 6     | Demand-loaded the homepage hero                                 | LOCAL PASS          | Initial markup exposes one LCP image and ten inert templates; unit/browser request regressions pass                            |
| 2026-08-22 | 6     | Removed and compressed safe media                               | LOCAL PASS          | 11,668,518 duplicate/unused bytes deleted; 18 responsive vehicle files reduced by 462,476 bytes at visually checked quality 75 |
| 2026-08-22 | 6     | Ran final static and unit gates                                 | PASS                | Format, lint, typecheck, 22-page build, HTML/SEO/link/content/parity checks and 45/45 unit tests pass                          |
| 2026-08-22 | 6     | Ran focused responsive and accessibility browser gates          | PASS                | 18/18 checks pass: seven axe routes, home/vehicle overflow at four widths, hero/fallback/mobile behavior                       |
| 2026-08-22 | 6     | Rechecked the final destination-card layout                     | PASS                | 5/5 homepage hero and overflow checks pass at 320px, 390px, tablet and desktop widths                                          |
| 2026-08-22 | 6     | Measured affected routes with Lighthouse                        | PASS                | Home 0.87 performance, vehicle 0.81, Sigiriya guide 0.95; SEO 1.00, accessibility 0.94-0.95 and final vehicle CLS 0            |
| 2026-08-22 | 6     | Phase 6 completion review                                       | COMPLETE            | Performance, mobile, media and accessibility budgets pass; production remains untouched                                        |

## Current next action

Commit and push the verified Phase 5-6 batch to `seo-remediation`, then run the protected Vercel Preview smoke/redirect checks. Keep production untouched. Owner-dependent Phase 3, remaining Phase 4 trust inputs and Phase 7 production/GSC work remain separate.
