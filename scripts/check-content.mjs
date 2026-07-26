import { readFile, readdir } from 'node:fs/promises';
import { resolveInside } from './lib/site-contract.mjs';

const root = process.cwd();
const htmlFiles = (await readdir(root)).filter((name) => name.endsWith('.html')).sort();
const forbiddenRuntime =
  /firebase|firestore|tourvir-fd341|gallery-admin|admin-trigger|admin-panel/i;
const failures = [];

for (const filename of htmlFiles) {
  const html = await readFile(resolveInside(root, filename), 'utf8');
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;

  if (duplicateIds.length > 0)
    failures.push(`${filename}: duplicate IDs ${duplicateIds.join(', ')}`);
  if (h1Count !== 1) failures.push(`${filename}: expected one h1, found ${h1Count}`);
  if (forbiddenRuntime.test(html)) failures.push(`${filename}: legacy Firebase/admin marker`);
}

const scripts = await Promise.all(
  (await readdir(resolveInside(root, 'js')))
    .filter((name) => name.endsWith('.js'))
    .map(async (name) => [name, await readFile(resolveInside(root, `js/${name}`), 'utf8')]),
);

for (const [name, source] of scripts) {
  if (forbiddenRuntime.test(source)) failures.push(`js/${name}: legacy Firebase/admin marker`);
  if (/sent successfully|submitted successfully/i.test(source)) {
    failures.push(`js/${name}: unconfirmed success message`);
  }
}

if (failures.length > 0) throw new Error(failures.join('\n'));
console.log(
  `Validated content contracts across ${htmlFiles.length} routes and ${scripts.length} scripts.`,
);
