import { expect, test } from '@playwright/test';

test('homepage defers non-primary hero media and exposes real destination links', async ({
  page,
}) => {
  const heroRequests = [];
  page.on('request', (request) => {
    if (/\/images\/(?:responsive\/)?hero\/hero_.*\.webp/.test(request.url())) {
      heroRequests.push(request.url());
    }
  });

  await page.goto('/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  await expect(page.locator('#hero-slider > img')).toHaveCount(2);
  await expect(page.locator('#hero-slider template[data-hero-slide]')).toHaveCount(10);
  await expect(page.locator('a.destination-card[href^="/packages/"]')).toHaveCount(3);
  expect(new Set(heroRequests).size).toBeLessThanOrEqual(2);
});

test('weather and currency failures retain honest static fallbacks', async ({ page }) => {
  await page.route('https://api.open-meteo.com/**', (route) => route.abort('failed'));
  await page.route('https://open.er-api.com/**', (route) => route.abort('failed'));

  await page.goto('/index.html');
  await expect(page.locator('#topbar-weather')).toHaveText(
    'Colombo weather: check current conditions',
  );
  await expect(page.locator('#topbar-currency')).toHaveText('Exchange rates: check current rates');
});

test('vehicle comparison remains usable at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/vehicles.html');

  const comparison = page.locator('.comparison-table-wrapper');
  await expect(comparison).toBeVisible();
  await expect(page.locator('.comparison-scroll-hint')).toBeVisible();
  await comparison.focus();
  await expect(comparison).toBeFocused();

  const layout = await comparison.evaluate((element) => {
    const rowHeader = element.querySelector('tbody th[scope="row"]');
    return {
      canScroll: element.scrollWidth > element.clientWidth,
      rowHeaderPosition: rowHeader ? getComputedStyle(rowHeader).position : '',
    };
  });
  expect(layout.canScroll).toBe(true);
  expect(layout.rowHeaderPosition).toBe('sticky');
});
