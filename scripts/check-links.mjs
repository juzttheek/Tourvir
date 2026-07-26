import { access, readFile, readdir } from 'node:fs/promises';
import { cleanReference, isExternalReference, resolveInside } from './lib/site-contract.mjs';

const root = process.cwd();
const htmlFiles = (await readdir(root)).filter((name) => name.endsWith('.html')).sort();
const attributePattern = /\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;
const failures = [];

for (const filename of htmlFiles) {
  const html = await readFile(resolveInside(root, filename), 'utf8');
  for (const match of html.matchAll(attributePattern)) {
    const reference = match[1];
    if (!reference || isExternalReference(reference)) continue;
    const cleaned = cleanReference(reference);
    if (!cleaned) continue;

    try {
      await access(resolveInside(root, cleaned));
    } catch {
      failures.push(`${filename}: ${reference}`);
    }
  }
}

if (failures.length > 0) {
  throw new Error(`Missing local references:\n${failures.join('\n')}`);
}

console.log(`Validated local references across ${htmlFiles.length} HTML routes.`);
