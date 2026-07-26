import { expect, test } from '@playwright/test';

const routes = [
  '/index.html',
  '/packages.html',
  '/vehicles.html',
  '/gallery.html',
  '/inquiry.html',
  '/contact.html',
  '/privacy.html',
  '/terms.html',
  '/cookies.html',
];

for (const route of routes) {
  test(`${route} renders without page errors`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}

test('gallery exposes local content without an admin control', async ({ page }) => {
  await page.goto('/gallery.html');
  await expect(page.locator('.gallery-item')).toHaveCount(6);
  await expect(page.locator('#admin-trigger, #admin-panel')).toHaveCount(0);
});

test('contact provider failure is honest and preserves values', async ({ page }) => {
  await page.route('https://formspree.io/f/**', (route) => route.abort('failed'));
  await page.goto('/contact.html');
  await page.locator('#contact-name').fill('Phase Three Test');
  await page.locator('#contact-email').fill('phase3@example.com');
  await page.locator('#contact-subject').selectOption('general');
  await page.locator('#contact-message').fill('Validation only; do not deliver.');
  await page.check('#contact-consent');
  await page.locator('#contact-form button[type="submit"]').click();
  const toast = page.locator('.toast');
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('Network error');
  await expect(page.locator('#contact-name')).toHaveValue('Phase Three Test');
});
