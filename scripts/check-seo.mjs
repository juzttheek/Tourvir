import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { outputPathForSiteUrl, SITE_ORIGIN } from './lib/seo-contract.mjs';
import { resolveInside } from './lib/site-contract.mjs';

const root = resolveInside(process.cwd(), process.argv[2] ?? 'dist');
const failures = [];
const pageMetadata = [];

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

function hasSchemaType(value, expectedType) {
  const types = Array.isArray(value?.['@type']) ? value['@type'] : [value?.['@type']];
  return types.includes(expectedType);
}

function readSchemas(document, outputPath) {
  const schemas = [];
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const parsed = JSON.parse(script.textContent);
      const values = Array.isArray(parsed) ? parsed : [parsed];
      for (const value of values) {
        if (Array.isArray(value?.['@graph'])) schemas.push(...value['@graph']);
        else schemas.push(value);
      }
    } catch (error) {
      failures.push(`${outputPath}: invalid JSON-LD (${error.message})`);
    }
  }
  return schemas;
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
  const titleNodes = [...document.querySelectorAll('title')];
  const descriptionNodes = [...document.querySelectorAll('meta[name="description"]')];
  const title = titleNodes[0]?.textContent.trim() ?? '';
  const description = descriptionNodes[0]?.getAttribute('content')?.trim() ?? '';

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

  if (titleNodes.length !== 1 || !title) {
    failures.push(`${outputPath}: expected one non-empty title, found ${titleNodes.length}`);
  }
  if (descriptionNodes.length !== 1 || !description) {
    failures.push(
      `${outputPath}: expected one non-empty meta description, found ${descriptionNodes.length}`,
    );
  }
  pageMetadata.push({ outputPath, title, description });

  const expectedSocialMetadata = [
    ['meta[property="og:type"]', outputPath.startsWith('blog/') ? 'article' : 'website'],
    ['meta[property="og:site_name"]', 'Tourvir'],
    ['meta[property="og:locale"]', 'en_LK'],
    ['meta[property="og:url"]', normalizedSitemapUrl],
    ['meta[property="og:title"]', title],
    ['meta[property="og:description"]', description],
    ['meta[name="twitter:card"]', 'summary_large_image'],
    ['meta[name="twitter:url"]', normalizedSitemapUrl],
    ['meta[name="twitter:title"]', title],
    ['meta[name="twitter:description"]', description],
  ];
  for (const [selector, expectedValue] of expectedSocialMetadata) {
    const nodes = [...document.querySelectorAll(selector)];
    const value = nodes[0]?.getAttribute('content');
    if (nodes.length !== 1 || value !== expectedValue) {
      failures.push(
        `${outputPath}: ${selector} expected ${expectedValue}, found ${value ?? 'missing'} (${nodes.length} nodes)`,
      );
    }
  }

  if (document.querySelector('meta[property^="twitter:"]')) {
    failures.push(`${outputPath}: Twitter card tags must use the standard name attribute`);
  }
  const openGraphImage = document
    .querySelector('meta[property="og:image"]')
    ?.getAttribute('content');
  const openGraphImageAlt = document
    .querySelector('meta[property="og:image:alt"]')
    ?.getAttribute('content');
  const twitterImage = document
    .querySelector('meta[name="twitter:image"]')
    ?.getAttribute('content');
  const twitterImageAlt = document
    .querySelector('meta[name="twitter:image:alt"]')
    ?.getAttribute('content');
  if (!openGraphImage?.startsWith(`${SITE_ORIGIN}/`)) {
    failures.push(`${outputPath}: og:image must be an absolute preferred-origin URL`);
  }
  if (twitterImage !== openGraphImage) {
    failures.push(`${outputPath}: twitter:image must match og:image`);
  }
  if (!openGraphImageAlt || twitterImageAlt !== openGraphImageAlt) {
    failures.push(`${outputPath}: social image alt text is missing or inconsistent`);
  }

  const schemas = readSchemas(document, outputPath);
  if (schemas.some((schema) => JSON.stringify(schema).includes('AggregateRating'))) {
    failures.push(`${outputPath}: unverified AggregateRating schema is not allowed`);
  }
  if (schemas.some((schema) => /https:\/\/tourvir\.lk(?:\/|$)/.test(JSON.stringify(schema)))) {
    failures.push(`${outputPath}: structured data contains a legacy non-www URL`);
  }

  if (outputPath === 'index.html') {
    const agency = schemas.find((schema) => hasSchemaType(schema, 'TravelAgency'));
    if (
      !agency ||
      agency['@id'] !== `${SITE_ORIGIN}/#organization` ||
      agency.url !== `${SITE_ORIGIN}/` ||
      !agency.sameAs?.includes('https://www.instagram.com/tourvir.lk/')
    ) {
      failures.push('index.html: incomplete TravelAgency identity schema');
    }
  } else {
    const breadcrumb = schemas.find((schema) => hasSchemaType(schema, 'BreadcrumbList'));
    const visibleBreadcrumbs = [
      ...document.querySelectorAll('[aria-label="Breadcrumb"] [data-breadcrumb-name]'),
    ].map((node) => node.textContent.trim());
    const schemaBreadcrumbs = breadcrumb?.itemListElement ?? [];
    if (
      visibleBreadcrumbs.length < 2 ||
      schemaBreadcrumbs.length !== visibleBreadcrumbs.length ||
      schemaBreadcrumbs.some(
        (item, index) => item.position !== index + 1 || item.name !== visibleBreadcrumbs[index],
      ) ||
      schemaBreadcrumbs[0]?.item !== `${SITE_ORIGIN}/` ||
      schemaBreadcrumbs.at(-1)?.item !== normalizedSitemapUrl
    ) {
      failures.push(`${outputPath}: visible and structured breadcrumbs do not agree`);
    }
  }

  if (outputPath.startsWith('packages/')) {
    const trip = schemas.find((schema) => hasSchemaType(schema, 'TouristTrip'));
    if (
      !trip ||
      trip.url !== normalizedSitemapUrl ||
      trip.mainEntityOfPage !== normalizedSitemapUrl ||
      trip.description !== description ||
      trip.name !== document.querySelector('h1')?.textContent.trim() ||
      trip.image !== openGraphImage ||
      trip.provider?.['@id'] !== `${SITE_ORIGIN}/#organization` ||
      !hasSchemaType(trip.itinerary, 'ItemList')
    ) {
      failures.push(`${outputPath}: TouristTrip schema does not match visible page metadata`);
    }
  }

  if (outputPath.startsWith('blog/')) {
    const article = schemas.find((schema) => hasSchemaType(schema, 'BlogPosting'));
    if (
      !article ||
      article.url !== normalizedSitemapUrl ||
      article.mainEntityOfPage !== normalizedSitemapUrl ||
      article.description !== description ||
      article.headline !== document.querySelector('h1')?.textContent.trim() ||
      article.image !== openGraphImage ||
      article.publisher?.['@id'] !== `${SITE_ORIGIN}/#organization` ||
      !article.datePublished
    ) {
      failures.push(`${outputPath}: BlogPosting schema does not match visible page metadata`);
    }
  }
}

for (const field of ['title', 'description']) {
  const grouped = Map.groupBy(pageMetadata, (metadata) => metadata[field]);
  for (const [value, pages] of grouped) {
    if (value && pages.length > 1) {
      failures.push(
        `duplicate ${field} on ${pages.map((page) => page.outputPath).join(', ')}: ${value}`,
      );
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

const configuredRedirects = vercelConfig.redirects ?? [];
const duplicateRedirectSources = configuredRedirects
  .map((redirect) => redirect.source)
  .filter((source, index, sources) => sources.indexOf(source) !== index);
if (duplicateRedirectSources.length > 0) {
  failures.push(
    `vercel.json: duplicate redirect sources ${[...new Set(duplicateRedirectSources)].join(', ')}`,
  );
}

const expectedLegacyRedirects = sitemapUrls
  .map((sitemapUrl) => new URL(sitemapUrl).pathname)
  .filter((pathname) => pathname !== '/')
  .map((destination) => ({ source: destination.replace(/\.html$/, ''), destination }));

for (const expectedRedirect of expectedLegacyRedirects) {
  const configuredRedirect = configuredRedirects.find(
    (redirect) => redirect.source === expectedRedirect.source,
  );
  if (
    !configuredRedirect ||
    configuredRedirect.destination !== expectedRedirect.destination ||
    configuredRedirect.permanent !== true
  ) {
    failures.push(
      `vercel.json: missing permanent ${expectedRedirect.source} -> ${expectedRedirect.destination} redirect`,
    );
  }
}

const retiredArticleRedirects = [
  {
    source: '/blog/first-post',
    destination: '/blog/sigiriya-rock-fortress-guide.html',
  },
  {
    source: '/blog/first-post.html',
    destination: '/blog/sigiriya-rock-fortress-guide.html',
  },
];

for (const retiredRedirect of retiredArticleRedirects) {
  const configuredRedirect = configuredRedirects.find(
    (redirect) => redirect.source === retiredRedirect.source,
  );
  if (
    !configuredRedirect ||
    configuredRedirect.destination !== retiredRedirect.destination ||
    configuredRedirect.permanent !== true
  ) {
    failures.push(
      `vercel.json: missing direct permanent ${retiredRedirect.source} -> ${retiredRedirect.destination} redirect`,
    );
  }
}

if (vercelConfig.cleanUrls !== false) {
  failures.push('vercel.json: cleanUrls must remain false for the approved .html URL policy');
}

if (failures.length > 0) throw new Error(`SEO contract failures:\n${failures.join('\n')}`);
console.log(
  `Validated SEO URL contract across ${sitemapUrls.length} sitemap routes, ${expectedIndexableFiles.length} indexable HTML files and ${expectedLegacyRedirects.length} legacy redirects.`,
);
