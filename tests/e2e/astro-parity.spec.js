import { expect, test } from '@playwright/test';

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
      text: body.textContent.replace(/\s+/g, ' ').trim(),
      ids: [...body.querySelectorAll('[id]')].map((element) => element.id),
      links: [...body.querySelectorAll('a')].map((link) => link.getAttribute('href')),
    }));
    await page.goto(`http://127.0.0.1:4173/${route}`, { waitUntil: 'domcontentloaded' });
    const built = await page.locator('body').evaluate((body) => ({
      text: body.textContent.replace(/\s+/g, ' ').trim(),
      ids: [...body.querySelectorAll('[id]')].map((element) => element.id),
      links: [...body.querySelectorAll('a')].map((link) => link.getAttribute('href')),
    }));
    expect(built).toEqual(legacy);
  });
}

for (const route of ['privacy.html', 'index.html', 'gallery.html']) {
  test(`${route} preserves the primary desktop rendering`, async ({ page }) => {
    const capture = async (port) => {
      await page.goto(`http://127.0.0.1:${port}/${route}`, { waitUntil: 'networkidle' });
      await page.addStyleTag({
        content: '*,*::before,*::after{animation:none!important;transition:none!important}',
      });
      return page.screenshot({ animations: 'disabled', fullPage: true });
    };

    const legacy = await capture(4174);
    const built = await capture(4173);
    expect(Buffer.compare(built, legacy)).toBe(0);
  });
}
