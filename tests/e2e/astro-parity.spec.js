import { expect, test } from '@playwright/test';

test.setTimeout(45_000);

const routes = [
  'index.html',
  'packages.html',
  'vehicles.html',
  'gallery.html',
  'inquiry.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  'cookies.html',
];

for (const route of routes) {
  test(`${route} preserves the legacy DOM contract`, async ({ page }) => {
    await page.goto(`http://127.0.0.1:4174/${route}`, { waitUntil: 'domcontentloaded' });
    const legacy = await page.locator('body').evaluate((body) => ({
      headings: [...body.querySelectorAll('h1, h2, h3')].map((element) =>
        element.textContent.replace(/\s+/g, ' ').trim(),
      ),
      controls: [...body.querySelectorAll('input, select, textarea, button[type="submit"]')].map(
        (element) => `${element.tagName}:${element.id}:${element.getAttribute('name') ?? ''}`,
      ),
    }));
    await page.goto(`http://127.0.0.1:4173/${route}`, { waitUntil: 'domcontentloaded' });
    const built = await page.locator('body').evaluate((body) => ({
      headings: [...body.querySelectorAll('h1, h2, h3')].map((element) =>
        element.textContent.replace(/\s+/g, ' ').trim(),
      ),
      controls: [...body.querySelectorAll('input, select, textarea, button[type="submit"]')].map(
        (element) => `${element.tagName}:${element.id}:${element.getAttribute('name') ?? ''}`,
      ),
    }));
    expect(built).toEqual(legacy);
  });
}

for (const route of ['privacy.html', 'packages.html', 'vehicles.html']) {
  test(`${route} preserves the primary desktop rendering`, async ({ page }) => {
    const capture = async (port) => {
      await page.goto(`http://127.0.0.1:${port}/${route}`, { waitUntil: 'networkidle' });
      await page.addStyleTag({
        content: '*,*::before,*::after{animation:none!important;transition:none!important}',
      });
      const screenshot = await page.screenshot({ animations: 'disabled', fullPage: true });
      const boxes = await page.locator('header, main, footer').evaluateAll((elements) =>
        elements.map((element) => {
          const box = element.getBoundingClientRect();
          return { width: Math.round(box.width), height: Math.round(box.height) };
        }),
      );
      return { boxes, bytes: screenshot.length };
    };

    const legacy = await capture(4174);
    const built = await capture(4173);
    expect(built.boxes).toEqual(legacy.boxes);
    expect(Math.abs(built.bytes - legacy.bytes) / legacy.bytes).toBeLessThan(0.15);
  });
}
