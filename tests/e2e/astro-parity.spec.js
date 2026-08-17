import { expect, test } from '@playwright/test';

const routeContracts = [
  ['/', 'Discover the Pearl of the Indian Ocean'],
  ['/packages.html', 'Tour Packages'],
  ['/vehicles.html', 'Our Vehicle Fleet'],
  ['/gallery.html', 'Photo Gallery'],
  ['/inquiry.html', 'Plan Your Dream Trip'],
  ['/contact.html', 'Contact Us'],
  ['/privacy.html', 'Privacy Policy'],
  ['/terms.html', 'Terms of Service'],
  ['/cookies.html', 'Cookie Policy'],
  ['/blog.html', 'Tourvir Blog'],
];

for (const [route, expectedHeading] of routeContracts) {
  test(`${route} satisfies the current page-shell contract`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

    expect(response?.status()).toBe(200);
    expect(await page.locator('html').getAttribute('lang')).toBe('en');
    expect((await page.title()).trim()).not.toBe('');
    await expect(page.locator('h1')).toHaveText(expectedHeading);
    await expect(page.locator('main#main-content')).toHaveCount(1);
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
  });
}

for (const [route, expectedHeading] of [
  ['/packages/package-1-cultural-triangle-explorer.html', 'Cultural Triangle Explorer'],
  ['/blog/kandy-temple-of-tooth.html', /Spiritual Journey to Kandy/],
]) {
  test(`${route} renders its generated content contract`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText(expectedHeading);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  });
}
