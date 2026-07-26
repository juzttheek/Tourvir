# Tourvir Website — Master Codebase Audit and Upgrade Plan

**Audit date:** 2026-07-26

**Repository:** `Tourvir`

**Current stack:** Static HTML, CSS and browser JavaScript; Firebase Hosting, Firestore and Storage; GitHub Pages deployment workflow

**Approved target stack:** Astro static output on Vercel; Cloudinary for gallery authoring/delivery; Formspree for contact, inquiry and feedback; no Firebase runtime, project dependency or deployment path

## 1. Executive summary

Tourvir is a brochure and lead-generation website for a Sri Lankan travel business. It contains a home page, tour packages, vehicle listings, gallery, trip inquiry flow, contact page, and legal pages. The UI is a responsive multi-page static site. Firestore is used for feedback, contact messages, and inquiries; Firestore plus Firebase Storage are used for a dynamic gallery and its administration.

The codebase is visually substantial but **not production-ready in its current state**. Static content can be deployed, but two conversion forms are broken, gallery administration is not secure, database/storage security rules are not version-controlled, and the hosting configuration has no explicit security or cache policy. There is also no build, lint, test, preview, or release-validation toolchain. The approved modernization removes Firebase entirely instead of repairing it as a permanent platform.

### Overall readiness score

| Area | Score | Assessment |
|---|---:|---|
| Product/content completeness | 6/10 | Main visitor journeys exist, but content and legal metadata need verification. |
| Functional correctness | 4/10 | Contact works in principle; inquiry and feedback submissions contain confirmed runtime-breaking ID mismatches. |
| Security/privacy | 2/10 | Public client-side “admin” password and privileged browser writes are release blockers. Rules are absent from the repository. |
| Architecture/modularity | 4/10 | Sensible page-specific CSS/JS exists, but shared markup and a 423-line global script are duplicated/coupled. |
| Performance | 5/10 | WebP and some lazy loading are present; the home page eagerly loads an 11-image hero and every page loads Firebase. |
| Accessibility | 5/10 | Basic labels and semantic headings exist, but modal/menu state, focus handling, reduced motion, and dynamic announcements are incomplete. |
| SEO/discoverability | 4/10 | Titles and descriptions exist, but canonical, Open Graph, structured data, sitemap and robots files are absent. |
| Testability/observability | 1/10 | No test runner, linting, monitoring, analytics initialization, error reporting, or form-delivery monitoring. |
| Deployment/operations | 3/10 | GitHub Pages workflow and Firebase config coexist without a declared source of truth; CI deploys without validation. |

**Release recommendation:** Do not launch paid campaigns or accept production customer data until all P0 items in section 12 are complete.

## 2. Audit scope and evidence

The repository contains 71 tracked/discoverable files, including:

- 9 HTML pages totaling roughly 3,400 lines.
- 9 CSS files totaling roughly 5,000 lines and 102 KB unminified.
- 6 JavaScript files totaling roughly 1,400 lines and 51 KB unminified.
- 45 WebP images totaling about 11.31 MiB.
- Firebase Hosting configuration and a GitHub Pages deployment workflow.

The audit used static inspection of all source/configuration files, local-reference checks, repository history/config review, and targeted cross-checks between HTML IDs and JavaScript selectors. All local `src`/`href` references found in HTML resolve. No runtime browser, Lighthouse, Firebase emulator, or automated test run was possible because the repository contains no tooling and Node.js is not installed in the audit environment. Performance values in this report are therefore design-level findings, not measured Core Web Vitals.

## 3. Current architecture

```text
Browser
  ├─ Static HTML pages
  ├─ Shared CSS + page CSS
  ├─ Shared main.js + optional page script
  ├─ Google Fonts
  └─ Firebase compat SDK from gstatic
       ├─ Firestore: contacts, feedback, inquiries, gallery_images
       └─ Storage: gallery uploads

Deployment definitions
  ├─ Firebase Hosting: publishes repository root
  └─ GitHub Actions: publishes repository root to GitHub Pages
```

There is no application server or trusted API layer. This is acceptable for public read-only content, but unsafe for the current administrative operations and direct database writes. Browser “threads” do not provide security or database concurrency control. The approved target avoids both problems: Cloudinary owns authenticated media administration, Formspree owns managed form intake and spam controls, and the public site stays static on Vercel.

### Approved target architecture

```text
Visitor browser
  ├─ Vercel CDN → immutable Astro static assets + revalidated HTML
  ├─ Cloudinary CDN → tagged gallery metadata + responsive transformed images
  └─ Formspree → separate contact, inquiry and feedback forms
                   ├─ domain restriction + bot/spam protection
                   └─ managed submission dashboard + staff notifications

Client editor
  └─ Cloudinary Media Library (MFA; no Tourvir admin page)

Deployment
  └─ Git → Vercel Preview → validated Production deployment
```

There is no Tourvir application server or database in the target. Firebase Hosting, SDKs, Firestore, Storage, rules, configuration and deployment automation are removed after legacy data is exported or explicitly approved for disposal.

## 4. What is already good

- Images are already converted to WebP, and most below-the-fold images use `loading="lazy"`.
- Page-specific styles and scripts have started to separate gallery, packages, inquiry, contact, vehicles, and home concerns.
- Most external links opened in a new tab use `rel="noopener noreferrer"`.
- Forms use basic HTML input types and required fields in several places.
- Scroll-reveal logic uses `IntersectionObserver`, which is preferable to continuous geometry checks.
- Scroll listeners are passive.
- Firebase timestamps use server timestamps when Firebase is present.
- The site has responsive breakpoints, light/dark themes, descriptive image alt text in many key locations, and one `h1` per page.
- No broken local asset/page links or duplicate IDs were found in the static HTML scan.

These are useful foundations, but they do not offset the release blockers below.

## 5. Critical and high-priority findings

### P0 — Gallery administration is not authentication

`js/gallery-admin.js` ships the SHA-256 hash of the password and explicitly documents the default password as `tourvir2026`. Anyone downloading the public JavaScript can recover/read that default and invoke the same Firestore/Storage operations. The `isAdmin` flag only changes browser UI; it is not an authorization boundary.

The same public page uploads and deletes Storage objects and creates/deletes `gallery_images` documents. No `firestore.rules` or `storage.rules` files are committed, so the effective production access rules cannot be reviewed, tested, or deployed reproducibly.

**Required fix:** Remove the admin panel and admin bundle from the public gallery and rotate the exposed/default password immediately. Use the authenticated Cloudinary Media Library described in Section 7 and Phase 8, with no privileged gallery capability in Tourvir's public bundle. Audit existing Firebase logs/data, migrate or disposition retained assets, then decommission Firebase.

### P0 — Inquiry submission is broken

`js/inquiry.js` submits fields with IDs `destinations`, `duration`, `date`, `name`, and `special-requests`, among others. The rendered form instead uses IDs such as `full-name`, `arrival-date`, `departure-date`, and `special-requirements`. Accessing `.value` on the missing elements throws a `TypeError`, so the Firestore write is never reached.

**Required fix:** Define one form schema, make HTML names/IDs and the serializer match, validate every step and date relationship, add a submit-state/error test, and use `FormData` or a schema-based serializer to reduce selector drift.

### P0 — Home feedback submission is broken

`js/main.js` reads `feedback-email`, but `index.html` provides `feedback-country`. Submission throws before Firestore is called.

**Required fix:** Decide whether country or email is required, align HTML and the stored schema, and cover the successful and failed submission paths with an end-to-end test.

### P0 — Public forms have no trusted anti-abuse boundary

Contact, feedback, and inquiry documents are written directly from anonymous browsers. HTML validation is bypassable. Depending on deployed rules, this permits spam, unexpected fields, oversized payloads, cost amplification, and possibly unwanted reads/writes. The UI also reports success when Firebase is unavailable, even though no data was delivered.

**Required fix:** Submit each form to a dedicated Formspree form ID. Keep HTML/client schema validation, configure allowed domains plus honeypot and Turnstile/reCAPTCHA protection, cap field lengths, and show success only after Formspree confirms acceptance. Verify submissions in the managed dashboard and route notifications to named staff. Do not keep a public or private Tourvir database merely for these leads.

### P0 — Deployment configuration can publish unintended files

Both Firebase and GitHub Pages publish `.` (the repository root). Firebase ignores dotfiles and `node_modules`, but GitHub Pages uploads the entire checked-out root. Once reports, source maps, tests, environment templates, or operational files are added, they may become public. Two deployment targets also create ambiguity about the canonical domain and rollback process.

**Required fix:** Make Vercel the only production host, build into `dist/`, and deploy only the static build. Use Vercel Preview deployments for pull requests and a protected Production deployment; disable Firebase Hosting and GitHub Pages after domain cutover.

### P1 — No version-controlled data security policy

The repository lacks `firestore.rules`, `storage.rules`, and indexes. This is an operational and security gap even if safe rules happen to exist in the Firebase Console.

**Required fix:** Treat this as a legacy containment issue, not a reason to keep Firebase. Freeze or deny old access during migration where authorized; export or explicitly disposition required data; then delete all Firebase client code/configuration and decommission the project. The final site has no Firestore/Storage policy because it has no Firestore/Storage dependency.

### P1 — Untrusted Firestore data is inserted with `innerHTML`

Gallery titles, locations, URLs, categories, and storage paths are interpolated into `innerHTML` in `gallery-admin.js`. If an attacker can create/modify a document, stored cross-site scripting or attribute injection is possible.

**Required fix:** Build elements with `createElement`, assign user content with `textContent`, validate URL protocols, constrain categories, and validate the Cloudinary response contract before rendering. A Content Security Policy is defense in depth, not a substitute.

### P1 — Legal pages have incorrect titles

`cookies.html`, `privacy.html`, and `terms.html` all use the title “Contact Us — Tourvir | Get in Touch”. This damages search snippets, browser history, and legal-page clarity.

**Required fix:** Give every page a unique correct title/description and verify the legal text, business identity, data retention, Formspree/Cloudinary/Vercel processing, cookie behavior, and contact details with the business/legal owner.

### P1 — Contact data appears to be placeholder data

`+94 77 123 4567` and `wa.me/94771234567` are repeated across the site. Confirm ownership before launch. Shared business data is copied into many pages, so one correction requires many edits.

## 6. Architecture and modularity audit

### Current problems

1. Every page duplicates the sidebar, header, footer, floating actions, Firebase scripts, and large inline SVG icons. This creates content drift and unnecessarily large HTML.
2. `main.js` combines theme, navigation, scroll behavior, toast rendering, counters, carousel, feedback, hero, and contact form logic. It also registers multiple `DOMContentLoaded` handlers and multiple scroll listeners.
3. `gallery-admin.js` combines authentication UI, uploads, deletes, Firestore queries, rendering, filtering, lightbox integration, and animation.
4. Gallery behavior is initialized in both `gallery.js` and `gallery-admin.js`; the latter clones filter controls to discard old listeners. This is fragile and can invalidate references/accessibility state.
5. CSS responsibility overlaps among `style.css`, `components.css`, `sidebar.css`, and page files. There are 170+ inline `style` attributes across the HTML pages.
6. Data for packages, vehicles, contact details, navigation, and footer content is embedded in markup rather than maintained once.
7. Version query strings are inconsistent (`?v=2`, `?v=4`, or none) and manually managed.

### Recommended target

For this content-heavy site, **Astro with TypeScript** is the preferred upgrade: it produces static HTML by default, supports reusable layouts/components and content collections, optimizes assets, and only hydrates interactive islands. An alternative with less migration is Vite + Nunjucks/Eleventy. A client-heavy SPA is not recommended; it would add JavaScript without improving the brochure-site use case.

### Recommended folder structure

```text
tourvir/
├─ public/
│  ├─ favicon.svg
│  ├─ robots.txt
│  └─ static/                 # files copied unchanged
├─ src/
│  ├─ assets/
│  │  ├─ images/
│  │  └─ icons/
│  ├─ components/
│  │  ├─ layout/             # Header, Sidebar, Footer, FloatingActions
│  │  ├─ forms/              # fields, errors, status, stepper
│  │  ├─ gallery/
│  │  ├─ packages/
│  │  └─ ui/                 # Button, Card, Modal, Toast
│  ├─ content/
│  │  ├─ packages/
│  │  ├─ vehicles/
│  │  ├─ legal/
│  │  └─ site.ts             # contact details, navigation, social links
│  ├─ layouts/
│  │  └─ BaseLayout.astro
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ packages.astro
│  │  ├─ vehicles.astro
│  │  ├─ gallery.astro
│  │  ├─ inquiry.astro
│  │  ├─ contact.astro
│  │  └─ legal/
│  ├─ scripts/
│  │  ├─ theme.ts
│  │  ├─ navigation.ts
│  │  ├─ carousel.ts
│  │  └─ forms/
│  ├─ services/
│  │  ├─ forms.ts
│  │  └─ gallery.ts
│  ├─ styles/
│  │  ├─ tokens.css
│  │  ├─ global.css
│  │  ├─ utilities.css
│  │  └─ components/
│  ├─ config/
│  │  └─ forms.ts            # public Formspree form IDs per environment
│  └─ env.d.ts
├─ tests/
│  ├─ unit/
│  └─ e2e/
├─ vercel.json               # redirects and explicit response headers
├─ .env.example
├─ package.json
├─ tsconfig.json
├─ astro.config.mjs
├─ eslint.config.js
├─ prettier.config.mjs
└─ README.md
```

Keep the public build independent of both managed content services. If migration must be incremental, first introduce a build system and shared templates while retaining the current URLs, then migrate page by page. Formspree form IDs and Cloudinary delivery identifiers are configuration; vendor API secrets must never enter the client bundle.

## 7. Performance, caching and concurrency

### Images and Core Web Vitals

- The home hero includes 11 images without lazy loading. They total several MiB and can all compete with the first visible image. Load only the initial slide eagerly; fetch/preload the next slide after idle or just before transition.
- The largest individual files are about 0.9 MiB. Generate responsive AVIF/WebP variants and use `srcset`/`sizes`.
- Add explicit `width` and `height` or `aspect-ratio` to prevent layout shifts.
- Give the primary hero image `fetchpriority="high"`; lazy-load below-the-fold content and use `decoding="async"` where suitable.
- Do not lazy-load immediately visible page heroes. The legal-page hero currently is lazy-loaded.
- Consider reducing the hero rotation count; 11 full-bleed images adds network, decode memory, and GPU work for limited user value.

### JavaScript/network

- Remove Firebase App, Firestore, Storage and initialization scripts from every page. No Firebase module belongs in the final bundle.
- Use `defer`/ES modules and content-hashed filenames produced by the build.
- Debounce package search for a larger data set; for the current six cards it is not a bottleneck.
- Replace the two global scroll listeners with one `requestAnimationFrame`-throttled coordinator or observers.
- Pause carousels/sliders while the tab is hidden, on pointer hover/focus, and when `prefers-reduced-motion` is enabled. Clear intervals when components are removed.
- Read the theme before first paint in a tiny head script or use `color-scheme` to avoid a flash; guard `localStorage` access because it may throw in restricted contexts.

### Caching strategy

Use content hashing so immutable assets can be cached for one year safely. HTML should revalidate quickly.

| Resource | Suggested policy |
|---|---|
| Hashed JS/CSS/images/fonts | `public, max-age=31536000, immutable` |
| HTML | `public, max-age=0, must-revalidate` or short CDN TTL with stale-while-revalidate |
| `robots.txt`, sitemap | Short TTL, e.g. one hour |
| User/private API responses | `no-store` |
| Public gallery metadata | Short CDN/client cache with ETag; invalidate on admin mutation |

Configure explicit Vercel response headers and verify them from Preview and Production URLs. Vercel serves static files from its edge cache; content-hashed assets remain immutable while HTML revalidates. A service worker is optional and should come only after HTTP caching is correct; a stale HTML/service-worker deployment bug is more damaging than the modest repeat-visit benefit for this site.

### Gallery and form data handling

- Replace the current Firestore collection read with Cloudinary's tagged public asset list; validate metadata, use a stable sort, initially render 12–18 assets and progressively reveal more.
- Store thumbnail, display, and original variants; serve the smallest suitable variant.
- Keep gallery publication atomic at the content level: an asset appears publicly only after required metadata and the publication tag are present.
- Prevent double-submit in the browser and treat only a confirmed Formspree response as accepted. Do not automatically retry personal-data submissions without an explicit idempotency guarantee.
- Configure allowed upload types/sizes in Cloudinary and length/field constraints plus spam protection in Formspree. Client validation improves UX but is not the only control.
- Apply documented retention/export/deletion policies to Formspree submissions and Cloudinary originals/backups.

### Threads and workers

The current page does not need general Web Workers. Filtering six cards and normal DOM interactions are cheap. The browser main-thread priorities are reducing image decode work, duplicated listeners, layout/repaint work, and unnecessary SDK parsing. Cloudinary performs image transformation outside the browser, so no upload-compression worker is needed. Submission concurrency is handled with disabled submit state, abort timeouts and provider-confirmed responses—not JavaScript threads.

### Recommended simple gallery workflow (preferred over a website admin panel)

The public tourism website does **not** need to become a general web application just because the client needs to add photographs. Content management can be a separate managed service. The preferred low-maintenance design is:

```text
Client
  → signs in to a hosted media library (not the Tourvir website)
  → drags photos into the Tourvir Gallery folder
  → adds title, alt text, category, location and display order
  → applies/preserves the `tourvir-gallery` tag

Public Tourvir gallery
  → requests the public JSON list for the `tourvir-gallery` tag
  → sorts and filters the returned metadata
  → renders attractive responsive cards/lightbox
  → requests optimized image sizes from the image CDN
```

**Recommended service for this exact requirement: Cloudinary Media Library.** The client uses Cloudinary's own authenticated dashboard to upload, replace, reorder or delete images; there is no admin password, upload form, Firebase Storage write access, or delete button in the public Tourvir bundle. Cloudinary supports folders, tags, contextual/structured metadata and an editor-friendly upload UI. Its client-side asset-list delivery endpoint can return public assets carrying a chosen tag, including dimensions and metadata, and that JSON is cached for approximately 60 seconds. For a tourism gallery well below the documented 1,000-asset client-list limit, this removes the need for a custom backend listing endpoint.

The website should render Cloudinary transformation URLs with `srcset` and `sizes`, automatic format and quality, fixed aspect ratios, lazy loading below the fold, and a blurred/color placeholder. This lets one original upload produce lightweight thumbnail, card and lightbox variants without asking the client to resize files manually.

#### Client publishing experience

Give the client a one-page operating guide:

1. Open the Cloudinary Media Library login link.
2. Open the `tourvir/gallery` folder.
3. Drag and drop images (phone uploads are acceptable).
4. Complete required fields: **Title**, **Alt text**, **Category**, **Location**, and **Order**.
5. Confirm the `tourvir-gallery` tag and mark **Published** if a publication field is configured.
6. Wait up to roughly one minute and refresh the Tourvir gallery.

Use controlled category choices rather than free text. The public page should ignore assets that lack the expected gallery tag, are not marked published, have an invalid URL/type, or are missing required accessibility metadata. Sort by numeric `Order`, then creation date. Keep a featured flag for the first/larger masonry items.

#### Attractive public presentation

- Use a responsive masonry-like CSS grid with two or three card aspect ratios, but reserve dimensions to avoid layout shift.
- Generate a consistent focal crop for cards while opening a larger contain-fit version in the lightbox.
- Keep category pills, caption/location overlays, keyboard lightbox navigation and swipe navigation.
- Initially render 12–18 images and progressively reveal more; do not decode the entire library at page load.
- Preload only the first visible gallery image; lazy-load the rest.
- Provide a tasteful empty/error state and keep a small curated local fallback set if the media service is unavailable.
- Use `textContent` and validated metadata when building cards; never interpolate remote metadata into `innerHTML`.

#### Security and operational boundaries

- Do **not** embed an unsigned public upload widget on the tourism site. Uploads happen inside the vendor's authenticated Media Library account.
- Give each editor an individual account with the minimum role available; enable MFA and remove access when staff change.
- The public asset-list endpoint exposes only the metadata selected for already-public gallery assets. Do not place confidential data in image metadata.
- Keep original photos backed up outside the delivery service and document account ownership/billing.
- Configure usage/budget notifications and review current plan limits before launch.

#### When to choose another option

| Requirement | Better choice |
|---|---|
| Images only, simple captions/categories, immediate publishing | Cloudinary Media Library + tagged public list (**recommended now**) |
| Client will soon edit packages, prices, vehicles, pages and SEO too | A headless CMS such as Sanity Studio, with its image CDN |
| No third-party media platform is acceptable | Keep images/content in Git and rebuild the static site; this loses client self-service but does not reintroduce Firebase |
| Updates are rare and a developer controls every release | Keep images/content in Git and rebuild the static site; simplest infrastructure but not client-self-service |

Sanity is a good future option if Tourvir needs broad content management because its Studio generates editing forms from schemas and its asset CDN processes and caches images. It is unnecessary overhead if the only editable content is a photo gallery. Start with the smallest workflow that satisfies the client; do not build a custom CMS preemptively.

#### Migration from the current implementation

1. Export existing Firebase gallery originals/metadata, or record explicit owner approval that there is no required data and it may be discarded.
2. Create the managed media account, folder, editor users, required metadata fields and gallery tag.
3. Import existing images and normalize captions/categories/order.
4. Replace the Firestore gallery query with one read-only tagged-list adapter and Cloudinary URL builder.
5. Retain the existing visual gallery/filter/lightbox components, but render safely from the adapter.
6. Remove `gallery-admin.js`, the public admin HTML/CSS, Firebase Storage SDK, password hash and gallery write/delete code.
7. Freeze old Firebase gallery writes, verify the live asset list, then decommission Storage and the Firebase project after the approved export/disposition and retention gate.

This approach keeps Tourvir a mostly static website. Only the gallery data is fetched as public content; there is no login state or privileged capability on the visitor-facing site.

## 8. Security, privacy and reliability upgrades

### Minimum security architecture

1. No privileged gallery authoring in the visitor-facing site. Use individual Cloudinary Media Library editor accounts with MFA and minimum roles.
2. Keep Formspree and Cloudinary accounts business-owned, grant individual least-privilege access, enable MFA where supported, and document offboarding/recovery.
3. Use a separate Formspree form ID for contact, inquiry and feedback; restrict accepted domains and configure honeypot plus Turnstile/reCAPTCHA protection.
4. Strict form schemas: approved field names, types, lengths, enumerations, consent and safe errors. Never put personal data in URLs, analytics or client logs.
5. Treat public Formspree form IDs and Cloudinary delivery identifiers as identifiers, not secrets; keep vendor account/API secrets out of Git and `dist/`.
6. Security headers: CSP, HSTS on the canonical HTTPS domain, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and framing protection via CSP `frame-ancestors`.
7. Avoid inline event handlers and inline style/SVG patterns that force a weak CSP. Packages currently has an inline `onclick`, and toast markup uses inline `onclick`.
8. Dependency updates through Dependabot/Renovate and pinned/locked build dependencies.
9. Secret scanning plus separate Formspree test/production form configuration and Vercel Preview/Production environment variables.
10. Audit/alerts for editor or account changes, form-delivery failures, spam spikes, Cloudinary usage and Vercel deployment failures/budget thresholds.

### Reliability fixes

- Show success only after confirmed persistence/delivery.
- Add request timeouts with `AbortController`, retry only safe/idempotent operations, and distinguish offline, validation, permission, rate-limit, and server errors.
- Preserve form input after failures; prevent double submission; provide a visible status region with `aria-live`.
- Configure Formspree staff notifications and reconcile them against its submission dashboard. A browser success message without a provider-accepted submission is not operationally complete.
- Add Formspree submission export/retention/deletion and Cloudinary original backup policies; test the procedures before launch.

## 9. Accessibility, SEO and quality

### Accessibility

- Add `aria-expanded`/`aria-controls` to hamburger, accordion, and modal controls and keep state synchronized.
- Implement focus trapping and focus restoration for sidebar, lightbox, and admin dialogs; give dialogs names and `role="dialog"`/`aria-modal="true"` where appropriate.
- Make gallery items keyboard-operable and preserve logical lightbox indexing after filters/dynamic inserts.
- Add visible `:focus-visible` styles across links, buttons, form controls and custom cards.
- Respect `prefers-reduced-motion` for smooth scrolling, reveal effects, counters, sliders, carousels, and filter animations.
- Pause autoplay on hover/focus and provide carousel status/control.
- Use explicit `<label for>` relationships consistently; add `autocomplete` attributes to contact details; associate validation errors with fields.
- Test contrast in both themes at 200% zoom and keyboard-only operation.

### SEO and sharing

- Add canonical URLs, Open Graph/Twitter metadata, and a consistent production origin.
- Add `Organization`/`TravelAgency`, breadcrumb, and applicable offer/tour structured data, but only for truthful visible content.
- Generate `sitemap.xml` and `robots.txt`; add a useful `404.html`.
- Correct legal-page metadata and ensure each page has unique title/description.
- Use semantic internal URLs in the eventual build while retaining redirects from current `.html` URLs.
- Validate marketing claims, prices, reviews, contact information, and image licenses.

### Code quality and testing

Adopt TypeScript in strict mode, ESLint, Prettier, Stylelint, HTML validation, and a spell/link checker. Add:

- Unit tests for form serialization/validation, package filtering, URL sanitization, and gallery mapping.
- Contract/unit tests for the Formspree adapter and mocked accepted, validation, rate-limit, timeout and provider-failure responses.
- Playwright end-to-end tests for navigation, theme persistence, contact success/failure, inquiry completion, feedback submission, gallery filters/lightbox, and absence of public admin capability.
- Automated accessibility checks with axe plus manual keyboard/screen-reader checks.
- Lighthouse CI budgets for LCP, CLS, INP, accessibility, SEO, and transferred bytes.
- Visual regression tests for desktop/mobile and light/dark themes.

## 10. Motion and interaction design direction

The current site has many isolated hover transitions, generic reveal classes, an image slider, counters, bouncing/pulsing controls and floating particles. The volume is not the main problem; the motion lacks a recognizable Tourvir idea. Adding more unrelated fades, spins and bounces would make the experience busier rather than more premium.

### Recommended creative concept: “The Sri Lankan Journey”

Use motion to make the visitor feel that they are moving through Sri Lanka. The signature visual should be a fine route line inspired by a journey on a map. It can travel between landmarks, section headings and itinerary stops, with a small moving location marker. Supporting movement should feel like landscape photography: slow, warm, layered and confident.

```text
Arrive          Explore              Trust              Plan
Hero reveal  →  destinations  →  packages/vehicles  →  inquiry CTA
                  └──────── animated journey line ────────────┘
```

Limit each viewport to one dominant motion idea. Important content and calls to action should settle quickly enough to read and click.

### Signature home-page sequence

1. **Cinematic hero entrance:** reveal the first photograph through a soft vertical mask, then animate the heading by line (not by every character). Bring in the primary CTA last. Keep the complete entrance near 1.2–1.5 seconds.
2. **Subtle living photograph:** apply a very slow 1.02–1.06 scale and 8–16 px directional pan to the active hero only. Use three excellent hero images rather than loading and rotating all eleven.
3. **Depth without heavy parallax:** move the foreground title, middle decorative route line and background image at slightly different small ranges. Disable this on touch devices and for reduced motion.
4. **Scroll invitation:** replace the infinite bouncing control with a small line that fills downward once, then becomes static.
5. **Journey-line story:** as destination/service sections enter, draw an SVG route through three or four highlighted Sri Lankan locations. Landmark dots can reveal their label and photograph in sequence.
6. **Final conversion handoff:** let the journey line terminate visually at “Plan Your Trip,” so the animation supports the booking funnel rather than ending as decoration.

### Page-specific ideas

#### Home

- Reveal section headings with a restrained clipped-line motion; stagger supporting text and cards by 50–80 ms.
- Let service-card photos pan 2–3% on hover while the icon moves a few pixels along the route motif.
- Animate statistics only once when visible, but reduce counter duration and never delay the real number for screen readers.
- Change testimonials with a short crossfade and 8–12 px horizontal movement. Pause autoplay on hover, focus and hidden tabs.
- Replace the current generic floating particles with two or three brand-specific route/leaf accents, or remove them entirely on mobile.

#### Packages

- On filter changes, animate cards into their new layout using a FLIP-style transition rather than hiding them and replaying the same fade.
- Use a photo curtain reveal when a card first enters the viewport.
- On hover/focus, lift the card by only 3–4 px, slightly zoom the photograph and draw a short itinerary line between the duration and location details.
- When a package is opened, use a shared-image transition from the card into its detail view where supported.
- Animate price/duration filter-result counts immediately so visitors understand the result set changed.

#### Gallery

- Use a masonry cascade: first visible row appears together, later items reveal in short row-level staggers. Do not stagger dozens of images one at a time.
- Morph/reposition cards smoothly when changing categories instead of flashing the grid.
- Open the lightbox with a shared-element image transition so the selected thumbnail appears to expand into place. The browser View Transition API can progressively enhance both same-page state changes and multi-page navigation.
- Crossfade from the low-resolution card asset to the larger lightbox asset and prefetch only the previous/next images.
- Add gentle swipe resistance and a small caption transition on mobile; retain keyboard arrows and focus management.

#### Vehicles

- Use a thin road/center-line motif beneath the vehicle filters or section title.
- Reveal vehicle photography horizontally in the direction of travel, then settle the text vertically.
- On hover, pan the vehicle image a few pixels rather than rotating the whole card; aggressive 3D effects would reduce the professional chauffeur-service feeling.
- Animate capacity/luggage icons in a short stagger only on the first reveal.

#### Inquiry

- Treat the form as a journey: a route-progress line connects the steps, and the active map pin advances when validation succeeds.
- Next steps slide 16–24 px left; previous steps slide right. Keep duration around 240–320 ms so the form remains fast.
- Animate validation beside the specific field; do not shake the entire form.
- Make selected interests feel tactile with a quick border fill/checkmark, not a large scale bounce.
- On confirmed submission, animate a small route from Sri Lanka to a checkmark while showing the real reference number. Never play success motion before persistence is confirmed.

#### Contact and legal pages

- Keep legal pages nearly static. A short hero fade and section navigation highlight are enough.
- On the contact page, progressively reveal contact methods and use a one-time map-pin settle. Avoid permanent pulsing because it competes with the form.
- Give submit buttons clear state transitions: idle → sending progress → confirmed checkmark or actionable error.

### Global polish and microinteractions

- Use cross-document View Transitions as progressive enhancement for page changes, with a 200–300 ms brand-color veil and a shared Tourvir logo. Unsupported browsers should navigate normally.
- Animate the navigation active indicator as one moving underline/pill rather than separately fading each link.
- Give buttons a directional background sweep and 1–2 px press state. Avoid “magnetic” buttons on touch devices.
- Animate theme changes with a small icon morph and color transition; do not apply long transitions to every element.
- Use skeleton aspect-ratio blocks only for remotely loaded gallery images, then crossfade the decoded image in.
- Prefer tasteful empty states: a small route ending at a camera icon for an empty gallery, with clear text.

### Motion tokens

Define and reuse a small motion system instead of hard-coded durations throughout the CSS:

```css
:root {
  --motion-instant: 120ms;
  --motion-fast: 180ms;
  --motion-base: 280ms;
  --motion-reveal: 650ms;
  --motion-cinematic: 1200ms;
  --ease-standard: cubic-bezier(.2, .8, .2, 1);
  --ease-emphasized: cubic-bezier(.16, 1, .3, 1);
  --stagger-item: 70ms;
}
```

Use `transform` and `opacity` for most movement. Replace `transition: all` with explicit properties; the repository currently uses `transition: all` in many components. Apply `will-change` only immediately before expensive movement and remove it afterward.

### Implementation technology

- Use CSS transitions/keyframes and the existing `IntersectionObserver` for most reveals and microinteractions.
- Use the View Transition API as optional progressive enhancement for lightbox/shared-image and multi-page transitions; it supports both same-document and multi-page cases, but behavior must degrade normally where unsupported.
- CSS scroll-driven animation timelines are suitable as an enhancement for the SVG route line, but currently require a fallback because browser support is not universal.
- Add GSAP/ScrollTrigger only if the route-story sequence cannot be achieved maintainably with native features. One carefully designed timeline can justify the dependency; ordinary card reveals cannot.
- Do not introduce WebGL/Three.js for the current site. It would add download, GPU, accessibility and maintenance cost without improving the core travel-booking journey.

### Performance and accessibility motion budget

- Target smooth compositor-friendly animation and test on a mid-range Android device, not only desktop hardware.
- Never animate layout-heavy properties such as `top`, `left`, `width` or large blurs continuously when a transform can express the effect.
- Stop all autoplay when `document.hidden` is true; do not run off-screen infinite animations.
- Keep above-the-fold animation code and CSS small. Load advanced gallery motion only on the gallery page.
- Provide a complete `prefers-reduced-motion: reduce` mode: no parallax, smooth scrolling, autoplay, route drawing, particle motion, Ken Burns effect or long page transitions. State changes must remain immediate and understandable.
- Motion must never postpone navigation, hide essential text for long periods, trap focus, or make form completion slower.

### Recommended motion rollout

**Phase 1 — high impact, low risk:** central motion tokens, reduced-motion mode, refined hero entrance, card stagger, button states, directional inquiry steps and gallery crossfade.

**Phase 2 — signature identity:** SVG Sri Lanka journey line, package FLIP filtering, shared-element gallery lightbox and progressive page transitions.

**Phase 3 — field-tested polish:** tune timing and disable effects that hurt Core Web Vitals, conversion, battery use or usability based on real-device and user testing.

## 11. Responsive design master plan

### Objective and acceptance standard

Tourvir should behave as one fluid design system rather than a desktop layout with a few shrinking breakpoints. Every page must remain readable, attractive and fully operable from a **320 CSS-pixel-wide viewport through ultrawide displays**, in portrait and landscape, with browser zoom and enlarged text. Content must not overlap, disappear behind fixed controls, be clipped, or require page-level horizontal scrolling.

Use WCAG 2.2 Reflow as the minimum: ordinary content must work at an equivalent width of 320 CSS pixels without loss of information/functionality or two-dimensional page scrolling. Horizontal scrolling remains acceptable only inside an intentionally scrollable component such as filter pills, and every item inside it must still fit/read at the narrow width.

### Current responsive risks found in this repository

- `overflow-x: hidden` is applied globally. This can conceal overflow defects instead of fixing the element that causes them.
- The mobile header attempts to fit hamburger, full logo, theme button and CTA in one row. At 320 px, long/localized labels or 200% text can collide.
- Several components use fixed heights (`220`, `280`, `320`, `400`, `450` px), so text/image balance can fail with zoom, different captions or landscape orientation.
- The sidebar uses `height: 100vh`, which can be obscured by changing mobile browser chrome; it needs dynamic/small viewport units and safe-area padding.
- Floating contact buttons, back-to-top, gallery admin trigger, toasts and mobile browser UI occupy fixed corners. Their offsets are unrelated and can overlap each other or cover page actions.
- Toasts have `min-width: 300px`; this leaves almost no safe margin at a 320 px viewport.
- Vehicle cards declare `min-width: 280px`; combined with container gaps/padding this is fragile at the minimum width and high zoom.
- Many responsive rules are repeated across global/component/page files at 1024, 768, 600 and 480 px. The cascade makes the final behavior hard to reason about.
- Most hover effects also apply on touch-capable devices even though persistent hover does not exist there.
- The gallery/lightbox, hero and cards rely on fixed image heights rather than responsive aspect-ratio/art direction.
- Existing mobile layouts mostly collapse to one column, but intermediate tablet, landscape phone, split-screen and ultrawide compositions do not have a consistent design strategy.

### Foundation: mobile-first fluid system

Build the base CSS for the narrowest supported layout first, then add space-driven enhancements. Breakpoints should be introduced where content stops fitting, not because a specific phone model has that width.

```css
:root {
  --page-gutter: clamp(1rem, 3vw, 2rem);
  --section-space: clamp(3rem, 7vw, 7rem);
  --content-max: 80rem;
  --reading-max: 68ch;
  --card-min: 17rem;
}

*, *::before, *::after { box-sizing: border-box; }

html { min-inline-size: 20rem; }

body { margin: 0; }

img, video, svg {
  display: block;
  max-inline-size: 100%;
}

.container {
  inline-size: min(100% - 2 * var(--page-gutter), var(--content-max));
  margin-inline: auto;
}

.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--card-min)), 1fr));
  gap: clamp(1rem, 2vw, 1.75rem);
}

:where(.grid > *, .flex > *) { min-inline-size: 0; }

:where(h1, h2, h3, p, a, button, label) {
  overflow-wrap: anywhere;
}
```

Do not keep `overflow-x: hidden` as the solution. Remove it during development, identify every overflowing element, fix its sizing/wrapping, then use `overflow: clip` only on visual-effect wrappers that intentionally paint outside their bounds.

### Responsive tiers

These are test/design modes, not device detection rules. Components should use container queries when their own available width is what matters.

| Available width | Intended composition |
|---:|---|
| 320–359 px | Minimum/reflow mode: one column, compact header, full-width actions, no decorative side content |
| 360–479 px | Standard phone: one column, slightly larger imagery and spacing |
| 480–767 px | Large phone/small split view: selective two-column mini-cards, still one-column forms |
| 768–1023 px | Tablet/landscape: two-column cards and asymmetric content where readable |
| 1024–1279 px | Compact desktop: full navigation, 2–3 column page sections |
| 1280–1599 px | Standard desktop: designed maximum reading widths and 3–4 column galleries |
| 1600–2559 px | Wide desktop: more breathing room/imagery, not stretched text or oversized controls |
| 2560 px and above | Ultrawide: centered bounded composition, optional edge imagery/background atmosphere |

Viewport media queries should govern page chrome and overall composition. Apply `container-type: inline-size` to reusable card regions, forms, hero text panels and footer groups so each component adapts correctly in a main column, sidebar or future embedded placement. Container queries have broad modern-browser availability and prevent page-specific breakpoint duplication.

### Fluid typography and spacing

- Replace stepwise heading sizes with `clamp()` values using `rem` minimum/maximum bounds, for example `clamp(2rem, 1.3rem + 3vw, 4.75rem)`.
- Keep body copy near 16–18 px and line lengths around 45–75 characters (`max-inline-size: 68ch`).
- Ensure the maximum in a clamped font scale still permits text enlargement; never use viewport units alone for font size.
- Use fluid section gaps, gutters, radii and card padding, but retain sensible minimum touch spacing.
- Test 200% text-only zoom and 400% browser zoom. Do not hide labels/content just because enlarged text no longer fits.

### Header and navigation behavior

Use four intentional modes:

1. **Desktop (about 1024 px and wider):** logo, full navigation, theme control and “Plan Your Trip” CTA. Navigation may reduce gaps before it disappears.
2. **Tablet (768–1023 px):** hamburger, logo, short CTA and theme icon. Do not attempt to show partial desktop navigation.
3. **Phone (360–767 px):** hamburger, centered/left logo and one short primary action. Move theme selection and secondary actions into the drawer.
4. **Minimum width/large text:** hamburger plus logo only in the header; expose the booking CTA as the first drawer action or a non-overlapping bottom action. Never abbreviate the brand ambiguously.

The drawer should be `inline-size: min(22rem, 100%)`, `block-size: 100dvh` with a `100vh` fallback, scroll internally, and pad all edges using `env(safe-area-inset-*)`. Keep the close button reachable in landscape and when text is enlarged. Lock background scroll without jumping its previous position. Return focus to the hamburger on close.

### Hero responsiveness

- Use `min-block-size: 100svh` for the stable initial mobile hero and enhance to `100dvh` where appropriate; avoid relying only on `100vh`.
- Cap hero content width and use fluid typography so headings wrap intentionally in two to four lines, not behind CTAs.
- At narrow widths stack CTAs full-width; at medium widths allow a row only if both labels fit without truncation.
- Art-direct hero crops with `<picture>` or Cloudinary crop/focal transformations. Portrait/mobile crops must preserve the subject and adequate contrast behind text.
- Adjust `object-position` per breakpoint rather than sending one desktop composition everywhere.
- On short landscape displays, reduce vertical padding and hero minimum height; do not force content below the fold solely to maintain a cinematic ratio.

### Grids, cards and content sections

- Replace fixed `repeat(2/3/4, 1fr)` rules with `auto-fit/minmax(min(100%, ...), 1fr)` where card width—not viewport name—determines layout.
- Remove fixed card/image heights in favor of `aspect-ratio`, content-driven minimums and variant ratios.
- Ensure flex/grid children have `min-inline-size: 0`; allow titles, prices, emails and URLs to wrap.
- Cards must not depend on hover for essential actions. Always expose actions on touch/coarse pointers.
- Use `@media (hover: hover) and (pointer: fine)` for hover-only image pans/lifts.
- Keep multi-column text rare; wide displays should increase negative space and imagery rather than produce excessively long lines.

### Page-specific responsive composition

#### Home

- About/service/feature sections: one column on phones, two on tablets, and the intended asymmetric or 3-column layout on desktop.
- Stats: retain a compact 2×2 grid on ordinary phones if translated labels fit; fall back to one column at 320 px or enlarged text.
- Testimonials: one visible slide with intrinsic height; do not make the carousel height depend on the shortest quotation.
- Feedback form: one column below its own 36–42 rem container width, not only below a global 600 px viewport.

#### Packages

- Filter controls become a vertical disclosure/filter sheet on phones if the row has more than a few controls; chips alone may remain horizontally scrollable with visible overflow affordance.
- Featured package: image above content on phones, side-by-side only when its container can give both sides adequate width.
- Cards: one column at 320 px, commonly two on tablets and three on standard desktop. Price/actions wrap without overlaying badges.
- Results and empty state must remain visible after filters; preserve scroll position sensibly.

#### Vehicles

- Remove the hard `min-width: 280px` dependency and use `min(100%, 17.5rem)`.
- Place photo above details on narrow cards; allow specs to use two compact columns only when labels fit, otherwise one.
- Ensure long vehicle names, capacities and action labels do not collide with badges.
- Chauffeur section becomes image-first single column on phone, balanced two-column at tablet/desktop.

#### Gallery

- Use responsive columns approximately as follows: 1 at 320–419, 2 at roughly 420–767, 3 at tablet/compact desktop, 4 at standard desktop, with an optional fifth only on very wide displays.
- Do not force all cells to one fixed pixel height. Use controlled `aspect-ratio` variants and `object-fit: cover`.
- Lightbox image uses `max-inline-size` and `max-block-size` based on `dvh`, leaving room for caption and controls.
- On phones, place previous/next zones at safe thumb locations without covering the caption; keep a clearly visible close control inside the safe area.
- Category pills may scroll horizontally inside their own region, but must have fade/arrow cues and keyboard scrolling.

#### Inquiry and contact

- Forms are one column on phones and under text enlargement. Two columns are allowed only through a form-container query.
- Inputs use at least `font-size: 1rem` to avoid unwanted mobile browser zoom and have touch targets around 44×44 CSS px or larger.
- Add `scroll-margin-top` so validation focus is not hidden under the fixed header.
- Inquiry progress: show short numbered steps/pins at narrow widths; make the current step name available near the form even when all labels cannot fit.
- Keep action buttons stacked and full width on small screens; put the primary next/submit action first in visual/tab logic while respecting expected Back/Next ordering.
- When the virtual keyboard opens, fixed widgets must not cover the focused field or submit action. Prefer normal document flow over a fixed mobile form footer.
- Contact cards and embedded maps use intrinsic/responsive height and never exceed viewport width.

#### Footer and legal pages

- Footer groups collapse into well-spaced sections; consider accessible disclosures only if the footer becomes very long.
- Phone/email URLs must wrap safely and keep their full accessible name.
- Legal body text stays within a reading column; headings must not be clipped by anchor navigation/fixed headers.

### Fixed and floating UI collision strategy

Create one shared fixed-UI placement system instead of independent pixel offsets:

```css
:root {
  --safe-b: env(safe-area-inset-bottom, 0px);
  --safe-l: env(safe-area-inset-left, 0px);
  --safe-r: env(safe-area-inset-right, 0px);
  --fixed-gap: 0.75rem;
}
```

- Replace the two always-visible contact circles with one “Contact” action that expands on request, or use an in-flow/sticky mobile booking bar.
- Keep back-to-top hidden until useful and place it in the same managed dock so it cannot overlap contact actions.
- Remove the gallery admin trigger entirely under the recommended managed-media workflow.
- Give cookie/consent banners precedence and push/relocate other fixed actions while open.
- Place toasts within `inline-size: min(calc(100vw - 2rem), 24rem)` and safe-area offsets; remove the 300 px minimum.
- Reserve page bottom padding equal to any persistent bottom action height plus safe-area inset.
- Test fixed elements with iOS/Android browser bars expanded/collapsed, landscape mode and on-screen keyboard.

### Responsive images and media

- Generate width variants suitable for the actual slots (for example 320, 480, 768, 1024 and 1440 px where useful), then supply correct `srcset` and `sizes`.
- Do not choose image candidates solely by device width; describe the card/grid slot in `sizes`.
- Use art-directed crops for hero/banner imagery and focal metadata for client-uploaded gallery assets.
- Always provide width/height or aspect ratio to prevent layout shifts while assets load.
- Avoid loading desktop hero/gallery assets on phone simply to crop most pixels away.

### Landscape, foldable, large-display and input-mode support

- Add height-based queries for short landscape phones/tablets: reduce hero padding, keep modal headers/actions reachable, and allow internal scrolling.
- Use safe-area insets today. Treat foldable viewport segments as progressive enhancement only after ordinary split-screen behavior is correct.
- On ultrawide displays cap text and core grid width; allow backgrounds/photography to extend, rather than stretching navigation and paragraphs across the monitor.
- Support mouse, touch and keyboard independently. Do not infer input type from viewport width.
- Ensure controls work at Windows display scaling and browser zoom, not only fixed-resolution screenshots.

### Implementation sequence

#### Phase R0 — expose and inventory overflow

- Temporarily remove global horizontal-overflow hiding.
- Add a development diagnostic that outlines elements extending beyond `documentElement.clientWidth`.
- Capture every page at the full test matrix before changing layout.
- Inventory fixed heights, fixed/min widths, absolute positioning, `100vh`, duplicated breakpoints and `transition: all`.

#### Phase R1 — rebuild global foundations

- Introduce mobile-first containers, fluid gutters/type/spacing, safe areas, `dvh/svh`, intrinsic media rules and auto-fit grids.
- Consolidate breakpoint rules and establish named layout/container-query conventions.
- Rebuild header/sidebar/footer and the fixed-action dock first because they affect every page.

#### Phase R2 — component/page adaptation

- Convert cards, forms, gallery, filters, heroes, lightbox, testimonials and CTAs to intrinsic/container-responsive behavior.
- Replace fixed image heights with aspect-ratio variants and add responsive image markup.
- Add coarse-pointer, hover, short-height, landscape and reduced-motion adaptations.

#### Phase R3 — verification and regression protection

- Run automated screenshot/overflow tests for every page and viewport.
- Complete real-device testing and correct remaining page-specific collisions.
- Establish visual baselines so future content/CSS changes cannot silently reintroduce overlap.

### Mandatory test matrix

Test every page, both themes, and representative loading/error/empty/modal/menu/form-validation states.

| Category | Required sizes/states |
|---|---|
| Minimum/small phones | 320×568, 360×640, 375×667 |
| Modern phones | 390×844, 412×915, 430×932 |
| Phone landscape | 568×320, 844×390, 915×412 |
| Tablets | 768×1024, 820×1180, 1024×1366 and landscape equivalents |
| Laptop/desktop | 1024×768, 1280×720, 1366×768, 1440×900, 1920×1080 |
| Wide/ultrawide | 2560×1440, 3440×1440 |
| Accessibility | 200% text, 200% and 400% zoom, keyboard-only, reduced motion, high contrast/forced colors where supported |
| Content stress | Long names/emails, 200% longer translated labels, missing/slow images, validation messages, 1/20/100 gallery items |
| Mobile UI state | Browser bars open/closed, virtual keyboard, notch/safe area, drawer/lightbox open, portrait↔landscape rotation |

### Automated no-overlap quality gates

Add Playwright checks that:

- Assert `document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1` on every normal page state.
- Open/close the navigation, filters, gallery lightbox, accordion and inquiry steps at each relevant width.
- Capture full-page and component screenshots for visual regression.
- Verify primary actions are visible, enabled and not covered at their center point (`document.elementFromPoint`).
- Validate bounding boxes for fixed header/dock/banner/toast combinations.
- Exercise long synthetic content and form errors rather than testing only ideal copy.
- Run axe checks and keyboard traversal alongside screenshots.

Manual review remains required for visual balance, touch comfort, image crops, text wrapping, browser chrome and real-device performance. “No horizontal scrollbar” alone does not prove that content has not been clipped by `overflow`.

### Responsive definition of done

- No unintended page-level horizontal scroll from 320 px upward.
- No text, images, controls, badges, toasts, fixed actions or validation messages overlap at any required state.
- No essential content/action is hidden at 200% text or 400% zoom.
- All fixed elements respect safe areas and each other.
- Every component chooses layout based on available space and remains reusable outside its current page.
- Mobile crops preserve the subject and text contrast; images do not cause layout shift.
- Touch actions are large/reachable; hover is never required; keyboard focus is visible and unobscured.
- Wide displays look intentionally composed rather than merely stretched.
- Automated viewport/overflow/visual regression checks pass in CI, followed by signed-off real-device review.

## 12. Full upgrade execution plan

This section is the implementation runbook for upgrading the current repository into the secure, responsive, attractive and deploy-ready target described throughout this report. It is intentionally ordered to keep a working reference site available, prevent insecure intermediate releases, and give any future agent an explicit verification gate before it changes the next layer.

### 12.1 Non-negotiable execution rules

Every agent or engineer executing this plan must follow these rules:

1. **Inspect before editing.** Read this report, `git status`, relevant source files, legacy Firebase configuration and any repository-level agent instructions before starting a phase.
2. **Preserve unrelated work.** Existing uncommitted changes belong to the user. Never reset, overwrite, delete or reformat unrelated files.
3. **Work phase by phase.** Do not start a later phase while an earlier phase's exit gate is failing. A phase may use several small pull requests, but every pull request must leave the preview usable.
4. **Keep the legacy site as the visual/content reference until parity is signed off.** Create the new structure alongside it. Do not bulk-move or delete root HTML/CSS/JS files at the beginning.
5. **Copy, verify, switch, then remove.** Apply this to pages, assets, legacy Firebase data and gallery images. Deletion is the final step after verified export or explicit owner-approved disposition, preview verification and any required retention window.
6. **No direct production experiments.** Code, vendor configuration, headers and migrations must pass locally and in Vercel Preview with test service accounts/forms first.
7. **Security changes fail closed.** If Formspree is unavailable, form submission fails clearly; the UI never pretends a submission succeeded.
8. **One canonical source of truth.** Shared navigation, contact data, package data, schemas and metadata live in one maintained location.
9. **Maintain URL compatibility.** Existing `.html` URLs continue through output parity or tested redirects. Do not create SEO-breaking route changes during migration.
10. **Make every phase reversible.** Record the last known-good commit/deployment, backup location, external configuration changes and rollback process before cutover.
11. **Do not weaken checks to pass a gate.** Fix the cause. Do not hide overflow, suppress TypeScript errors, bypass form/provider checks, loosen CSP, or accept visual snapshots without review.
12. **Record evidence.** A phase is complete only after its exit gate passes and the issue/PR contains tests, screenshots, preview URL and rollback evidence.

### 12.2 Fixed target decisions

Use this target unless the owner explicitly records another decision before Phase 2:

| Concern | Target decision |
|---|---|
| Frontend | Astro static output with strict TypeScript and minimal client JavaScript |
| Production hosting | Vercel as the single canonical host |
| Build output | Only `dist/` is deployable |
| Public forms | Separate Formspree contact/inquiry/feedback endpoints with provider spam controls and notifications |
| Lead records | Formspree managed submission dashboard/export; no Tourvir database |
| Gallery authoring | Cloudinary Media Library accounts; no admin panel on Tourvir |
| Gallery delivery | Cloudinary tagged asset JSON plus responsive transformation URLs/CDN |
| Content | Typed local content collections initially; consider Sanity only if the client later edits broad site content |
| Styling | Mobile-first CSS, design/motion tokens, intrinsic grids and component container queries |
| Testing | Unit/contract tests, Playwright E2E/visual, axe and Lighthouse CI; synthetic provider tests in Preview |
| Environments | Local mocks, Vercel Preview with test Formspree forms, and Vercel Production with production forms |
| Releases | Protected `main`, Vercel pull-request previews, explicit production promotion and documented rollback |

Do not add React/Vue, an SPA router, WebGL, a custom CMS, a website upload widget or a service worker unless a separately approved requirement proves the added complexity is necessary.

### 12.3 Target repository structure

```text
tourvir/
├─ .github/workflows/
│  ├─ validate.yml
│  ├─ preview-smoke.yml
│  └─ production-smoke.yml
├─ public/
│  ├─ favicon.svg
│  ├─ robots.txt
│  ├─ static/
│  └─ fallback-gallery/
├─ src/
│  ├─ assets/{images,icons}/
│  ├─ components/{layout,forms,gallery,packages,vehicles,ui}/
│  ├─ content/{packages,vehicles,legal}/
│  ├─ content/site.ts
│  ├─ layouts/BaseLayout.astro
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ packages.astro
│  │  ├─ vehicles.astro
│  │  ├─ gallery.astro
│  │  ├─ inquiry.astro
│  │  ├─ contact.astro
│  │  ├─ cookies.astro
│  │  ├─ privacy.astro
│  │  ├─ terms.astro
│  │  └─ 404.astro
│  ├─ scripts/{navigation,theme,motion,gallery}.ts
│  ├─ scripts/forms/
│  ├─ services/{forms-client,gallery-client,telemetry}.ts
│  ├─ config/forms.ts
│  ├─ schemas/{contact,feedback,inquiry,gallery}.ts
│  ├─ styles/{tokens,reset,global,utilities}.css
│  ├─ styles/components/
│  └─ env.d.ts
├─ tests/{unit,contract,e2e,visual,accessibility}/
├─ scripts/{validate-content,check-overflow,smoke-production}.mjs
├─ docs/
│  ├─ decisions/
│  ├─ operations/
│  ├─ content-guide.md
│  └─ gallery-editor-guide.md
├─ .env.example
├─ vercel.json
├─ astro.config.mjs
├─ eslint.config.js
├─ package.json
├─ package-lock.json
├─ playwright.config.ts
├─ tsconfig.json
└─ README.md
```

### 12.4 Legacy-to-target migration map

| Current source | Intermediate step | Final responsibility |
|---|---|---|
| Root `*.html` | Create equivalent `src/pages/*.astro` one at a time | Page composition; shared markup comes from layout/components |
| Repeated header/sidebar/footer | Extract after page parity | `src/components/layout/`, driven by `content/site.ts` |
| `css/style.css` | Import unchanged first | Split into reset, tokens, global layout and owned component styles |
| `css/components.css` | Import unchanged first | One stylesheet per reusable component; deduplicate after coverage review |
| `css/sidebar.css` | Preserve during parity | Responsive navigation stylesheet with safe areas/focus behavior |
| `css/pages/*.css` | Attach to migrated page | Retain only genuine page composition; component rules move with components |
| `js/main.js` | Keep until each feature has a parity test | Focused theme/navigation/motion/form modules |
| `js/packages.js` | Migrate with package page | Typed accessible filter component/module |
| `js/gallery.js` | Migrate after adapter contract | One gallery controller for filtering/lightbox/pagination |
| `js/inquiry.js` | Lock schema/test first | Schema-based stepper and confirmed Formspree submit |
| `js/firebase-init.js` | Stop global page loading | Delete; no Firebase SDK/configuration in final source or `dist/` |
| `js/gallery-admin.js` | Disable immediately | Delete after Cloudinary cutover; no replacement on public site |
| `images/` | Copy unchanged to `public/images/` for parity | Owned static assets become build assets; managed gallery moves to Cloudinary |
| Firebase compat CDN scripts | Remove page by page | No Firebase network request or dependency remains |

### 12.5 Phase dependency and status ledger

Update this ledger as work proceeds. Valid states: `not_started`, `in_progress`, `blocked`, `complete`. Mark `complete` only after the exit gate and evidence.

| Phase | Name | Depends on | Initial state | Required evidence |
|---:|---|---:|---|---|
| 0 | Authority, accounts and business decisions | — | not_started | Approved decision record |
| 1 | Baseline, data disposition and characterization | 0 | complete | Local evidence plus approved Path B irreversible-disposal receipt (`docs/baseline/phase-1/`) |
| 2 | Immediate security and conversion containment | 1 | blocked | Local containment complete; external Firebase Hosting/Firestore/Storage shutdown evidence pending (`docs/phases/phase-2/`) |
| 3 | Toolchain and validation pipeline | 2 | not_started | Clean install/build/check CI |
| 4 | Astro scaffold and non-destructive migration | 3 | not_started | `dist/` route/content parity |
| 5 | Shared layout, content and components | 4 | not_started | No duplicated global chrome/data |
| 6 | JavaScript/TypeScript behavior migration | 5 | not_started | E2E parity; no compat globals |
| 7 | Managed forms and legacy form migration | 6 | not_started | Formspree Preview delivery and dashboard/notification tests |
| 8 | Cloudinary gallery/image workflow | 5 | not_started | Client publishing test + gallery parity |
| 9 | Responsive system/no-overlap work | 5, 6, 8 | not_started | Full responsive matrix passes |
| 10 | Motion and visual-experience upgrade | 9 | not_started | Motion/reduced-motion/performance review |
| 11 | Accessibility/interaction hardening | 7, 9, 10 | not_started | Axe + manual sign-off |
| 12 | SEO, privacy, headers and performance | 7, 8, 11 | not_started | Metadata/header/Lighthouse gates |
| 13 | Test, observability and operations layer | 12 | not_started | CI + alert/backup/rollback drills |
| 14 | Staging migration and acceptance | 13 | not_started | Signed staging acceptance |
| 15 | Production cutover and verification | 14 | not_started | Production smoke/release record |
| 16 | Post-launch monitoring/optimization | 15 | not_started | 7-day and 30-day reviews |

Frontend scaffolding and account provisioning may proceed in parallel only when changes do not overlap. The dependency and exit-gate order still controls integration.

**Emergency exception:** if the currently deployed site still exposes gallery mutation or private data, the authorized containment parts of Phase 2 must be executed immediately after preserving required data or obtaining a disposal decision. Do not wait for unrelated vendor/content decisions to close a live security exposure. Record the emergency action, keep the legacy service closed, and return to the normal sequence before continuing migration.

### Phase 0 — Authority, accounts and business decisions

**Goal:** Resolve decisions that would otherwise cause implementation rework or unauthorized external changes.

#### Actions

1. Name the business owner who can approve domain, contact information, legal text, vendors and production deployment.
2. Confirm the canonical domain, business-owned Vercel account/team and production Git repository.
3. Approve Vercel as canonical and approve disabling Firebase Hosting and GitHub Pages after verified cutover.
4. Create separate Vercel Preview/Production configuration and business-owned Formspree test/production forms. Never use real lead data for automated tests.
5. Create a business-owned Cloudinary account; enable MFA; identify two recovery owners; approve usage limits.
6. Confirm actual phone, WhatsApp, email, address, social links, legal name, support hours and response-time claims.
7. Resolve the feedback schema conflict: collect email, country, or both; record fields and retention purpose.
8. Approve inquiry/contact/feedback recipients, separate Formspree form ownership, spam controls, notification channels and submission retention/export policy.
9. Decide legacy Firebase data disposition: (A) preserve it through a verified export/restore or (B) attest it contains no required records / explicitly approve irreversible discard with privacy/legal retention approval.
10. Approve privacy/retention periods, analytics/consent position, image-rights policy and backup ownership.
11. Record decisions in `docs/decisions/0001-platform-and-content.md` once the structure exists; before then, attach them to the implementation issue/PR.

#### Exit gate

- No unresolved choice changes architecture, stored personal data, vendor ownership, production domain or content truth.
- Staging and production owners are known; credentials are not stored in Git.

#### Stop rule

If approvals are unavailable, continue only with read-only local scaffolding that does not select vendors, change production or process real data.

---

### Phase 1 — Baseline, data disposition and characterization

**Goal:** Create a recoverable, testable description of current behavior before refactoring.

#### Actions

1. Record `git status` and preserve user changes. Create a dedicated upgrade branch from the agreed commit.
2. Tag or record the exact baseline commit; do not tag an unreviewed dirty worktree.
3. Resolve legacy Firebase data through one authorized path: export Firestore/Storage and verify an isolated restore, or record a signed no-required-data/approved-discard attestation. Never infer permission to delete customer data.
4. Inventory every route, query string, title, description, heading, form, button, collection, external link and local asset.
5. Capture desktop/mobile screenshots and intentional interactions for every page in both themes.
6. Create a behavior checklist for navigation, drawer, theme, hero, filters, gallery/lightbox, feedback, contact and inquiry steps.
7. Characterize known failures as tests: inquiry selector mismatch, feedback mismatch, false-success fallback and public admin exposure.
8. Record authoritative Firebase services/configuration only as legacy decommission inventory, without committing credentials or private data.
9. Create a route contract listing expected output paths and status codes.
10. Measure baseline transferred bytes, images, Lighthouse values and console/network errors in a repeatable environment.

#### Exit gate

- Baseline commit, visual reference, route contract and known-bug list exist.
- The data-disposition receipt is approved: either a restore owner confirms the export is usable, or an authorized owner explicitly confirms no retained data is required and approves disposal.

#### Rollback

Return to the recorded baseline commit. Restore data only from the verified export with owner approval; a disposal attestation is not a backup.

---

### Phase 2 — Immediate security and conversion containment

**Goal:** Remove dangerous behavior before broad refactoring and make broken conversion paths explicit.

#### Actions in order

1. Rotate the documented/default gallery password even though the final solution removes it.
2. With authorized project access, freeze/deny legacy Firestore/Storage public access while data disposition and migration proceed. Record the Console/config evidence; do not create a permanent Firebase test stack.
3. Remove or feature-disable the public admin trigger, upload and delete controls; CSS hiding is not sufficient.
4. Stop loading `gallery-admin.js` and Firebase Storage SDK publicly.
5. Align inquiry IDs/names and serializer to the approved schema; validate date order, people counts, lengths and required steps.
6. Align feedback HTML/serializer with the Phase 0 decision.
7. Remove every branch that shows success without confirmed persistence.
8. Until Phase 7's Formspree integration is live, use an approved temporary managed form endpoint or display an honest unavailable/direct-contact state. Never restore unrestricted anonymous database writes.
9. Replace remote gallery `innerHTML` interpolation with safe element/text properties.
10. Add smoke tests proving unsafe admin controls are absent and forms do not throw.

#### Exit gate

- Anonymous upload/delete and private lead access are confirmed closed in the legacy environment.
- Inquiry/feedback no longer throw, and no form reports unconfirmed success.
- Public JavaScript contains no usable admin secret or privileged gallery workflow.

#### Rollback

Rollback may restore display behavior but never Firebase writes or exposed mutation. If safe form delivery is unavailable, show direct contact details.

---

### Phase 3 — Toolchain and validation pipeline

**Goal:** Make every later change mechanically verifiable before restructuring files.

#### Deliverables

- Real `package.json`/lockfile, `.gitignore`, `.editorconfig`, `.env.example` and pinned supported runtime.
- Astro/Vite, strict TypeScript, ESLint, Prettier, Stylelint and content/HTML validation.
- Unit/contract, Playwright, axe and Lighthouse harnesses with HTTP mocks for Formspree and Cloudinary failure states.
- `README.md` with install, development, test, Preview and build instructions.
- `.github/workflows/validate.yml` that cannot deploy production.

#### Standard commands

```text
npm run format:check
npm run lint
npm run typecheck
npm run test:unit
npm run test:contract
npm run build
npm run test:e2e
npm run test:a11y
npm run test:visual
npm run test:lighthouse
npm run check:links
npm run check:content
npm run validate
```

`npm run validate` runs all non-deployment release checks in documented order. CI uses a clean lockfile install, pinned actions and minimum permissions.

#### Exit gate

- A clean checkout installs, validates and builds using README instructions.
- CI fails for a deliberate error and passes after its reversion.
- No workflow publishes the repository root.

#### Rollback

The legacy site stays directly previewable. Revert toolchain commits if the stack cannot reproduce route/content contracts.

---

### Phase 4 — Astro scaffold and non-destructive folder migration

**Goal:** Establish the target structure and a parity `dist/` without losing the reference implementation.

#### Actions

1. Create `src/`, `public/`, `tests/`, `scripts/` and `docs/`; do not create a server/functions package.
2. Configure Astro static output, Vercel deployment settings and exact existing paths; test every `.html` URL.
3. Initially copy current images to `public/images/` without renaming.
4. Import current CSS in its original cascade order; do not combine markup and style refactoring.
5. Create `BaseLayout.astro` with head slots, styles/scripts and landmarks.
6. Migrate one legal page first; compare DOM, content, screenshots and links.
7. Migrate in increasing complexity: legal → vehicles → packages → contact → inquiry → home → gallery.
8. Run route-parity and link tests after each page.
9. Audit `dist/` for reports, tests, configs, secrets and admin code.
10. Keep root legacy sources temporarily, exclude them from `dist/`, and label them reference-only.

#### Exit gate

- `dist/` contains every route/asset with no broken local links.
- Content and primary screenshots match baseline except documented fixes.
- Serving `dist/` requires no root legacy file, and its artifact audit is clean.

#### Rollback

Discard the scaffold while retaining legacy files. No route, DNS or data change occurs here.

---

### Phase 5 — Shared layout, content and component extraction

**Goal:** Remove duplication without changing visitor behavior.

#### Actions

1. Extract Header, drawer/navigation, Footer, FloatingActions, PageHero, CTA and metadata components.
2. Centralize business/contact/social/navigation/legal data in typed `src/content/site.ts`.
3. Move package/vehicle data to validated typed content with stable IDs, categories, prices and links.
4. Extract Button, Card, Badge, Modal/Lightbox, Toast/Status, FilterPills and form-field components.
5. Replace repeated inline SVG with owned accessible icon components/sprite.
6. Remove inline handlers/presentation styles only as component equivalents pass tests.
7. Validate missing images, duplicate IDs, categories/prices, alt text and placeholder contact data.
8. Run visual regression after each extraction before deleting duplicated markup.

#### Exit gate

- Global chrome and contact data have one source across pages.
- Package/vehicle cards come from validated content.
- No inline `onclick`; inline styles are limited to documented dynamic values.
- Route, content, keyboard and visual parity tests pass.

#### Rollback

Revert the last extracted component and restore its page-local version from Git, not divergent copies across all pages.

### Phase 6 — JavaScript/TypeScript behavior migration

**Goal:** Replace global coupled scripts with focused testable modules while preserving interactions.

#### Actions

1. Define small initializers that safely no-op when a component is absent.
2. Migrate theme behavior first; apply preference before paint, handle storage failure and synchronize labels/state.
3. Migrate drawer behavior with focus trap/return, Escape, scroll restoration and `aria-expanded`.
4. Replace multiple scroll listeners with observers or one requestAnimationFrame-throttled coordinator.
5. Migrate package filters with typed state, appropriate debounce and announced result count.
6. Combine gallery filtering/lightbox into one controller; remove cloning and duplicate initialization.
7. Migrate carousels/hero with pause on hover/focus/hidden tab/reduced motion and interval cleanup.
8. Migrate form UI to schema serialization/field errors, submitting only through Phase 7's Formspree adapter.
9. Replace injected toast/inline handlers with safe DOM and an `aria-live` status component.
10. Remove global Firebase compat initialization and unused CDN scripts.

#### Required coverage

- Theme state and persistence failure.
- Drawer open/close/focus/scroll.
- Package filter combinations/empty result.
- Gallery visibility, lightbox index, keyboard/swipe/close.
- Approved form serialization and each validation failure.
- Timer pause/cleanup and reduced motion.

#### Exit gate

- No runtime console errors or duplicate handlers.
- No behavior depends on undeclared `firebase`/`db` globals.
- Unit and E2E parity passes.

#### Rollback

Switch one component to its previous module at a time; never run old/new initializers together.

---

### Phase 7 — Managed forms and legacy form migration

**Goal:** Deliver inquiry, contact and feedback reliably through a managed form service, with no Tourvir database or backend.

#### Contracts

Create shared schemas for contact, inquiry and feedback. Each declares approved names, normalized types, enumerations, min/max lengths, consent and safe errors. Client validation is for UX; Formspree's accepted response and provider controls remain the delivery boundary.

#### Formspree configuration

1. Create separate production forms for contact, inquiry and feedback under the business-owned Formspree project; create test forms for Preview automation.
2. Configure approved recipient addresses, subject/routing fields, team access, retention/export ownership and notification fallback.
3. Restrict accepted domains and enable honeypot plus Turnstile/reCAPTCHA protection appropriate to normal and AJAX submissions.
4. Keep Formspree form IDs in environment configuration. They are public identifiers; no account token or API secret may enter Git or `dist/`.
5. Configure only approved form fields and cap lengths in markup/schema; do not collect data without a stated business purpose.
6. Confirm dashboard storage, email notification, spam review, export and deletion workflows with the operational owner.
7. Document provider outage, quota, compromised-account and recipient-delivery recovery.

#### Frontend actions

1. Use `fetch` with abort timeout and double-submit prevention.
2. Preserve input on failure; focus/announce actionable errors.
3. Show success only on a confirmed Formspree acceptance response; show a provider reference only if one is safely returned.
4. Distinguish offline, validation, bot/rate-limit and provider failure.
5. Never place personal content in URLs, analytics or client logs.

#### Tests

- No Firebase/database request is made and no personal data appears in URLs, analytics, console logs or test artifacts.
- Test valid, invalid, oversized, double-submit, bot/rate-limit, timeout and provider-failure cases with mocks.
- Vercel Preview uses test forms and proves dashboard receipt plus staff notification end to end without real customer data.

#### Deployment order

Configure and health-check test/production Formspree forms before switching frontend form IDs. Keep direct contact details visible until each form is confirmed.

#### Exit gate

- All forms pass success/failure paths in Preview; staff can match notification and dashboard submission.
- No Firebase/database dependency remains in form code; no false success, duplicate submit or sensitive log leak.

#### Rollback

Restore the prior compatible Formspree form IDs/configuration or disable forms with direct-contact details. Never restore Firebase writes as rollback.

---

### Phase 8 — Cloudinary gallery and image workflow

**Goal:** Let the client manage an attractive gallery without a custom Tourvir admin app.

#### Account/model setup

1. Confirm business-owned users, MFA, recovery and billing alerts.
2. Create `tourvir/gallery` plus archive folder.
3. Define controlled `title`, `alt`, `category`, `location`, numeric `order`, `published`, optional `featured` and focal metadata.
4. Define approved categories and require `tourvir-gallery` publication tag.
5. Configure dashboard upload defaults, allowed types and reasonable original-size limits.
6. Never enable an unsigned public Tourvir upload widget.

#### Migration

1. Inventory Firebase originals/metadata from the Phase 1 export, or use the approved local/current asset set when the owner attested that no legacy Firebase data must be retained.
2. Normalize caption/category/order/alt in a reviewed manifest.
3. Import without deleting Firebase originals until the Phase 1 disposition and retention gate permits decommissioning.
4. Compare counts, dimensions/checksums and caption/crop samples.
5. Publish/tag only reviewed assets.

#### Frontend adapter

1. Fetch the tagged public list through typed `gallery-client.ts`.
2. Validate response, URL scheme, type, metadata and dimensions.
3. Exclude invalid/unpublished records; sort by order and stable fallback.
4. Render through safe component properties, never remote `innerHTML`.
5. Build thumbnail/card/lightbox transformation URLs with automatic format/quality and focal crop.
6. Provide `srcset`, `sizes`, dimensions/aspect ratio, lazy loading and async decoding.
7. Initially render 12–18; progressively reveal/paginate and prefetch only adjacent lightbox images.
8. Provide loading, empty, error and curated local fallback states.
9. Use a temporary `local|cloudinary` adapter flag during preview; no secret in public environment variables.

#### Client acceptance

Have the real editor use `docs/gallery-editor-guide.md` to upload, publish, reorder, replace, unpublish and archive on phone/desktop without developer help. Confirm incomplete assets stay hidden and changes appear within documented cache delay.

#### Cutover/cleanup

Remove admin HTML/CSS/JS, password hash, all Firebase SDK/configuration and gallery mutation code after Preview parity. Keep legacy Firebase access closed, then delete retained data and decommission the project only after the approved export/disposition and retention window.

#### Exit gate

- Client publishing works and is documented.
- Categories/order/captions/fallback/lightbox pass all viewports.
- Public bundle contains no mutation capability or vendor API secret.
- Image bytes, crops and layout shift meet budgets.

#### Rollback

Switch read adapter to curated local fallback. Never restore the public Firebase admin.

---

### Phase 9 — Responsive system and no-overlap implementation

**Goal:** Execute Section 11 as a tested system.

#### Actions

1. Remove overflow masking in development and inventory actual offenders.
2. Add mobile-first reset, fluid gutters/type/spacing, bounded containers and intrinsic media.
3. Consolidate viewport breakpoints and named container-query conventions.
4. Rebuild header/drawer/footer/fixed dock with `dvh/svh`, safe areas, minimum-width and large-text modes.
5. Convert fixed grids to `auto-fit/minmax` or container queries.
6. Replace fragile fixed card/image heights with aspect-ratio/content-driven layouts.
7. Implement every page-specific rule in Section 11.
8. Add pointer, hover, short-height, landscape and keyboard adaptations.
9. Add responsive image slots/art direction and validate mobile focal crops.
10. Add Playwright overflow, covered-action and visual tests for Section 11's matrix.

#### Exit gate

- Every responsive definition-of-done item passes with long content, errors and image failures.
- Real phone/tablet/desktop review is signed off.

#### Rollback

Revert by component/layout layer. Never restore global overflow hiding to make tests green.

---

### Phase 10 — Motion and visual-experience upgrade

**Goal:** Implement Section 10's “Sri Lankan Journey” without harming clarity, accessibility or speed.

#### Actions in order

1. Add shared motion tokens and complete reduced-motion override.
2. Refine hero to three art-directed images, one eager asset and controlled/pausable rotation.
3. Add clipped heading/card reveals and clear button/form states using CSS/observers.
4. Add directional inquiry steps only after form correctness is locked.
5. Add gallery filter repositioning/shared lightbox transitions progressively.
6. Add SVG journey line and page transitions last as removable enhancement layers.
7. Avoid WebGL, scroll hijacking, custom cursors, excessive particles and infinite pulses.
8. Pause hidden/off-screen motion, restrict hover motion to fine pointers and test low-power mobile.

#### Exit gate

- Reduced motion preserves every state/action.
- Motion stays within LCP/CLS/INP budgets and is smooth on representative mobile.
- Nothing delays reading, navigation, validation or confirmation.
- Visual owner approves consistency.

#### Rollback

Disable enhancement modules while preserving static layout/functionality.

### Phase 11 — Accessibility and interaction hardening

**Goal:** Make the site usable with keyboard, assistive technology, zoom, reduced motion and varied inputs.

#### Actions

1. Verify landmarks, headings, titles, skip link and DOM/tab order.
2. Add accessible names, `aria-expanded`, `aria-controls`, current-page state and live regions.
3. Implement focus trap/return and background isolation for drawer/lightbox/dialogs.
4. Ensure gallery, filters, stars, accordion, carousel and stepper work by keyboard/screen reader.
5. Associate labels/hints/errors; move focus only for recovery and keep it unobscured.
6. Verify touch targets, `:focus-visible`, both-theme contrast, forced colors, zoom/reflow and text spacing.
7. Review alt text from content/Cloudinary; mark decorative imagery correctly.
8. Run axe on every route/state plus manual keyboard and representative screen-reader checks.

#### Exit gate

- No unapproved critical/serious automated finding.
- All primary journeys work without a pointer.
- 320 px reflow, 200% text, 400% zoom and reduced motion pass.
- Drawer/lightbox/errors are announced and focus-safe.

#### Rollback

Never remove accessibility semantics to restore an effect; simplify the conflicting visual behavior.

---

### Phase 12 — SEO, privacy, headers and performance hardening

**Goal:** Complete public-document, delivery and policy readiness.

#### SEO/content

1. Correct unique titles/descriptions, especially legal pages.
2. Configure canonical origin, Open Graph/Twitter and share images.
3. Generate sitemap, robots and useful 404.
4. Add truthful TravelAgency/Organization, breadcrumb and applicable offer/package structured data.
5. Preserve old URLs with validated redirects/statuses and no canonical duplication.
6. Obtain named approval for contacts, prices, reviews, claims, image rights and legal copy.

#### Security/privacy

1. Configure CSP for final Vercel, Cloudinary, Formspree and font origins and remove inline code that forces weak directives.
2. Add HSTS on canonical HTTPS, `nosniff`, Referrer-Policy, Permissions-Policy and CSP `frame-ancestors`.
3. Keep secrets in server secret manager; scan Git history and `dist/`.
4. Implement analytics/consent only after approval; never collect form content.
5. Document retention, deletion requests, subprocessors and editor-account lifecycle.

#### Performance

1. Hash built assets with one-year immutable cache; HTML revalidates.
2. Verify Firebase App/Firestore/Storage compat bundles and configuration are absent; ship page-specific JavaScript.
3. Optimize hero/gallery image dimensions, priority and responsive candidates.
4. Optimize/self-host fonts where appropriate.
5. Remove dead/duplicate CSS using coverage plus visual tests.
6. Enforce per-template transfer and Lighthouse/Core Web Vitals budgets.
7. Do not add a service worker in this release without separate approval/tests.

#### Exit gate

- Staging headers, metadata, robots/sitemap/structured data and redirects validate.
- Secret/artifact scan is clean; content/privacy owners approve.
- Performance/accessibility budgets pass without hiding regressions.

#### Rollback

If a header blocks a required resource, fix the narrow origin/directive. Never broadly disable CSP/HSTS.

---

### Phase 13 — Full test, observability and operations layer

**Goal:** Make readiness repeatable and failure detectable/recoverable.

#### CI layers

1. Format, lint, strict types and content schemas.
2. Unit schemas/serializers/filters/URL builders/safe rendering.
3. Formspree adapter contract tests with mocked response/failure cases and controlled Preview synthetic submissions.
4. Artifact audit, HTML and links.
5. Playwright functional, responsive overflow, axe and selected visual baselines.
6. Lighthouse budgets across representative templates.
7. Preview-deployment smoke checks against real URLs/headers.

#### Operations deliverables

- `docs/operations/deploy.md`: staging/production steps and approvals.
- `docs/operations/rollback.md`: Vercel deployment promotion, form-ID/configuration and content rollback.
- `docs/operations/incidents.md`: form outage, gallery outage, cost spike, compromised editor and bad deploy.
- `docs/operations/backups.md`: schedule, retention, owner and restore procedure.
- Alerts/checks for Vercel deployment failure, Formspree notification/submission anomalies, Cloudinary usage, 404 and budgets.
- Privacy-safe Web Vitals/conversion event plan and dependency/security update policy.

#### Required drills

1. Prove CI blocks an intentional harmless preview failure.
2. Promote a previous Vercel Preview deployment in a non-production drill.
3. Simulate Formspree notification failure and confirm dashboard reconciliation without duplicate customer submission.
4. Exercise a sample Formspree export and Cloudinary original/fallback recovery procedure.
5. Remove a test Cloudinary editor and verify revocation.

#### Exit gate

- Branch protection requires checks.
- Alerts reach real owners with non-sensitive actionable context.
- Vercel rollback and managed-data export/recovery were exercised outside production.
- README/runbooks work from a clean environment.

### Phase 14 — Staging migration and acceptance

**Goal:** Exercise the exact production candidate against production-like services without customer impact.

#### Actions

1. Freeze release scope and create a candidate from a clean reviewed commit.
2. Build once in CI; retain immutable `dist/` and checksum for promotion.
3. Deploy the immutable artifact to Vercel Preview with test Formspree IDs and Preview-safe Cloudinary delivery configuration.
4. Health-check Formspree test forms and Cloudinary delivery, then run the same candidate artifact.
5. Run deployed smoke/E2E/header/link/axe/performance checks.
6. Test all forms with test recipients and verify Formspree dashboard submissions, notifications and any provider references.
7. Have the client upload/publish/reorder/unpublish a test Cloudinary asset.
8. Run the full responsive matrix and real-device tests on staging.
9. Verify analytics/consent, 404, sitemap, robots, canonical and social previews.
10. Obtain business acceptance for content, pricing, contacts, gallery, form routing and legal pages.
11. Record non-blocking follow-ups; never silently defer security, data-loss, P0/P1 or serious accessibility blockers.

#### Exit gate

- Section 13 production-readiness gates pass on staging.
- Business, technical and privacy/content owners sign the release record.
- Deploy window, DNS, monitoring owner and rollback trigger are confirmed.

#### Rollback

Expire staging only after retaining evidence. Production is unchanged.

---

### Phase 15 — Production cutover and verification

**Goal:** Promote the verified release with minimal risk and fast rollback.

#### Pre-deploy

1. Verify no unreviewed change since acceptance and match artifact checksum.
2. Confirm legacy-data disposition, last good Vercel deployment, production Formspree IDs and rollback owner.
3. Confirm quotas/billing alerts, business ownership and monitoring for Vercel, Formspree, Cloudinary and notification email.
4. Prepare DNS TTL/certificates only if domain cutover requires it.
5. Announce release window and freeze competing production changes.

#### Deployment order

1. Verify production Formspree/Cloudinary configuration and safe synthetic form checks.
2. Deploy or promote the already-verified Vercel artifact—never rebuild from an unverified workspace.
3. Apply/verify redirects, domain, TLS and headers.
4. Disable old Firebase Hosting and GitHub Pages only after the Vercel canonical domain is healthy.
5. Smoke all routes/assets, console, navigation/theme, packages, vehicles, gallery/fallback/lightbox, forms, 404, sitemap/robots and cache/security headers.
6. Use marked production form tests; confirm records/notifications then retain/delete by policy.
7. Check representative mobile/desktop visuals and synthetic Web Vitals.
8. Monitor Vercel/client errors, Formspree acceptance/notification delivery, spam, Cloudinary bandwidth and provider quotas during observation.

#### Automatic rollback triggers

- Widespread route/asset 4xx/5xx.
- Contact/inquiry cannot be confirmed or materially duplicates.
- Any Firebase request/write reappears or managed service configuration exposes private data/privileged mutation.
- CSP/headers block core functionality.
- Severe supported-viewport overlap blocks navigation/forms.
- Error, latency or cost exceeds approved thresholds.

#### Rollback order

1. Pause affected marketing traffic if necessary.
2. Promote the last compatible Vercel deployment.
3. Restore the matching Formspree form IDs/configuration if the failure is form-specific.
4. Keep legacy Firebase closed; never restore it as an emergency form or gallery path.
5. Switch gallery to local fallback if Cloudinary alone fails.
6. Run recovery smoke tests and notify owners.
7. Preserve evidence and review incident before retry.

#### Exit gate

- Production smoke/forms/notifications pass, monitoring is stable and business owner verifies live output.
- Release record contains commit, artifact checksum, deployments, versions, approvers, smoke results and rollback reference.

---

### Phase 16 — Post-launch monitoring and measured optimization

**Goal:** Stabilize and improve from evidence rather than speculative complexity.

#### First 24 hours

- Watch Formspree submissions/notifications/spam, Vercel deployment and client errors, Cloudinary use and 404s.
- Recheck key pages/forms on real mobile and desktop.
- Hotfix only verified regressions; do not bundle enhancements.

#### First 7 days

- Reconcile Formspree dashboard submissions with staff notifications.
- Review privacy-approved Web Vitals, image selection, gallery loading, 404 and funnel drop-off.
- Confirm independent client gallery operation.
- Review cost, bot and rate-limit events.

#### First 30 days

- Tune caches, image widths/quality, motion and preloads from field data.
- Review accessibility feedback and content accuracy.
- Apply dependency/security updates normally.
- After explicit acceptance and the Phase 1 export/disposition/retention approval, remove remaining Firebase Hosting, Firestore, Storage, web-app credentials/IAM and project resources. Confirm the project has no other business use before project deletion.
- Decide if a broader CMS/search/offline requirement is proven; default is not to add it.

#### Completion gate

- No unresolved release-critical incident; backups, alerts and editor workflow are healthy.
- 7-day/30-day findings have owners/priorities.
- Legacy cleanup is completed or has a documented retention date/reason.

### 12.6 Required handoff between phases

At each phase end, update the ledger and leave this reproducible handoff:

```text
Phase:
Status:
Baseline commit / branch:
Files changed:
External configuration changed:
Data migration/backup performed:
Commands/tests and results:
Preview/evidence links:
Known issues or approved deviations:
Rollback point and instructions:
Next phase prerequisites:
```

Never hand off only “done.” The next agent must understand code and external state without guessing.

### 12.7 Final program completion criteria

The upgrade is complete only when:

- The target structure is active; legacy root files are absent from `dist/` and removed from source after retention approval.
- All old URLs work or have tested permanent redirects/canonicals.
- Shared layout/content/components have one source of truth.
- Inquiry/contact/feedback use approved schemas and Formspree provider controls, are observable, and notify staff reliably.
- Public clients cannot read lead data or mutate gallery/admin content.
- Client manages Cloudinary gallery without developer help; delivery is responsive, optimized and safe.
- Section 11's complete no-overlap matrix passes automatically and on real devices.
- Section 10 motion is coherent, optional/reduced-motion-safe and within performance budgets.
- Accessibility, SEO, privacy, headers, caching and performance pass on the live domain.
- CI validates reviewed `dist/`; Vercel Preview/Production configurations are separate; promotion/rollback and managed-data export/recovery are tested.
- Monitoring, alerts, backups, incident/editor documentation and ownership operate in practice.
- Business/content/privacy owners approve live content and customer-data workflow.

### 12.8 Completed phases

### Phase 1 — complete (2026-07-26)

The local baseline package was produced and tested, and the business owner approved Path B irreversible disposal for Firebase project `tourvir-fd341`. The decision considered Firestore contacts, feedback, inquiries and gallery metadata plus Storage gallery uploads; no retained data is required, the project has no other business use, and recovery capability is explicitly `NONE` because no export/restore was performed. The redacted receipt is in `docs/baseline/phase-1/firebase-backup-evidence.md`.

Phase 0 remains `not_started`; Phase 1's characterization was executed early at the user's explicit direction. Platform/account decisions not needed for the read-only baseline remain Phase 0 prerequisites for later production integrations.

### 12.9 Phase execution record

#### Phase 1 — baseline and data-disposition execution (complete)

**Run date:** 2026-07-26

**Branch:** `main`

**Baseline commit:** `ee0561a2a8bef784face52e9fe65dbc10f093588`

**Baseline tree:** `6568ce7dd79f44ffff81cff6399c5b6767a3a693`

**Application source changes:** none

Completed and verified:

- Recorded the exact Git baseline and repository/source metrics.
- Created a 10-route URL/status contract covering `/` and all nine HTML files.
- Confirmed all nine HTML files return HTTP 200 from a local static server.
- Confirmed no missing local HTML asset/page references and no duplicate static IDs.
- Inventoried HTML/CSS/JavaScript/image size, route behavior, form fields, external origins and Firebase configuration gaps.
- Captured all nine routes in light/dark themes at 390×844, 768×1024 and 1440×900: 54 valid PNG screenshots totaling 27,087,063 bytes.
- Verified screenshot aggregate SHA-256 `00aacd8d98618f16bd8b2aedb7b9387a5b8a6bed157b9cebffd67f6da5d84ac5`.
- Recorded confirmed security, form, deployment, performance and responsive defects as non-parity issues.
- Visually confirmed the 390 px home page clips the header CTA and hero content.
- Verified the baseline work did not modify any tracked application source file.

Evidence:

- `docs/baseline/phase-1/README.md`
- `docs/baseline/phase-1/route-contract.json`
- `docs/baseline/phase-1/source-inventory.md`
- `docs/baseline/phase-1/behavior-checklist.md`
- `docs/baseline/phase-1/known-issues.md`
- `docs/baseline/phase-1/metrics.md`
- `docs/baseline/phase-1/visual-baseline.md`
- `docs/baseline/phase-1/screenshots/`
- `docs/baseline/phase-1/firebase-backup-evidence.md`

Environment evidence:

- Firebase CLI: unavailable.
- Google Cloud CLI: unavailable.
- Node runtime: unavailable.
- Application credentials/Firebase token: unavailable.
- No committed Firestore/Storage rules or indexes exist.
- `.firebase/hosting..cache` is a hosting cache, not a data export.
- No private customer data was fetched through public credentials or placed in Git.

Required next action for completion:

The business owner approved Path B irreversible disposal. There is no backup and no recovery capability. Authorized Firebase cleanup may proceed, while production vendor provisioning and external project decommissioning still require appropriate account access.

#### Phase 2 — local containment execution (blocked on external shutdown verification)

**Run date:** 2026-07-26

**Branch:** `main`

Completed locally:

- Removed all Firebase SDK tags, initialization/configuration, hosting cache and public gallery administration source.
- Replaced the remote gallery dependency with six safe local cards while retaining filters and lightbox behavior.
- Removed broken inquiry/feedback selectors and all false-success form fallbacks.
- Added honest temporary form-unavailable messages that preserve input and direct visitors to email/WhatsApp until Phase 7.
- Added inquiry date-order validation plus filtered-gallery and keyboard interaction fixes.
- Verified all nine routes return HTTP 200, local references/IDs are valid, repository Firebase/runtime scans are clean, and gallery/inquiry/contact render in Edge at 390×844.

Evidence and exact rollback constraints are recorded in `docs/phases/phase-2/README.md`.

External blocker:

- No authorized Firebase/Google Cloud credentials or CLI are available in this workspace.
- Old Firebase Hosting and remote Firestore/Storage closure cannot be verified here.
- An authorized owner must disable those resources and attach redacted evidence before Phase 2 is marked `complete`.

## 13. Deployment-ready target

A production release should meet all of these gates:

- CI passes formatting, linting, type checking, unit/contract tests, link/HTML checks, end-to-end smoke tests, accessibility checks and performance budgets.
- Only static `dist/` is deployed to Vercel; Preview and Production use separate configuration and Formspree test/production form IDs.
- Every gallery mutation occurs in authenticated Cloudinary Media Library; the public site has no privileged mutation capability.
- Contact/inquiry/feedback submissions use approved schemas, domain/bot controls, observable Formspree delivery, and end-to-end staff-notification tests.
- Cache and security headers are verified from the live domain.
- Lighthouse is measured on representative mobile throttling; no critical axe findings remain.
- Rollback is documented and tested by promoting a previous Vercel deployment; provider configuration rollback is recorded separately.
- No Firebase SDK, configuration, network request, hosting path, database, storage bucket or deployment workflow remains after approved decommissioning.
- Domain, analytics/consent, legal text, retention, backup, contact data, pricing and business claims have named owners and approval.

## 14. Suggested CI/CD flow

```text
Pull request
  → install from lockfile
  → format/lint/typecheck
  → unit + form/gallery contract tests
  → build dist
  → HTML/link/a11y/Lighthouse checks
  → Vercel Preview deployment
  → Playwright/axe/Lighthouse/smoke against Preview

Protected main branch
  → repeat required checks
  → promote the accepted immutable Vercel deployment
  → apply/verify domain, redirects and headers
  → smoke test canonical domain
  → automatic rollback/alert on failure
```

Use GitHub Actions concurrency with `cancel-in-progress: true` for superseded preview builds; serialize production deployments. Pin action versions to trusted immutable revisions for stronger supply-chain control.

## 15. Final assessment

The appropriate modernization is not “add threads” or build a custom admin application. It is to simplify the system: repair conversion flows, use Formspree for managed forms, use Cloudinary for authenticated image management, componentize repeated page structure, ship smaller responsive assets, cache through Vercel's CDN, and validate every release. Tourvir can remain a fast static site with very little client JavaScript and low operational complexity.

The highest-value first milestone is a secure, tested release baseline: working Formspree inquiry/contact/feedback flows, no public admin secret, no Firebase dependency, one canonical Vercel deployment target, and CI that refuses to promote broken forms.

## 16. Platform references used for the approved target

- [Vercel Astro deployment](https://vercel.com/docs/frameworks/frontend/astro): static Astro deployment, Git integration, Preview deployments, caching and image optimization capabilities.
- [Vercel deployment environments and promotion](https://vercel.com/docs/deployments/overview): Local, Preview and Production environments, generated deployment URLs, redeploy and promote workflows.
- [Formspree spam protection](https://help.formspree.io/articles/troubleshooting/how-to-prevent-spam): form IDs, spam filtering, reCAPTCHA, allowed-domain restriction and honeypot controls.
- [Formspree Cloudflare Turnstile](https://help.formspree.io/articles/form-and-project-settings/protecting-your-forms-with-cloudflare-turnstile): Turnstile configuration for AJAX form submissions.
- [Cloudinary client-side asset lists](https://cloudinary.com/documentation/list_assets): tagged public asset-list delivery and cache behavior.
- [Cloudinary Media Library uploads](https://cloudinary.com/documentation/dam_upload_store_assets): authenticated editor upload and media-management workflow.
- [Cloudinary responsive images](https://cloudinary.com/documentation/responsive_images): responsive transformations and optimized delivery.
