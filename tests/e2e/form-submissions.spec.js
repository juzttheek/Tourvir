import { test, expect } from '@playwright/test';

async function acceptFormspree(page, onPayload) {
  await page.route('https://formspree.io/f/**', async (route) => {
    onPayload(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'test-reference' }),
    });
  });
}

test('contact submits its complete approved payload', async ({ page }) => {
  let payload;
  await acceptFormspree(page, (value) => (payload = value));
  await page.goto('/contact.html');
  await page.fill('#contact-name', 'Test User');
  await page.fill('#contact-email', 'test@example.com');
  await page.fill('#contact-phone', '1234567890');
  await page.selectOption('#contact-subject', 'booking');
  await page.fill('#contact-message', 'Test message');
  await page.check('#contact-consent');
  await page.click('#contact-form button[type="submit"]');
  await expect(page.locator('.toast')).toContainText('received successfully');
  expect(payload).toMatchObject({ name: 'Test User', subject: 'booking', privacyConsent: true });
});

test('feedback submits identity, tour, rating and consent', async ({ page }) => {
  let payload;
  await acceptFormspree(page, (value) => (payload = value));
  await page.goto('/index.html#feedback');
  await page.fill('#feedback-name', 'Test User');
  await page.fill('#feedback-email', 'test@example.com');
  await page.fill('#feedback-country', 'United Kingdom');
  await page.selectOption('#feedback-tour', 'cultural-triangle');
  await page.locator('.feedback-form__star[data-rating="5"]').click();
  await page.fill('#feedback-message', 'Great trip!');
  await page.check('#feedback-consent');
  await page.click('#feedback-submit');
  await expect(page.locator('.toast')).toContainText('received successfully');
  expect(payload).toMatchObject({
    name: 'Test User',
    tour: 'cultural-triangle',
    rating: 5,
    testimonialConsent: true,
  });
});

test('inquiry translates visible choices into approved values', async ({ page }) => {
  let payload;
  await acceptFormspree(page, (value) => (payload = value));
  await page.goto('/inquiry.html');
  await page.fill('#full-name', 'Test User');
  await page.fill('#email', 'test@example.com');
  await page.selectOption('#nationality', 'AU');
  await page.locator('.form-step.active [data-action="next"]').click();
  await page.fill('#arrival-date', '2027-01-10');
  await page.fill('#departure-date', '2027-01-15');
  await page.selectOption('#travelers', '2');
  await page.getByRole('button', { name: /Wildlife Safari/ }).click();
  await page.locator('.form-step.active [data-action="next"]').click();
  await page.locator('.form-step.active [data-action="next"]').click();
  await page.check('#terms-consent');
  await page.locator('#inquiry-form button[type="submit"]').click();
  await expect(page.locator('.toast')).toContainText('received successfully');
  expect(payload).toMatchObject({
    nationality: 'AU',
    travelers: 2,
    interests: ['wildlife'],
    accommodation: 'standard',
    termsConsent: true,
  });
});
