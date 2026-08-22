import { readFile, readdir } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { listFilesRecursive, resolveInside } from './lib/site-contract.mjs';

const root = resolveInside(process.cwd(), process.argv[2] ?? '.');
const siteFiles = await listFilesRecursive(root);
const htmlFiles = siteFiles.filter((name) => name.endsWith('.html') && !name.startsWith('admin/'));
const forbiddenRuntime =
  /firebase|firestore|tourvir-fd341|gallery-admin|admin-trigger|admin-panel/i;
const failures = [];

for (const filename of htmlFiles) {
  const html = await readFile(resolveInside(root, filename), 'utf8');
  const document = new JSDOM(html).window.document;
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;

  if (duplicateIds.length > 0)
    failures.push(`${filename}: duplicate IDs ${duplicateIds.join(', ')}`);
  if (h1Count !== 1) failures.push(`${filename}: expected one h1, found ${h1Count}`);
  if (forbiddenRuntime.test(html)) failures.push(`${filename}: legacy Firebase/admin marker`);
  if (/\bhref=["']#["']/i.test(html)) failures.push(`${filename}: dead placeholder link`);
  if (/package-card__rating(?:-text)?/i.test(html)) {
    failures.push(`${filename}: unsupported package rating or review count`);
  }
  if (/Licensed by the Sri Lanka Tourism Development Authority/i.test(html)) {
    failures.push(`${filename}: unverified tourism-authority licence claim`);
  }
  if (
    /24 Hours Guaranteed|get back to you within 24 hours|fully customizable|trained in first aid/i.test(
      html,
    )
  ) {
    failures.push(`${filename}: unsupported service or response guarantee`);
  }

  if (filename === 'index.html') {
    const hero = document.querySelector('#hero-slider');
    const directHeroImages = [...(hero?.children ?? [])].filter((node) => node.tagName === 'IMG');
    const deferredHeroSlides = hero?.querySelectorAll('template[data-hero-slide]') ?? [];
    const destinationLinks = document.querySelectorAll('a.destination-card[href^="/packages/"]');
    if (directHeroImages.length !== 1 || deferredHeroSlides.length !== 10) {
      failures.push(
        `${filename}: expected one initial hero image and ten deferred slides, found ${directHeroImages.length} and ${deferredHeroSlides.length}`,
      );
    }
    if (destinationLinks.length !== 3) {
      failures.push(`${filename}: expected three package-linked destination cards`);
    }
    if (
      [...document.querySelectorAll('[data-count]')].some((node) => node.textContent.trim() === '0')
    ) {
      failures.push(`${filename}: counters must expose real no-JS values`);
    }
    if (/Colombo:\s*--|Exchange Rates:\s*Loading/i.test(html)) {
      failures.push(`${filename}: unresolved widget fallback`);
    }
  }

  if (filename.startsWith('packages/')) {
    const relatedTours = document.querySelectorAll(
      '.context-links a.context-link[href^="/packages/"]',
    );
    if (
      !document.querySelector('a[href="/vehicles.html"]') ||
      !document.querySelector('a[href="/inquiry.html#trip-planning-faq"]') ||
      relatedTours.length < 3
    ) {
      failures.push(`${filename}: incomplete vehicle, FAQ, or related-tour link model`);
    }
  }

  if (filename.startsWith('blog/')) {
    const article = document.querySelector('article');
    const relatedPackages = article?.querySelectorAll('a.context-link[href^="/packages/"]') ?? [];
    if (
      (article?.querySelectorAll('h2').length ?? 0) < 2 ||
      relatedPackages.length < 2 ||
      !article?.querySelector('a[href="/vehicles.html"]') ||
      !article?.querySelector('a[href="/inquiry.html#trip-planning-faq"]')
    ) {
      failures.push(`${filename}: incomplete guide structure or contextual planning links`);
    }
  }

  if (filename === 'vehicles.html') {
    const comparison = document.querySelector(
      '.comparison-table-wrapper[role="region"][tabindex="0"]',
    );
    if (
      !comparison?.querySelector('caption') ||
      comparison.querySelectorAll('th[scope="row"]').length < 7
    ) {
      failures.push(`${filename}: vehicle comparison is missing its accessible mobile structure`);
    }
  }

  if (filename === 'inquiry.html' && !document.querySelector('#trip-planning-faq')) {
    failures.push(`${filename}: trip-planning FAQ has no stable link target`);
  }

  if (filename === 'gallery.html') {
    const galleryItemCount = (html.match(/<article\s+class=["']gallery-item(?:\s|["'])/gi) ?? [])
      .length;
    if (galleryItemCount === 0) failures.push(`${filename}: no gallery entries rendered`);
    if (!new RegExp(`>${galleryItemCount}<\\/div>\\s*<div[^>]*>Gallery Images<`, 'i').test(html)) {
      failures.push(`${filename}: visible gallery count does not match rendered entries`);
    }
    if (/>\s*(?:asd|logo)\s*</i.test(html) || /GrowEasy Plant Growing Kit/i.test(html)) {
      failures.push(`${filename}: test or unrelated gallery content`);
    }
  }
}

for (const removedAsset of [
  'videos/hero-bg.mp4',
  'images/uploads/hero_18bends_hq.webp',
  'images/uploads/tea_plantation.webp',
]) {
  if (siteFiles.includes(removedAsset))
    failures.push(`${removedAsset}: duplicate or unused media remains`);
}

const assetDirectory = resolveInside(root, '_assets');
const scripts = await Promise.all(
  (await readdir(assetDirectory))
    .filter((name) => name.endsWith('.js'))
    .map(async (name) => [name, await readFile(resolveInside(assetDirectory, name), 'utf8')]),
);

for (const [name, source] of scripts) {
  if (forbiddenRuntime.test(source)) failures.push(`js/${name}: legacy Firebase/admin marker`);
  if (/sent successfully|submitted successfully/i.test(source)) {
    failures.push(`js/${name}: unconfirmed success message`);
  }
}

if (failures.length > 0) throw new Error(failures.join('\n'));
console.log(
  `Validated content contracts across ${htmlFiles.length} routes and ${scripts.length} scripts.`,
);
