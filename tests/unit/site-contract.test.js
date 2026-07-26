import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  cleanReference,
  isExternalReference,
  resolveInside,
} from '../../scripts/lib/site-contract.mjs';

describe('site contract helpers', () => {
  it('cleans query strings and fragments from local references', () => {
    expect(cleanReference('js/main.js?v=2#start')).toBe('js/main.js');
  });

  it('recognizes external and document-only references', () => {
    expect(isExternalReference('https://example.com')).toBe(true);
    expect(isExternalReference('mailto:hello@example.com')).toBe(true);
    expect(isExternalReference('#gallery')).toBe(true);
    expect(isExternalReference('gallery.html')).toBe(false);
  });

  it('rejects paths escaping the selected site root', () => {
    const root = path.resolve('site-root');
    expect(() => resolveInside(root, '../secret.txt')).toThrow(/escapes the site root/);
    expect(resolveInside(root, 'images/photo.webp')).toBe(path.join(root, 'images', 'photo.webp'));
  });
});
