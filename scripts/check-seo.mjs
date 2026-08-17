import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { outputPathForSiteUrl, SITE_ORIGIN } from './lib/seo-contract.mjs';
import { resolveInside } from './lib/site-contract.mjs';

const root = resolveInside(process.cwd(), process.argv[2] ?? 'dist');
const failures = [];

async function walkHtml(relativeDirectory = '') {
  const directory = resolveInside(root, relativeDirectory);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) files.push(...(await walkHtml(relativePath)));
    else if (entry.name.endsWith('.html')) files.push(relativePath);
  }

  return files.sort();
}

function xmlLocations(source) {
  return [...source.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

const robots = await readFile(resolveInside(root, 'robots.txt'), 'utf8');
const expectedSitemapIndex = `${SITE_ORIGIN}/sitemap-index.xml`;
if (!robots.includes(`Sitemap: ${expectedSitemapIndex}`)) {
  failures.push(`robots.txt: expected sitemap ${expectedSitemapIndex}`);
}

const sitemapIndex = await readFile(resolveInside(root, 'sitemap-index.xml'), 'utf8');
const sitemapReferences = xmlLocations(sitemapIndex);
if (sitemapReferences.length !== 1 || sitemapReferences[0] !== `${SITE_ORIGIN}/sitemap-0.xml`) {
  failures.push(`sitemap-index.xml: unexpected child sitemap ${sitemapReferences.join(', ')}`);
}

const sitemap = await readFile(resolveInside(root, 'sitemap-0.xml'), 'utf8');
const sitemapUrls = xmlLocations(sitemap);
const sitemapUrlSet = new Set(sitemapUrls);
if (sitemapUrlSet.size !== sitemapUrls.length) failures.push('sitemap-0.xml: duplicate URLs');

const indexedOutputFiles = new Set();

for (const sitemapUrl of sitemapUrls) {
  const normalizedSitemapUrl = new URL(sitemapUrl).href;
  const outputPath = outputPathForSiteUrl(normalizedSitemapUrl);
  if (!outputPath) {
    failures.push(`sitemap-0.xml: non-canonical or non-file URL ${sitemapUrl}`);
    continue;
  }

  try {
    await access(resolveInside(root, outputPath));
  } catch {
    failures.push(`sitemap-0.xml: missing output for ${sitemapUrl} (${outputPath})`);
    continue;
  }

  indexedOutputFiles.add(outputPath);
  const html = await readFile(resolveInside(root, outputPath), 'utf8');
  const document = new JSDOM(html).window.document;
  const canonicals = [...document.querySelectorAll('link[rel="canonical"]')];
  const canonical = canonicals[0]?.getAttribute('href');
  const openGraphUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content');
  const robotsMeta = document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';

  if (canonicals.length !== 1) {
    failures.push(`${outputPath}: expected exactly one canonical, found ${canonicals.length}`);
  }
  if (canonical !== normalizedSitemapUrl) {
    failures.push(`${outputPath}: canonical ${canonical ?? 'missing'} != ${normalizedSitemapUrl}`);
  }
  if (openGraphUrl !== normalizedSitemapUrl) {
    failures.push(`${outputPath}: og:url ${openGraphUrl ?? 'missing'} != ${normalizedSitemapUrl}`);
  }
  if (/\bnoindex\b/i.test(robotsMeta)) failures.push(`${outputPath}: sitemap route is noindex`);
  if (/https:\/\/tourvir\.lk(?:\/|["'])/.test(html)) {
    failures.push(`${outputPath}: contains legacy non-www absolute URL`);
  }

  for (const anchor of document.querySelectorAll('a[href]')) {
    const href = anchor.getAttribute('href');
    if (href === '/index.html' || href === 'index.html') {
      failures.push(`${outputPath}: legacy homepage link ${href}`);
    }
  }
}

const htmlFiles = await walkHtml();
const expectedIndexableFiles = htmlFiles.filter(
  (file) => file !== '404.html' && !file.startsWith('admin/'),
);
for (const htmlFile of expectedIndexableFiles) {
  if (!indexedOutputFiles.has(htmlFile)) failures.push(`${htmlFile}: missing from sitemap`);
}
for (const outputFile of indexedOutputFiles) {
  if (!expectedIndexableFiles.includes(outputFile)) {
    failures.push(`${outputFile}: sitemap entry is not an indexable HTML route`);
  }
}

const vercelConfig = JSON.parse(
  await readFile(resolveInside(process.cwd(), 'vercel.json'), 'utf8'),
);
const homepageRedirect = vercelConfig.redirects?.find(
  (redirect) => redirect.source === '/index.html',
);
if (
  !homepageRedirect ||
  homepageRedirect.destination !== '/' ||
  homepageRedirect.permanent !== true
) {
  failures.push('vercel.json: missing permanent /index.html -> / redirect');
}
if (vercelConfig.cleanUrls !== false) {
  failures.push('vercel.json: cleanUrls must remain false for the approved .html URL policy');
}

if (failures.length > 0) throw new Error(`SEO contract failures:\n${failures.join('\n')}`);
console.log(
  `Validated SEO URL contract across ${sitemapUrls.length} sitemap routes and ${expectedIndexableFiles.length} indexable HTML files.`,
);
