const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://sveltiacms.app/docs/media', { waitUntil: 'networkidle' });
  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('docs.txt', text);
  await browser.close();
})();
