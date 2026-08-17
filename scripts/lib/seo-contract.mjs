export const SITE_ORIGIN = 'https://www.tourvir.lk';

export function canonicalPathFor(pathname) {
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return withLeadingSlash === '/index.html' ? '/' : withLeadingSlash;
}

export function serializeSitemapItem(item) {
  const url = new URL(item.url);
  if (url.origin !== SITE_ORIGIN) {
    throw new Error(`Unexpected sitemap origin: ${url.origin}`);
  }

  const canonicalPath = canonicalPathFor(url.pathname);
  url.pathname =
    canonicalPath === '/' || canonicalPath.endsWith('.html')
      ? canonicalPath
      : `${canonicalPath.replace(/\/$/, '')}.html`;

  return { ...item, url: url.href };
}

export function outputPathForSiteUrl(value) {
  const url = new URL(value);
  if (url.origin !== SITE_ORIGIN || url.search || url.hash) return null;
  if (url.pathname === '/') return 'index.html';
  if (!url.pathname.endsWith('.html')) return null;
  return decodeURIComponent(url.pathname.replace(/^\/+/, ''));
}
