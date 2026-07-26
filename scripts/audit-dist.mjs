import { readdir, readFile } from 'node:fs/promises';
import { HTML_ROUTES, resolveInside } from './lib/site-contract.mjs';

const root = resolveInside(process.cwd(), 'dist');
const allowedDirectories = new Set(['_assets', 'css', 'images', 'js']);
const allowedFiles = new Set(HTML_ROUTES);
const entries = await readdir(root, { withFileTypes: true });
const failures = [];

for (const entry of entries) {
  if (entry.isDirectory() && !allowedDirectories.has(entry.name))
    failures.push(`directory: ${entry.name}`);
  if (entry.isFile() && !allowedFiles.has(entry.name)) failures.push(`file: ${entry.name}`);
}

for (const route of HTML_ROUTES) {
  const html = await readFile(resolveInside(root, route), 'utf8');
  if (/firebase|firestore|tourvir-fd341|gallery-admin|admin-panel/i.test(html)) {
    failures.push(`${route}: retired Firebase/admin code`);
  }
}

if (failures.length > 0) throw new Error(`Unexpected deploy output:\n${failures.join('\n')}`);
console.log(
  `Audited dist allowlist: ${HTML_ROUTES.length} routes and approved static assets only.`,
);
