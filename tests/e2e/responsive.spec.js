import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile Small', width: 320, height: 568 },
  { name: 'Mobile Modern', width: 390, height: 844 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 720 },
];

const routes = [
  '/index.html',
  '/packages.html',
  '/vehicles.html',
  '/gallery.html',
  '/inquiry.html',
  '/contact.html',
  '/privacy.html',
];

for (const route of routes) {
  test.describe(`Overflow diagnostics: ${route}`, () => {
    for (const vp of viewports) {
      test(`checks for horizontal overflow on ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route, { waitUntil: 'networkidle' });

        // Find elements wider than the viewport
        const overflowingElements = await page.evaluate(() => {
          const clientWidth = document.documentElement.clientWidth;
          const offenders = [];
          
          function isInsideOverflowContainer(element) {
            let parent = element.parentElement;
            while (parent && parent !== document.body) {
              const style = window.getComputedStyle(parent);
              if (['hidden', 'auto', 'scroll', 'clip'].includes(style.overflowX)) {
                return true;
              }
              parent = parent.parentElement;
            }
            return false;
          }

          document.querySelectorAll('*').forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.right > clientWidth || rect.width > clientWidth) {
              // Ignore script, style tags, and SVG internals
              if (['SCRIPT', 'STYLE', 'META', 'LINK', 'PATH', 'G', 'DEFS'].includes(el.tagName.toUpperCase())) return;
              
              // Ignore elements intentionally placed inside a scrolling/clipped container
              if (isInsideOverflowContainer(el)) return;
              
              offenders.push({
                tag: el.tagName,
                class: el.className,
                id: el.id,
                right: rect.right,
                width: rect.width,
                clientWidth
              });
            }
          });
          return offenders;
        });

        // Use custom message for better debugging output
        expect(
          overflowingElements.length,
          `Found overflowing elements: ${JSON.stringify(overflowingElements, null, 2)}`
        ).toBe(0);

        // Final sanity check on document width
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
      });
    }
  });
}
