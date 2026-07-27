import path from 'node:path';

export const DEPLOYABLE_DIRECTORIES = Object.freeze(['_assets', 'css', 'images']);
export const HTML_ROUTES = Object.freeze([
  'index.html',
  'packages.html',
  'vehicles.html',
  'gallery.html',
  'inquiry.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  'cookies.html',
  '404.html',
  'robots.txt',
  'sitemap-0.xml',
  'sitemap-index.xml',
]);

export function isExternalReference(reference) {
  return /^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(reference);
}

export function cleanReference(reference) {
  return reference.split('#', 1)[0].split('?', 1)[0].replace(/^\/+/, '');
}

export function resolveInside(root, relativePath) {
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, relativePath);
  const prefix = `${resolvedRoot}${path.sep}`;

  if (resolved !== resolvedRoot && !resolved.startsWith(prefix)) {
    throw new Error(`Path escapes the site root: ${relativePath}`);
  }

  return resolved;
}
