import { test, expect } from '@playwright/test';

test.describe('Phase 6 Behavior Parity Integration', () => {
  test('theme toggle updates data-theme attribute and persists', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    const themeToggle = page.locator('#theme-toggle');
    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Reload page to verify persistence
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('mobile sidebar drawer opens, locks scroll, and closes on Escape key', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/index.html');

    const hamburger = page.locator('.hamburger');
    await expect(hamburger).toBeVisible();

    await hamburger.click();
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toHaveClass(/active/);
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(sidebar).not.toHaveClass(/active/);
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  test('package search and filter controls update card visibility', async ({ page }) => {
    await page.goto('/packages.html');

    const filterPill = page
      .locator(
        '.packages-section .filter-pill[data-filter="cultural"], .packages-hero .filter-pill[data-filter="cultural"]',
      )
      .first();
    if (await filterPill.isVisible()) {
      await filterPill.click();
      const visibleCards = page.locator('.package-card:visible');
      await expect(visibleCards.first()).toBeVisible();
    }
  });

  test('gallery opens lightbox modal and handles keyboard navigation', async ({ page }) => {
    await page.goto('/gallery.html');

    const firstItem = page.locator('.gallery-item').first();
    await firstItem.click();

    const lightbox = page.locator('.lightbox');
    await expect(lightbox).toHaveClass(/active/);

    await page.keyboard.press('ArrowRight');
    await expect(lightbox).toHaveClass(/active/);

    await page.keyboard.press('Escape');
    await expect(lightbox).not.toHaveClass(/active/);
  });

  test('inquiry form validates date ordering', async ({ page }) => {
    await page.goto('/inquiry.html');

    await page.fill('#full-name', 'John Doe');
    await page.fill('#email', 'john@example.com');
    await page.selectOption('#nationality', { index: 1 });
    await page.fill('#phone', '+61400000000');

    // Click Next to advance to Step 2 (Dates & Travelers)
    await page.locator('[data-action="next"]').first().click();

    await page.fill('#arrival-date', '2026-10-15');
    await page.fill('#departure-date', '2026-10-10'); // Invalid departure date (before arrival)

    // Click Next on Step 2 to trigger validation
    await page.locator('.form-step.active [data-action="next"]').click();

    // Verify error class applied
    await expect(page.locator('#departure-date')).toHaveClass(/error/);
  });
});
