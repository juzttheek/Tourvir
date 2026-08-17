import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { HTML_ROUTES, listFilesRecursive, resolveInside } from './lib/site-contract.mjs';

const repository = process.cwd();
const dist = resolveInside(repository, 'dist');
const failures = [];

for (const route of HTML_ROUTES) {
  try {
    await access(resolveInside(dist, route));
  } catch {
    failures.push(`${route}: required build output is missing`);
  }
}

let contentRouteCount = 0;
for (const collection of ['blog', 'packages']) {
  const sourceDirectory = resolveInside(repository, `src/data/${collection}`);
  const builtDirectory = resolveInside(dist, collection);
  const expectedRoutes = (await readdir(sourceDirectory))
    .filter((name) => name.endsWith('.json'))
    .map((name) => name.replace(/\.json$/, '.html'))
    .sort();
  const builtRoutes = (await readdir(builtDirectory))
    .filter((name) => name.endsWith('.html'))
    .sort();

  contentRouteCount += expectedRoutes.length;
  if (JSON.stringify(expectedRoutes) !== JSON.stringify(builtRoutes)) {
    failures.push(
      `${collection}: generated routes differ (expected ${expectedRoutes.join(', ')}; found ${builtRoutes.join(', ')})`,
    );
  }

  for (const route of builtRoutes) {
    const document = new JSDOM(await readFile(resolveInside(builtDirectory, route), 'utf8')).window
      .document;
    if (!document.title.trim()) failures.push(`${collection}/${route}: title is empty`);
    if (document.querySelectorAll('h1').length !== 1) {
      failures.push(`${collection}/${route}: expected exactly one h1`);
    }
  }
}

const publicRoot = resolveInside(repository, 'public');
const publicFiles = await listFilesRecursive(publicRoot);
const digest = (value) => createHash('sha256').update(value).digest('hex');

for (const filename of publicFiles) {
  try {
    const source = await readFile(resolveInside(publicRoot, filename));
    const built = await readFile(resolveInside(dist, filename));
    if (digest(source) !== digest(built)) failures.push(`${filename}: public asset hash differs`);
  } catch {
    failures.push(`${filename}: public asset is missing from the build`);
  }
}

if (failures.length > 0) throw new Error(`Build parity failures:\n${failures.join('\n')}`);
console.log(
  `Verified ${HTML_ROUTES.length} required outputs, ${contentRouteCount} content routes, and byte parity for ${publicFiles.length} public files.`,
);
