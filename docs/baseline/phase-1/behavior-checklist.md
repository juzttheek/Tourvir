# Baseline behavior checklist

Use this checklist during migration. Items marked **known failure/security issue** must be fixed, not preserved as desired parity.

## Global on every route

- Header/logo/navigation render.
- Desktop navigation changes to hamburger below the current breakpoint.
- Drawer opens/closes by hamburger, overlay, close button and Escape.
- Theme toggle persists `Tourvir-theme` in local storage.
- Header changes style after scrolling.
- Back-to-top appears after scrolling and scrolls smoothly.
- Reveal classes become visible through `IntersectionObserver`.
- Footer and floating phone/WhatsApp actions render.
- Firebase compat App/Firestore initialize globally, even on pages that do not use them.

## Home (`index.html`)

- Eleven hero images rotate every five seconds with a scale/crossfade.
- Hero CTA links to packages and gallery.
- Statistics count once when visible.
- Services, feature cards, mini gallery and testimonials render.
- Testimonials rotate every five seconds and dots change slides.
- Feedback stars respond to hover/click; reset returns the form.
- **Known failure:** feedback submission reads nonexistent `feedback-email` while markup supplies `feedback-country`; submission throws before Firestore.

## Packages (`packages.html`)

- Text search filters cards by title.
- Duration and price selectors filter the package set.
- Category pills show matching cards.
- Featured package and six standard package cards render.
- Inline Search button dispatches an input event.

## Vehicles (`vehicles.html`)

- Vehicle filter/navigation strip is horizontally scrollable where needed.
- Eight vehicle cards and chauffeur section render.
- Booking actions navigate to inquiry/contact destinations.

## Gallery (`gallery.html`)

- Static gallery content, category pills and lightbox render.
- Lightbox opens from a visible card and supports close, previous, next and keyboard arrows.
- Dynamic gallery attempts to read `gallery_images` from Firestore.
- **Security issue:** public page exposes an admin trigger, documented default password hash, Storage upload/delete and Firestore mutation code.
- **Security issue:** remote Firestore metadata is interpolated into `innerHTML`.

## Inquiry (`inquiry.html`)

- Stepper renders personal, travel, preferences and review steps.
- Next validates the current step; Previous returns to prior step.
- Interest and accommodation choices toggle.
- Review step summarizes visible fields.
- FAQ accordion toggles.
- **Known failure:** submit serializer requests multiple nonexistent IDs (`destinations`, `date`, `name`, `special-requests`, etc.) and throws before Firestore.
- **Reliability issue:** missing-Firebase fallback reports false success.

## Contact (`contact.html`)

- Contact cards, map section and form render.
- Markup and JavaScript IDs currently align for name/email/subject/message.
- Successful Firestore write resets form and shows a toast.
- **Reliability issue:** missing-Firebase fallback reports false success without delivery.

## Legal routes

- Cookies, Privacy and Terms bodies render with shared contact-page styling/chrome.
- **SEO/content issue:** all three use the Contact page title instead of unique legal titles.

## Responsive baseline observation

The 390×844 home screenshots visibly capture current horizontal clipping: part of the header CTA is outside the viewport and hero heading/body/button content is clipped on the right. This is defect evidence for the responsive phase, not intended parity.
