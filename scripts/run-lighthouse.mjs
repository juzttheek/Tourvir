import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';

const sitePort = 4173;
const routes = ['index.html', 'gallery.html', 'contact.html'];
const outputDirectory = path.resolve('.lighthouseci/results');

async function reservePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string')
        return reject(new Error('Could not reserve a port'));
      server.close(() => resolve(address.port));
    });
  });
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Static server did not become ready at ${url}`);
}

function score(result, category) {
  return result.lhr.categories[category]?.score ?? 0;
}

const debuggingPort = await reservePort();
const server = spawn(process.execPath, ['scripts/serve-static.mjs', 'dist', String(sitePort)], {
  stdio: ['ignore', 'pipe', 'inherit'],
});

let browser;
let failed = false;

try {
  await waitForServer(`http://127.0.0.1:${sitePort}/index.html`);
  browser = await chromium.launch({
    headless: true,
    args: [`--remote-debugging-port=${debuggingPort}`],
  });
  await mkdir(outputDirectory, { recursive: true });

  for (const route of routes) {
    const url = `http://127.0.0.1:${sitePort}/${route}`;
    const result = await lighthouse(url, {
      port: debuggingPort,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });
    if (!result) throw new Error(`Lighthouse returned no result for ${url}`);

    await writeFile(path.join(outputDirectory, `${path.parse(route).name}.json`), result.report);

    const scores = {
      performance: score(result, 'performance'),
      accessibility: score(result, 'accessibility'),
      bestPractices: score(result, 'best-practices'),
      seo: score(result, 'seo'),
      cls: result.lhr.audits['cumulative-layout-shift']?.numericValue ?? Number.POSITIVE_INFINITY,
    };
    console.log(`${route}: ${JSON.stringify(scores)}`);

    if (scores.accessibility < 0.7) {
      console.error(`${route}: accessibility score must be at least 0.70`);
      failed = true;
    }
    for (const [name, value, minimum] of [
      ['performance', scores.performance, 0.45],
      ['best-practices', scores.bestPractices, 0.7],
      ['seo', scores.seo, 0.7],
    ]) {
      if (value < minimum)
        console.warn(`${route}: ${name} score ${value} is below warning budget ${minimum}`);
    }
    if (scores.cls > 0.25) {
      console.warn(`${route}: CLS ${scores.cls} exceeds warning budget 0.25`);
    }
  }
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}

if (failed) process.exitCode = 1;
