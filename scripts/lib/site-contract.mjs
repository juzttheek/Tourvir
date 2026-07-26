import path from 'node:path';

export const DEPLOYABLE_DIRECTORIES = Object.freeze(['css', 'images', 'js']);

export function isExternalReference(reference) {
  return /^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(reference);
}

export function cleanReference(reference) {
  return reference.split('#', 1)[0].split('?', 1)[0];
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
