import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`gallery produces a non-empty ${viewport.name} screenshot`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto('/gallery.html');
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot.byteLength).toBeGreaterThan(10_000);
    await testInfo.attach(`gallery-${viewport.name}`, {
      body: screenshot,
      contentType: 'image/png',
    });
  });
}
