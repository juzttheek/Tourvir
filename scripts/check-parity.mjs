import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { HTML_ROUTES, resolveInside } from './lib/site-contract.mjs';

const repository = process.cwd();
const failures = [];

const normalizeText = (document) => document.body.textContent.replace(/\s+/g, ' ').trim();
const signature = (document) =>
  [...document.querySelectorAll('h1, h2, h3, a, button, input, select, textarea, img')].map(
    (element) =>
      `${element.tagName}:${element.id}:${element.getAttribute('href') ?? ''}:${element.textContent.trim()}`,
  );

for (const route of HTML_ROUTES) {
  const legacy = new JSDOM(await readFile(resolveInside(repository, route), 'utf8')).window
    .document;
  const built = new JSDOM(await readFile(resolveInside(repository, `dist/${route}`), 'utf8')).window
    .document;
  if (legacy.title !== built.title) failures.push(`${route}: title differs`);
  if (normalizeText(legacy) !== normalizeText(built))
    failures.push(`${route}: visible text differs`);
  if (JSON.stringify(signature(legacy)) !== JSON.stringify(signature(built))) {
    failures.push(`${route}: interactive/content signature differs`);
  }
}

for (const directory of ['css', 'images', 'js']) {
  const walk = async (relative = '') => {
    const entries = await readdir(resolveInside(repository, `public/${directory}/${relative}`), {
      withFileTypes: true,
    });
    for (const entry of entries) {
      const child = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isDirectory()) await walk(child);
      else {
        const source = await readFile(resolveInside(repository, `public/${directory}/${child}`));
        const built = await readFile(resolveInside(repository, `dist/${directory}/${child}`));
        const digest = (value) => createHash('sha256').update(value).digest('hex');
        if (digest(source) !== digest(built))
          failures.push(`${directory}/${child}: asset hash differs`);
      }
    }
  };
  await walk();
}

if (failures.length > 0) throw new Error(`Legacy/Astro parity failures:\n${failures.join('\n')}`);
console.log(
  `Verified DOM/content parity for ${HTML_ROUTES.length} routes and byte parity for static assets.`,
);
