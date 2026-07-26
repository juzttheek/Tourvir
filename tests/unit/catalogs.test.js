import { access } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { tourPackages, vehicles } from '../../src/content/catalogs';

describe('typed catalogs', () => {
  it('uses unique stable IDs and existing images', async () => {
    for (const items of [tourPackages, vehicles]) {
      expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
      for (const item of items) {
        expect(item.alt).not.toBe('');
        await expect(
          access(new URL(`../../public/${item.image}`, import.meta.url)),
        ).resolves.toBeUndefined();
      }
    }
  });

  it('keeps filter values and prices valid', () => {
    expect(tourPackages).toHaveLength(6);
    for (const item of tourPackages) {
      expect(item.category).toMatch(/^(cultural|beach|wildlife|adventure|honeymoon)$/);
      expect(item.duration).toBeGreaterThan(0);
      expect(item.price).toBeGreaterThan(0);
    }
    expect(vehicles).toHaveLength(8);
  });
});
