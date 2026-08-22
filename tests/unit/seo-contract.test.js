import { describe, expect, it } from 'vitest';
import {
  SITE_ORIGIN,
  canonicalPathFor,
  outputPathForSiteUrl,
  serializeSitemapItem,
} from '../../scripts/lib/seo-contract.mjs';

describe('SEO URL contract helpers', () => {
  it('uses the public www origin', () => {
    expect(SITE_ORIGIN).toBe('https://www.tourvir.lk');
  });

  it('canonicalizes the legacy homepage route to the root', () => {
    expect(canonicalPathFor('/index.html')).toBe('/');
    expect(canonicalPathFor('index.html')).toBe('/');
    expect(canonicalPathFor('/packages.html')).toBe('/packages.html');
  });

  it('serializes generated Astro routes to deployed file URLs', () => {
    expect(serializeSitemapItem({ url: `${SITE_ORIGIN}/` }).url).toBe(`${SITE_ORIGIN}/`);
    expect(serializeSitemapItem({ url: `${SITE_ORIGIN}/packages` }).url).toBe(
      `${SITE_ORIGIN}/packages.html`,
    );
    expect(
      serializeSitemapItem({ url: `${SITE_ORIGIN}/blog/sigiriya-rock-fortress-guide` }).url,
    ).toBe(`${SITE_ORIGIN}/blog/sigiriya-rock-fortress-guide.html`);
  });

  it('rejects sitemap items generated for another origin', () => {
    expect(() => serializeSitemapItem({ url: 'https://tourvir.lk/packages' })).toThrow(
      /Unexpected sitemap origin/,
    );
  });

  it('maps canonical site URLs to static output files', () => {
    expect(outputPathForSiteUrl(`${SITE_ORIGIN}/`)).toBe('index.html');
    expect(outputPathForSiteUrl(`${SITE_ORIGIN}/packages.html`)).toBe('packages.html');
    expect(outputPathForSiteUrl(`${SITE_ORIGIN}/blog/sigiriya-rock-fortress-guide.html`)).toBe(
      'blog/sigiriya-rock-fortress-guide.html',
    );
    expect(outputPathForSiteUrl(`${SITE_ORIGIN}/packages`)).toBeNull();
    expect(outputPathForSiteUrl('https://tourvir.lk/packages.html')).toBeNull();
  });
});
