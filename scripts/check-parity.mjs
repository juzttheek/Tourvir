import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { HTML_ROUTES, resolveInside } from './lib/site-contract.mjs';

const repository = process.cwd();
const failures = [];
const values = (document, selector, mapper) => [...document.querySelectorAll(selector)].map(mapper);

for (const route of HTML_ROUTES) {
  const legacy = new JSDOM(await readFile(resolveInside(repository, route), 'utf8')).window
    .document;
  const built = new JSDOM(await readFile(resolveInside(repository, `dist/${route}`), 'utf8')).window
    .document;
  if (legacy.title !== built.title) failures.push(`${route}: title differs`);
  for (const [name, selector, mapper] of [
    ['headings', 'h1, h2, h3', (element) => element.textContent.replace(/\s+/g, ' ').trim()],
    [
      'controls',
      'input, select, textarea, button[type="submit"]',
      (element) => `${element.tagName}:${element.id}:${element.getAttribute('name') ?? ''}`,
    ],
  ]) {
    if (
      JSON.stringify(values(legacy, selector, mapper)) !==
      JSON.stringify(values(built, selector, mapper))
    )
      failures.push(`${route}: ${name} differ`);
  }
}

for (const directory of ['css', 'images']) {
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

if (failures.length > 0) throw new Error(`Compatibility failures:\n${failures.join('\n')}`);
console.log(
  `Verified semantic compatibility for ${HTML_ROUTES.length} routes and byte parity for CSS/images.`,
);
